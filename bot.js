const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Load wallet addresses
const walletAddresses = fs.readFileSync('data.txt', 'utf-8').trim().split('\n');

// Load proxies
const proxies = fs.readFileSync('proxy.txt', 'utf-8').trim().split('\n');

// Function to claim faucet
const claimFaucet = async (walletAddress) => {
  const data = qs.stringify({
    network: 'base',
    account: walletAddress,
    tokens: ['eth', 'wsteth'],
  }, { arrayFormat: 'repeat' });

  let success = false;

  for (let i = 0; i < proxies.length && !success; i++) {
    const proxy = proxies[i];

    try {
      const proxyUrl = proxy.startsWith('http') ? proxy : `http://${proxy}`;
      const agent = new HttpsProxyAgent(proxyUrl);

      const response = await axios.post(
        'https://faucet.omni.network/base-sepolia?_data=routes%2Fbase-sepolia',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Origin': 'https://faucet.omni.network',
            'Referer': 'https://faucet.omni.network/base-sepolia',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          httpsAgent: agent,
          timeout: 15000 // optional timeout
        }
      );

      console.log(`[✔️] Claim successful for ${walletAddress} using proxy ${proxy}:`, response.data);
      success = true;

    } catch (error) {
      console.error(`[✖️] Claim failed for ${walletAddress} with proxy ${proxy}:`, error.message);
      if (error.response?.data) {
        console.error(`→ Server response:`, error.response.data);
      }

      if (i === proxies.length - 1) {
        console.error(`All proxies failed for ${walletAddress}!`);
      }
    }
  }

  if (!success) {
    console.log(`[✖️] Could not claim for ${walletAddress} after trying all proxies.`);
  }
};

// Run claims for all wallets
const runAllClaims = async () => {
  console.log(`\n⏰ Running faucet claim at ${new Date().toLocaleString()}`);
  for (const walletAddress of walletAddresses) {
    await claimFaucet(walletAddress);
    await new Promise(r => setTimeout(r, 5000)); // delay between claims
  }
  console.log(`\n🕒 Waiting for the next claim...\n`);
};

// First run
runAllClaims();

// Interval: 30 seconds
const interval = (3 * 60 + 1) * 60 * 1000; // 3 hours and 1 minute in milliseconds
setInterval(runAllClaims, interval);
