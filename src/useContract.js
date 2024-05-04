import { ethers } from 'ethers';

const contractABI = [
    "function addHash(string memory _hash) public",
    "function findHash(string memory _hash) public view returns (bool)",
    "function getAllHashes() public view returns (string[] memory)"
];

const contractAddress = "0xC2ff2C30c4d6108804bc09738F1622983333335B";


export function useContract() {
    const { ethereum } = window;
    if (!ethereum) {
        console.error("MetaMask is not installed!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    return contract;
}
