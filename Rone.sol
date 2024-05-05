// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Rone {
    event ImageRecorded(string hash);

    mapping(string => bool) public imageHashes;
    string[] public allHashes;

    function addHash(string memory _hash) public {
        require(!imageHashes[_hash], "Image hash already recorded.");
        imageHashes[_hash] = true;
        allHashes.push(_hash);
        emit ImageRecorded(_hash);
    }

    function getAllHashes() public view returns (string[] memory) {
        return allHashes;
    }
}