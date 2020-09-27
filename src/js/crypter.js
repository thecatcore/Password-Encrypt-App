const plus = 32;

function encrypt(input, keys) {
    let output = {
        target: "",
        username: "",
        password: ""
    }
    output.target = encryptString(encryptString(input.target, keys.username), keys.password)
    output.username = encryptString(encryptString(input.username, keys.username), keys.password)
    output.password = encryptString(encryptString(input.password, keys.username), keys.password)
    return output;
}

function encryptString(input, key) {
    var inputReturned = "";
    var readedInput = input;

    while (readedInput.length > 0) {
        for (var i in key) {
            if (readedInput.length <= 0) break
            encryptedChar = getEncryptedChar(readedInput.charCodeAt(0), key[i].charCodeAt());
            inputReturned = inputReturned + String.fromCharCode(encryptedChar);
            readedInput = readedInput.substr(1)
        }
    }
    return inputReturned;
}

function getEncryptedChar(input, key) {
    return (input - plus) + (key - plus) + plus;
}

function unencrypt(input, keys) {
    let output = {
        target: "",
        username: "",
        password: ""
    }
    output.target = unencryptString(unencryptString(input.target, keys.password), keys.username)
    output.username = unencryptString(unencryptString(input.username, keys.password), keys.username)
    output.password = unencryptString(unencryptString(input.password, keys.password), keys.username)
    return output;
}

function unencryptString(input, key) {
    var inputReturned = "";
    var readedInput = input;

    while (readedInput.length > 0) {
        for (var i in key) {
            if (readedInput.length <= 0) break
            encryptedChar = getUnencryptedChar(readedInput.charCodeAt(0), key[i].charCodeAt());
            inputReturned = inputReturned + String.fromCharCode(encryptedChar);
            readedInput = readedInput.substr(1)
        }
    }
    return inputReturned;
}

function getUnencryptedChar(input, key) {
    return (input - plus) - (key - plus) + plus;
}

module.exports = {
    encrypt: (input, key) => encrypt(input, key),
    unencrypt: (input, key) => unencrypt(input, key)
}