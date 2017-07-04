// ----- Encryption -----

function
initEncryptionToServer()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/loadKey.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			cryptToServer.setKey(request.responseText);
		}
	    };
	request.send("load=" + RSA_key_length);
}

function
initEncryptionToClient()
{
	cryptToClient.getKey();
}

function
encrypt(text)
{
	// encrypt with server's public key
	if (typeof text === "undefined" || text.length < 1) {
		return "";
	}
	let text_encoded = encodeURIComponent(text);
	let encrypted = "";
	let i = 0;
	for (i = 0; i < Math.ceil(text_encoded.length / maxEncryptLength); i++) {
		encrypted += cryptToServer.encrypt(text_encoded.slice(maxEncryptLength * i, Math.min(maxEncryptLength * (i + 1), text_encoded.length))) + "|";
	}
	return encrypted.slice(0, -1);
}

function
decrypt(text)
{
	// decrypt with client generated private key
	if (typeof text === "undefined" || text.length < 1) {
		return "";
	}
	let encrypted = text.split("|");
	let decrypted = "";
	let i = 0;
	for (i = 0; i < encrypted.length; i++) {
		if (encrypted[i].length < 1) {
			continue;
		}
		decrypted += cryptToClient.decrypt(encrypted[i]);
	}
	return decodeURIComponent(decrypted);
}

