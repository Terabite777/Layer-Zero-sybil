const { Wallet } = require('ethers');
const http = require('redaxios');
const fs = require('fs');
const path = require('path');

const privateKeyFilePath = path.join(__dirname, 'privateKeys.txt'); 

function readPrivateKeysFromFile(filePath) {
    try {
        const privateKeys = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        return privateKeys;
    } catch (error) {
        throw new Error('Failed to read private keys from file:', error);
    }
}

const privateKeys = readPrivateKeysFromFile(privateKeyFilePath);

async function sendReport(privateKey) {
    const wallet = new Wallet(privateKey.trim());
    const message = 'This is a sybil address';
    try {
        const signature = await wallet.signMessage(message);
        const { data } = await http.post('https://sybil.layerzero.network/api/report', {
            chainType: 'evm',
            signature,
            message,
            address: wallet.address,
        });
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

privateKeys.forEach(sendReport);
