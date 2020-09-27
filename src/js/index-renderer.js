const {ipcRenderer, ipcMain} = require("electron")

function addId() {
    ipcRenderer.send("add-id");
}

ipcRenderer.on("update-list", (event, args) => {
    let table = document.getElementById("passwords")

    for (var i in args) {
        var row = table.insertRow(-1)

        var target = row.insertCell(0)
        var username = row.insertCell(1)
        var password = row.insertCell(2)
        var del = row.insertCell(3)

        const ii = i;

        var type = document.createAttribute("type")
        type.value = "button"

        var classA = document.createAttribute("class")
        classA.value = "button_remove"

        var delButton = document.createElement("button");
        delButton.innerHTML = "X"
        delButton.onclick = () => {
            ipcRenderer.send("del-row", {index: ii})
        }
        delButton.setAttributeNode(type)
        delButton.setAttributeNode(classA)

        target.innerHTML = args[i].target
        username.innerHTML = args[i].username
        password.innerHTML = args[i].password
        del.appendChild(delButton);
    }
})