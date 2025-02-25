import { ethers } from "ethers";

const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";

const gasLimits = { 
  aprioStake: 75000, aprioUnstake: 160000, 
  magmaStake: 85000, magmaUnstake: 100000,
  kintsuStake: 110000, kintsuUnstake: 100000
};

const getRandomAmount = (min, max) => ethers.parseEther((Math.random() * (max - min) + min).toFixed(6));

async function sendTransaction(wallet, to, data, value, gasLimit) {
  try {
    const tx = { to, data, gasLimit: ethers.toBeHex(gasLimit), value };
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`[${wallet.address}] TX: ${EXPLORER_URL}${txResponse.hash}`);
    await txResponse.wait();
  } catch (error) {
    console.error(`[${wallet.address}] Transaction failed:`, error.message);
  }
}

// 🟢 Aprio Staking & Unstaking
export async function stakeAprioMON(wallet, STAKE_CONTRACT) {
  const stakeAmount = getRandomAmount(0.003, 0.005);
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} MON in Aprio...`);
  const data = "0x6e553f65" + ethers.zeroPadValue(ethers.toBeHex(stakeAmount), 32).slice(2) + ethers.zeroPadValue(wallet.address, 32).slice(2);
  await sendTransaction(wallet, STAKE_CONTRACT, data, stakeAmount, gasLimits.aprioStake);
  return stakeAmount;
}

export async function requestUnstakeAprMON(wallet, STAKE_CONTRACT) {
  const amountToUnstake = getRandomAmount(0.001, 0.002);
  console.log(`[${wallet.address}] Requesting unstake for ${ethers.formatEther(amountToUnstake)} aprMON...`);
  const data = "0x7d41c86e" + ethers.zeroPadValue(ethers.toBeHex(amountToUnstake), 32).slice(2) + ethers.zeroPadValue(wallet.address, 32).slice(2).repeat(2);
  await sendTransaction(wallet, STAKE_CONTRACT, data, ethers.parseEther("0"), gasLimits.aprioUnstake);
}

// 🟢 Magma Staking & Unstaking
export async function stakeMagmaMON(wallet, MAGMA_CONTRACT) {
  const stakeAmount = getRandomAmount(0.003, 0.005);
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} MON in Magma...`);
  const data = "0xd5575982";
  await sendTransaction(wallet, MAGMA_CONTRACT, data, stakeAmount, gasLimits.magmaStake);
  return stakeAmount;
}

export async function unstakeMagmaMON(wallet, MAGMA_CONTRACT) {
  const amountToUnstake = getRandomAmount(0.003, 0.005);
  console.log(`[${wallet.address}] Unstaking ${ethers.formatEther(amountToUnstake)} gMON from Magma...`);
  const functionSelector = "0x6fed1ea7";
  const paddedAmount = ethers.zeroPadValue(ethers.toBeHex(amountToUnstake), 32);
  const data = functionSelector + paddedAmount.slice(2);
  await sendTransaction(wallet, MAGMA_CONTRACT, data, ethers.parseEther("0"), gasLimits.magmaUnstake);
}

// 🟢 Kintsu Staking & Unstaking
const KINTSU_CONTRACT = "0x07aabd925866e8353407e67c1d157836f7ad923e";

export async function stakeKintsuMON(wallet) {
  const stakeAmount = ethers.parseEther("0.01");
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} MON in Kintsu...`);
  const data = "0x3a4b66f1"; 
  await sendTransaction(wallet, KINTSU_CONTRACT, data, stakeAmount, gasLimits.kintsuStake);
  return stakeAmount;
}

export async function unstakeKintsuMON(wallet) {
  const amountToUnstake = getRandomAmount(0.007, 0.009);
  console.log(`[${wallet.address}] Unstaking ${ethers.formatEther(amountToUnstake)} sMON from Kintsu...`);
  const functionSelector = "0x30af6b2e";
  const paddedAmount = ethers.zeroPadValue(ethers.toBeHex(amountToUnstake), 32);
  const data = functionSelector + paddedAmount.slice(2);
  await sendTransaction(wallet, KINTSU_CONTRACT, data, ethers.parseEther("0"), gasLimits.kintsuUnstake);
}
