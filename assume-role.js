const STS = require('aws-sdk/clients/sts');
const {roleArn, principalArn} = require('./options');
const config = require('./config');

/**
 * Aquire the object which has all the data needed for a credential provider.
 *
 * @param {string} samlResponse Base64 encoded SAML Response.
 */
function aquireShortLivedCredentials(samlResponse) {
	return new STS().assumeRoleWithSAML({
		// TODO get the principal from the SAML response
		PrincipalArn: principalArn,
		// TODO get the role from the SAML response if there's just one
		RoleArn: roleArn,
		SAMLAssertion: samlResponse
	}).promise().then(saveAndReturn);
}

function saveAndReturn(stsResponse) {
	const fileFormat = {...stsResponse.Credentials, Version: 1};
	return config.saveCredentials(fileFormat).then(() => fileFormat);
}

module.exports = {aquireShortLivedCredentials};
