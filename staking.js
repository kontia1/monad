import { ethers } from "ethers";
import fs from 'fs';
import Web3 from 'web3';

const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";
const RPC_URL = "https://testnet-rpc.monad.xyz/";
const SHMONAD_CONTRACT = "0x3a98250F98Dd388C211206983453837C8365BDc1";
const KINTSU_CONTRACT = "0x07aabd925866e8353407e67c1d157836f7ad923e";
const APRIO_CONTRACT = "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A";
const MAGMA_CONTRACT = "0x2c9C959516e9AAEdB2C748224a41249202ca8BE7";
const web3 = new Web3(RPC_URL);

const gasLimits = { 
  aprioStake: 85000, aprioUnstake: 160000, 
  magmaStake: 95000, magmaUnstake: 105000,
  kintsuStake: 110000, kintsuUnstake: 100000,
  shmonStake: 65000, shmonUnstake: 75000
};

const getRandomAmount = (min, max) => ethers.parseEther((Math.random() * (max - min) + min).toFixed(6));

async function sendTransaction(wallet, to, data, value, gasLimit) {
  try {
    const tx = { to, data, gasLimit: ethers.toBeHex(gasLimit), value };
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`✅ successful! Transaction: ${EXPLORER_URL}${txResponse.hash}`);
    await txResponse.wait();
  } catch (error) {
    console.error(`[${wallet.address}] Transaction failed:`, error.message);
  }
}

// 🟢 Magma Staking & Unstaking
export async function stakeMagmaMON(wallet) {
  const stakeAmount = getRandomAmount(0.003, 0.006);
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} MON in Magma...`);
  const data = "0xd5575982";
  await sendTransaction(wallet, MAGMA_CONTRACT, data, stakeAmount, gasLimits.magmaStake);
  return stakeAmount;
}

export async function unstakeMagmaMON(wallet) {
  const unstakeAmount = getRandomAmount(0.001, 0.002);
  console.log(`[${wallet.address}] Unstaking ${ethers.formatEther(unstakeAmount)} MON from Magma...`);
  const unstakeAmountHex = ethers.zeroPadValue(ethers.toBeHex(unstakeAmount), 32);
  const data = "0x6fed1ea7" + unstakeAmountHex.slice(2);
  await sendTransaction(wallet, MAGMA_CONTRACT, data, ethers.parseEther("0"), gasLimits.magmaUnstake);
}

// 🟢 Aprio Staking & Unstaking
export async function stakeAprioMON(wallet) {
  const stakeAmount = getRandomAmount(0.003, 0.005);
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} MON in Aprio...`);
  const data = "0x6e553f65" + ethers.zeroPadValue(ethers.toBeHex(stakeAmount), 32).slice(2) + ethers.zeroPadValue(wallet.address, 32).slice(2);
  await sendTransaction(wallet, APRIO_CONTRACT, data, stakeAmount, gasLimits.aprioStake);
  return stakeAmount;
}

export async function requestUnstakeAprMON(wallet) {
  const amountToUnstake = getRandomAmount(0.001, 0.002);
  console.log(`[${wallet.address}] Requesting unstake for ${ethers.formatEther(amountToUnstake)} aprMON...`);
  const data = "0x7d41c86e" + ethers.zeroPadValue(ethers.toBeHex(amountToUnstake), 32).slice(2) + ethers.zeroPadValue(wallet.address, 32).slice(2).repeat(2);
  await sendTransaction(wallet, APRIO_CONTRACT, data, ethers.parseEther("0"), gasLimits.aprioUnstake);
}

// 🟢 Kintsu Staking & Unstaking
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

// 🟢 SHMON Staking & Unstaking
export async function stakeSHMonad(wallet) {
  const stakeAmount = getRandomAmount(0.005, 0.009);
  console.log(`[${wallet.address}] Staking ${ethers.formatEther(stakeAmount)} SHMON...`);
  const data = web3.eth.abi.encodeFunctionCall({
    name: "deposit",
    type: "function",
    inputs: [
      { type: "uint256", name: "amount" },
      { type: "address", name: "recipient" }
    ]
  }, [stakeAmount, wallet.address]);
  await sendTransaction(wallet, SHMONAD_CONTRACT, data, stakeAmount, gasLimits.shmonStake);
}

export async function unstakeSHMonad(wallet) {
  const unstakeAmount = getRandomAmount(0.001, 0.003);
  console.log(`[${wallet.address}] Unstaking ${ethers.formatEther(unstakeAmount)} SHMON...`);
  const data = web3.eth.abi.encodeFunctionCall({
    name: "redeem",
    type: "function",
    inputs: [
      { type: "uint256", name: "amount" },
      { type: "address", name: "recipient" },
      { type: "address", name: "sender" }
    ]
  }, [unstakeAmount, wallet.address, wallet.address]);
  await sendTransaction(wallet, SHMONAD_CONTRACT, data, ethers.parseEther("0"), gasLimits.shmonUnstake);
}
