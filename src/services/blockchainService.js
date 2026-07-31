const { ethers } = require('ethers');

const RPC_URL = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology/'; 
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000'; // Default mock for dev
const CONTRACT_ADDRESS = process.env.CERTIFICATE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

const contractABI = [
  "function issueCertificate(string _certificateId, string _userId, string _certHash) external",
  "function verifyCertificate(string _certificateId) external view returns (bool, string, string, uint256)"
];

exports.issueBlockchainCertificate = async (certificateId, userId, certHash) => {
  // If no real private key is provided, we simulate the transaction for development purposes
  if (PRIVATE_KEY === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    console.log('Simulating blockchain transaction...');
    return {
      transactionHash: '0x' + Math.random().toString(16).substring(2, 15) + Math.random().toString(16).substring(2, 15),
      blockNumber: Math.floor(Math.random() * 10000000)
    };
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

  const tx = await contract.issueCertificate(certificateId, userId, certHash);
  const receipt = await tx.wait();

  return {
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
};
