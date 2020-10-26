const {ipcRenderer, remote} = require("electron")

const USERNAME = "Username needs to be specified";
const PASSWORD = "Password needs to be specified";

document.getElementById("login").onclick = async () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    console.log("\"" + username + "\"")
    if (!username) {
        sendErrorMessage(USERNAME)
    } else {
        if (!password) {
            sendErrorMessage(PASSWORD)
        } else {
            ipcRenderer.send("login", {username: username, password: password})
        }
    }
}

function sendErrorMessage(message) {
    document.getElementById("error_label").innerHTML = message;
}

document.getElementById("close-btn").onclick = () => {
    remote.getCurrentWindow().close()
}