import { ethers } from "ethers";

const contractABI = [
  "function addHash(string _hash) public",
  "function findHash(string _hash) public view returns (bool)",
  "function getAllHashes() public view returns (string[] memory)"
];

const contractAddress = "0xC2ff2C30c4d6108804bc09738F1622983333335B";

// If this isn't a real React hook, rename it; hooks shouldn't be async.
// Use this as a plain helper you call after a user clicks "Connect".
export async function getContract() {
  if (typeof window === "undefined") throw new Error("Client-only");
  const { ethereum } = window;
  if (!ethereum) throw new Error("MetaMask is not installed");

  const provider = new ethers.providers.Web3Provider(ethereum, "any");

  // Ask the wallet for permission + accounts
  await provider.send("eth_requestAccounts", []);

  // (Optional) make sure you're on the right network
  // await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]); // example: Ethereum mainnet

  const signer = provider.getSigner();
  // This will now work—useful sanity check:
  // console.log("Using address:", await signer.getAddress());

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return { contract, signer, provider };
}
