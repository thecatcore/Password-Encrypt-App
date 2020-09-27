const {app, BrowserWindow, ipcMain} = require("electron")
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const csvReader = require("csv-parser")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const {encrypt, unencrypt} = require("./crypter.js");

const userDataPath = app.getPath("userData");
const passwordsPath = path.join(userDataPath, "passwords.csv")
const passExist = fs.existsSync(passwordsPath);

let win;
let update = false;

async function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: true
        }
    })

    win.once('ready-to-show', async () => {
        let updateCheckResult =  await autoUpdater.checkForUpdatesAndNotify();
        if (!updateCheckResult) update = true;
    })

    let key = {
        username: "",
        password: ""
    }

    await win.loadFile(path.join(__dirname, '../html/login.html'))
    ipcMain.on("login", async (event, args) => {
        key = args;
        await win.loadFile(path.join(__dirname, "../html/index.html"))
        readDatabase(win, key)
    })

    ipcMain.on("add-id", (event) => {
        let addWin = new BrowserWindow({
            width: 400,
            height: 300,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        })

        addWin.loadFile(path.join(__dirname, "../html/add.html"))
    })

    ipcMain.on("add", async (event, args) => {
        event.reply("close-add")
        await win.loadFile(path.join(__dirname, "../html/index.html"))
        updateDatabase(args, key, win)
    })

    ipcMain.on("del-row", async (event, arg) => {
        await win.loadFile(path.join(__dirname, "../html/index.html"))
        removeElement(arg.index, key, win)
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

function removeElement(rowIndex, key, window) {
    let list = []

    fs.createReadStream(passwordsPath).pipe(csvReader()).on('data', (row) => {
        if (!row["Target"]) return;
        var deciphered = {
            target: "",
            username: "",
            password: ""
        }
        var deciphered = unencrypt({target: row.Target, username: row.Username, password: row.Password}, key)
        list.push(deciphered)
    }).on('end', async () => {

        let cipheredList = []

        for (var i in list) {
            if (i === rowIndex) continue
            cipheredList.push(encrypt(list[i], key))
        }

        let csvWriter = createCsvWriter({
            path: passwordsPath,
            header: [
                {id:"target", title:"Target"},
                {id:"username", title:"Username"},
                {id:"password", title:"Password"}
            ]
        })
        await csvWriter.writeRecords(cipheredList).then(async () => {
            await readDatabase(window, key)
        })
    })
}

function updateDatabase(row, key, window) {
    let list = []

    fs.createReadStream(passwordsPath).pipe(csvReader()).on('data', (row) => {
        if (!row["Target"]) return;
        var deciphered = {
            target: "",
            username: "",
            password: ""
        }
        var deciphered = unencrypt({target: row.Target, username: row.Username, password: row.Password}, key)
        list.push(deciphered)
    }).on('end', async () => {
        list.push(row);

        let cipheredList = []

        for (var i in list) {
            cipheredList.push(encrypt(list[i], key))
        }

        let csvWriter = createCsvWriter({
            path: passwordsPath,
            header: [
                {id:"target", title:"Target"},
                {id:"username", title:"Username"},
                {id:"password", title:"Password"}
            ]
        })
        await csvWriter.writeRecords(cipheredList).then(async () => {
            await readDatabase(window, key)
        })
    })
}

async function readDatabase(window, key) {
    if (!passExist) {
        let csvWriter = createCsvWriter({
            path: passwordsPath,
            header: [
                {id:"target", title:"Target"},
                {id:"username", title:"Username"},
                {id:"password", title:"Password"}
            ]
        })
        await csvWriter.writeRecords([]).then(() => {
            console.log("Config generated")
        })
    }

    let list = []

    fs.createReadStream(passwordsPath).pipe(csvReader()).on('data', (row) => {
        if (!row["Target"]) return;
        var deciphered = {
            target: "",
            username: "",
            password: ""
        }
        var deciphered = unencrypt({target: row.Target, username: row.Username, password: row.Password}, key)
        list.push(deciphered)
    }).on('end', () => {
        console.log("Config read")
        window.webContents.send("update-list", list)
    })
}

