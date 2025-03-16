import { Wallet, JsonRpcProvider, ethers } from "ethers";
import fs from "fs";
import { provider, delay, getRandomAmount } from "./config.js";
import { wrapMON, unwrapMON, swapUniswap, swapTaya } from "./swap.js";
import { stakeMagmaMON, unstakeMagmaMON, stakeAprioMON, requestUnstakeAprMON, stakeKintsuMON, unstakeKintsuMON, stakeSHMonad, unstakeSHMonad } from "./staking.js";

// Load private keys from wallet.txt
const privateKeys = fs.readFileSync("wallet.txt", "utf8")
    .trim()
    .split("\n")
    .map(pk => pk.startsWith("0x") ? pk : "0x" + pk);

const wallets = privateKeys.map(pk => new Wallet(pk, provider));

async function main() {
    function getActions(wallet) {
        return [
            async () => {
                let nonce = await provider.getTransactionCount(wallet.address, "pending");
                try {
                    await wrapMON(wallet, getRandomAmount(0.003, 0.005), nonce++);
                    await delay(10000);
                } catch (error) {
                    console.error("❌ Wrap failed:", error.message);
                }
                await delay(5000);
                try {
                    await unwrapMON(wallet, getRandomAmount(0.001, 0.002), nonce++);
                    await delay(10000);
                } catch (error) {
                    console.error("❌ Unwrap failed:", error.message);
                }
            },
            async () => {
                const swapFunctions = [swapUniswap, swapTaya];
                for (let i = 0; i < 6; i++) {
                    const swapFunction = swapFunctions[Math.floor(Math.random() * swapFunctions.length)];
                    await swapFunction(wallet);
                    await delay(5000);
                }
            },
            async () => {
                const stakingActions = [
                    [stakeMagmaMON, unstakeMagmaMON],
                    [stakeAprioMON, requestUnstakeAprMON],
                    [stakeKintsuMON, unstakeKintsuMON],
                    [stakeSHMonad, unstakeSHMonad]
                ];
                const selectedStaking = stakingActions.sort(() => 0.5 - Math.random()).slice(0, 2);
                for (const [stake, unstake] of selectedStaking) {
                    await stake(wallet);
                    await delay(5000);
                    await unstake(wallet);
                    await delay(5000);
                }
            }
        ];
    }

    for (const wallet of wallets) {
        const actions = getActions(wallet);
        console.log(`\n[${wallet.address}] Starting daily routine...`);
        
        actions.sort(() => 0.5 - Math.random());
        for (const action of actions) {
            await action();
        }
        
        console.log(`\n[${wallet.address}] Daily routine completed! Waiting for next cycle...`);
    }
}

async function startBot() {
    while (true) {
        await main();
        const waitTime = parseInt((Math.random() * (1450 - 1440) + 1440) * 60 * 1000);
        const balances = await Promise.all(wallets.map(async (wallet) => {
            const balance = await provider.getBalance(wallet.address);
            return { address: wallet.address, balance: ethers.formatEther(balance) };
        }));
        console.log(`\n💰 Wallet Balances:`);
        balances.forEach(({ address, balance }) => {
            console.log(`[${address}] ${balance} MON`);
        });
        const currentDate = new Date().toLocaleString();
        console.log(`
⏳ Waiting ${waitTime / 60000} minutes for next cycle...`);
        console.log(`📅 Next run at: ${currentDate}`);
        await delay(waitTime);
    }
}

startBot();
