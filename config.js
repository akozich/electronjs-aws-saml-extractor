const util = require('util');
const fs = require('fs');
const tempraryCredentialLocation = require('./options').config_file;

/**
 *
 * @param {*} credentialData
 */
function saveCredentials(credentialData) {
	return util.promisify(fs.writeFile)(tempraryCredentialLocation, JSON.stringify(credentialData, null, 2));
}

function loadCredentials() {
	return util.promisify(fs.readFile)(tempraryCredentialLocation).then(JSON.parse);
}

module.exports = {loadCredentials, saveCredentials};
