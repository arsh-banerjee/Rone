import React, { useState } from 'react';
import { useContract } from './useContract';
import 'bulma/css/bulma.min.css';  

function App() {
  const [file] = useState(null);
  const [hash, setHash] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const contract = useContract();

  const onFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const pHash = window.pHash;
      pHash.hash(file).then(hash => {
        setHash(hash.toHex());
      }).catch(error => {
        console.error('Error computing the image hash:', error);
      });
    }
  };

  const recordHash = async () => {
    if (!hash.trim()) {
      alert('Please upload a file to generate a hash.');
      return;
    }
    try {
      const tx = await contract.addHash(hash);
      await tx.wait();
      alert('Hash recorded successfully!');
    } catch (error) {
      alert(`Failed to record hash: ${error.message}`);
    }
  };

  const verifyHash = async () => {
    if (!hashToVerify.trim()) {
      alert('Please enter a hash with which to search.');
      return;
    }
    try {
      const hashes = await contract.getAllHashes();
      let closestHash = null;
      let minDistance = Number.MAX_SAFE_INTEGER;

      for (const storedHash of hashes) {
        const distance = hammingDistance(storedHash, hashToVerify);
        if (distance < minDistance) {
          minDistance = distance;
          closestHash = storedHash;
        }
      }

      if (minDistance < 2) {  // Define your own threshold for "similarity"
        setVerificationResult(`Closest match found: ${closestHash} with Hamming distance of ${minDistance}`);
      } else {
        setVerificationResult("No similar hash found.");
      }
    } catch (error) {
      alert(`Failed to verify hash: ${error.message}`);
    }
  };

  function hammingDistance(str1, str2) {
    let dist = 0;
    const length = Math.min(str1.length, str2.length);
    for (let i = 0; i < length; i++) {
        if (str1[i] !== str2[i]) {
            dist++;
        }
    }
    return dist;
}

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Rone: An application to find image provenance</h1>
        <div className="file has-name is-boxed">
          <label className="file-label">
            <input className="file-input" type="file" onChange={onFileChange} />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">
                Choose a file…
              </span>
            </span>
            {file && <span className="file-name">{file.name}</span>}
          </label>
        </div>
        <button className="button is-primary" onClick={recordHash}>Record Hash of Uploaded Image</button>
        <p>Hash: {hash}</p>

        <h2 className="title">Search for an image hash</h2>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input className="input" type="text" value={hashToVerify} onChange={(e) => setHashToVerify(e.target.value)} placeholder="Enter hash to search" />
          </div>
          <div className="control">
            <button className="button is-link" onClick={verifyHash}>Search for Hash</button>
          </div>
        </div>
        {verificationResult && (
          <p className="verification-result">{verificationResult}</p>
        )}
      </div>
    </section>
  );
}

export default App;
