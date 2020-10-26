const {ipcRenderer, remote} = require("electron")

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

        var id = document.createAttribute("id")
        id.value = "buttonZ"

        var src1 = document.createAttribute("src")
        src1.value = "../../src/img/remove_normal.svg"
        var img1 = document.createElement("img")
        img1.setAttributeNode(src1)

        var src2 = document.createAttribute("src")
        src2.value = "../../src/img/remove_normal.svg"
        var img2 = document.createElement("img")
        img2.setAttributeNode(src2)

        var delButton = document.createElement("a");
        delButton.onclick = () => {
            ipcRenderer.send("del-row", {index: ii})
        }
        delButton.setAttributeNode(id)
        delButton.appendChild(img1)
        delButton.appendChild(img2)

        target.innerHTML = args[i].target
        username.innerHTML = args[i].username
        password.innerHTML = args[i].password
        del.appendChild(delButton);
    }
})

document.getElementById("close-btn").onclick = () => {
    remote.getCurrentWindow().close()
}