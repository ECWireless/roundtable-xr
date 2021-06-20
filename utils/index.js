const fs = require('fs');
const Arweave = require('arweave');
const crypto = require('crypto');

const dirExists = (dir) => {
	return fs.existsSync(dir);
};

const toHash = async (data) => {
	const hash = crypto.createHash('sha256');
	hash.update(data);
	return hash.digest('hex');
};

function useArweave() {
	const arweave = Arweave.init({
		host: 'arweave.net',
		port: 443,
		protocol: 'https',
		timeout: 20000,
		logging: false,
	});

	return arweave;
}

module.exports = {
	dirExists,
	toHash,
	useArweave,
};