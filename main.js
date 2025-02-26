import { ethers } from "ethers";
import fs from "fs";
import { wrapMON, unwrapMON, swapEthForTokens, getRandomAmount, delay } from "./swap.js";
import { stakeAprioMON, requestUnstakeAprMON, stakeMagmaMON, unstakeMagmaMON, stakeKintsuMON, unstakeKintsuMON } from "./staking.js";
import { RPC_URL, CONTRACTS } from "./config.js";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const PRIVATE_KEYS = fs.readFileSync("wallet.txt", "utf8").trim().split("\n");
if (PRIVATE_KEYS.length === 0) throw new Error("No Private Keys found in wallet.txt");

const wallets = PRIVATE_KEYS.map(key => new ethers.Wallet(key, provider));
const TOKEN_ADDRESSES = Object.entries(CONTRACTS.TOKENS).map(([symbol, address]) => ({ symbol, address }));
const STAKE_CONTRACT = "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A";
const MAGMA_CONTRACT = "0x2c9C959516e9AAEdB2C748224a41249202ca8BE7";
const MON_CONTRACT = CONTRACTS.WMON;

let dayCounter = (new Date().getDate() % 3) + 1; // Keeps track of the 3-day cycle

async function getWalletBalances() {
    console.log("\nWallet Balances (MON):");
    for (const wallet of wallets) {
        const balance = await provider.getBalance(wallet.address);
        console.log(`[${wallet.address}] Balance: ${ethers.formatEther(balance)} MON`);
    }
}

async function executeOperations(wallet) {
    console.clear();
    console.log(`\n======================`);
    console.log(`DAY ${dayCounter} EXECUTION - ${wallet.address}`);
    console.log(`======================\n`);

    // Wrap & Unwrap MON
    console.log(`\n[${wallet.address}] Wrapping & Unwrapping MON...`);
    const wrapAmount = getRandomAmount(0.0005, 0.001);
    await wrapMON(wallet, wrapAmount);
    await delay(10000);
    await unwrapMON(wallet, wrapAmount);
    await delay(10000);

    // Select two random tokens for swapping
    const selectedTokens = [];
    while (selectedTokens.length < 2) {
        const token = TOKEN_ADDRESSES[Math.floor(Math.random() * TOKEN_ADDRESSES.length)];
        if (!selectedTokens.includes(token)) {
            selectedTokens.push(token);
        }
    }

    // Swap for selected tokens
    console.log(`\n[${wallet.address}] Swapping MON for tokens...`);
    for (const token of selectedTokens) {
        await swapEthForTokens(wallet, token);
        await delay(10000);
    }

    // Staking Operations based on the current day
    if (dayCounter === 1) {
        console.log(`\n[${wallet.address}] Staking/Unstaking Aprio MON...`);
        await stakeAprioMON(wallet, STAKE_CONTRACT);
        await delay(10000);
        await requestUnstakeAprMON(wallet, STAKE_CONTRACT);
    } else if (dayCounter === 2) {
        console.log(`\n[${wallet.address}] Staking/Unstaking Magma MON...`);
        await stakeMagmaMON(wallet, MAGMA_CONTRACT);
        await delay(10000);
        await unstakeMagmaMON(wallet, MAGMA_CONTRACT);
    } else {
        console.log(`\n[${wallet.address}] Staking/Unstaking Kintsu MON...`);
        await stakeKintsuMON(wallet);
        await delay(10000);
        await unstakeKintsuMON(wallet);
    }
}

async function main() {
    for (const wallet of wallets) {
        await executeOperations(wallet);
    }
    console.log("All wallet operations completed!");
    dayCounter = (dayCounter % 3) + 1; // Increment and loop back to Day 1 after Day 3
    await getWalletBalances();
}

async function repeatMain() {
    while (true) {
        console.log("Starting a new execution cycle...");
        await main();
        
        // Random delay between 1440-1450 minutes (24 hours variation)
        const delayMinutes = Math.floor(Math.random() * (1450 - 1440 + 1)) + 1440;
        const delayMs = delayMinutes * 60 * 1000;
        
        console.log(`Waiting for ${delayMinutes} minutes before the next cycle...`);
        await delay(delayMs);
    }
}

repeatMain();
