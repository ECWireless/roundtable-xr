const fs = require('fs');
const fg = require('fast-glob');
const PromisePool = require('@supercharge/promise-pool');
const mime = require('mime');
const dotenv = require('dotenv');
const { dirExists, toHash, useArweave } = require('../utils');
dotenv.config();
const arweave = useArweave();

const txs = [];
let txId = '';

const deploy = async (dir) => {
	const wallet = JSON.parse(process.env.WALLET);

	if (!dirExists(dir)) {
		console.log('Directory doesn\'t exist');
		process.exit(0);
	}

	let files = [dir];
	if (fs.lstatSync(dir).isDirectory()) {
		files = await fg([`${dir}/**/*`], { dot: false });
	}

	await PromisePool.withConcurrency(10)
		.for(files)
		.process(async (file) => {
			await prepareFiles(file, wallet);
			return true;
		});

	await buildManifest(wallet, dir);

	await PromisePool.withConcurrency(5)
		.for(txs)
		.process(async (txData) => {
			await upload(txData);
			return true;
		});

	return txId;
};

const prepareFiles = async (f, wallet) => {
	return new Promise((resolve) => {
		fs.readFile(f, async (err, data) => {
			if (err) {
				console.log('Unable to read file ' + f);
				throw new Error(`Unable to read file: ${f}`);
			}

			if (!data || !data.length) {
				resolve(true);
			}

			const hash = await toHash(data);
			const type = mime.getType(f);
			const tx = await buildTransaction(wallet, hash, data, type);
			txs.push({ path: f, hash, tx, type });
			resolve(true);
		});
	});
};

const buildTransaction = async (wallet, hash, data, type) => {
	const tx = await arweave.createTransaction({ data }, wallet);

	tx.addTag('User-Agent', 'arkb');
	tx.addTag('Type', 'file');
	tx.addTag('Content-Type', type);
	tx.addTag('File-Hash', hash);

	await arweave.transactions.sign(tx, wallet);
	return tx;
};

const buildManifest = async (wallet, dir, index = null) => {
	const paths = {};

	for (let i = 0, j = txs.length; i < j; i++) {
		const t = txs[i];
		const path = `${t.path.split(`${dir}/`)[1]}`;
		t.path = path;
		paths[path] = { id: t.tx.id };
	}

	if (!index) {
		if (Object.keys(paths).includes('index.html')) {
			index = 'index.html';
		}
		else {
			index = Object.keys(paths)[0];
		}
	}
	else if (!Object.keys(paths).includes(index)) {
		index = Object.keys(paths)[0];
	}

	const data = {
		manifest: 'arweave/paths',
		version: '0.1.0',
		index: {
			path: index,
		},
		paths,
	};

	const tx = await arweave.createTransaction({ data: JSON.stringify(data) }, wallet);

	tx.addTag('User-Agent', 'arkb');
	tx.addTag('Type', 'manifest');
	tx.addTag('Content-Type', 'application/x.arweave-manifest+json');

	await arweave.transactions.sign(tx, wallet);
	txs.push({ path: '', hash: '', tx, type: 'application/x.arweave-manifest+json' });

	return true;
};

const upload = async (txData) => {
	const uploader = await arweave.transactions.getUploader(txData.tx);
	while (!uploader.isComplete) {
		await uploader.uploadChunk();
		// console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
		// console.log(txData.tx.id);
		if (txData.hash === '') {
			txId = txData.tx.id;
			console.log(`Link: https://arweave.net/${txData.tx.id}`);
		}
	}
};

module.exports = {
	deploy,
};
