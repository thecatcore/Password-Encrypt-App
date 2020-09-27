const {ipcRenderer, remote} = require("electron")

const TARGET = "Target needs to be specified";
const USERNAME = "Username needs to be specified";
const PASSWORD = "Password needs to be specified";

document.getElementById("add").onclick = async () => {
    let target = document.getElementById("target").value
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    if (!target) {
        sendErrorMessage(TARGET)
    } else {
        if (!username) {
            sendErrorMessage(USERNAME)
        } else {
            if (!password) {
                sendErrorMessage(PASSWORD)
            } else {
                ipcRenderer.send("add", {target: target, username: username, password: password})
            }
        }
    }
}

ipcRenderer.on("close-add", (event) => {
    var window = remote.getCurrentWindow()
    window.close()
})

function sendErrorMessage(message) {
    document.getElementById("error_label").innerHTML = message;
}

document.getElementById("close-btn").onclick = () => {
    remote.getCurrentWindow().close()
}