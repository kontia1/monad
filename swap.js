import { ethers } from "ethers";
import { CONTRACTS, EXPLORER_URL, getRandomAmount } from "./config.js";

// Fungsi Wrap MON
export async function wrapMON(wallet, amount) {
    const contract = new ethers.Contract(CONTRACTS.WMON, [
        { name: "deposit", type: "function", stateMutability: "payable", inputs: [], outputs: [] }
    ], wallet);

    console.log(`[${wallet.address}] Wrapping ${ethers.formatEther(amount)} MON...`);
    try {
        const tx = await contract.deposit({ value: amount, gasLimit: 45000 });
        await tx.wait();
        console.log(`✅ Wrap successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
    } catch (error) {
        console.error("❌ Wrap failed:", error.reason || error.message || error);
    }
}

// Fungsi Unwrap MON
export async function unwrapMON(wallet, amount) {
    const contract = new ethers.Contract(CONTRACTS.WMON, [
        { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: ["uint256"], outputs: [] }
    ], wallet);

    console.log(`[${wallet.address}] Unwrapping ${ethers.formatEther(amount)} WMON...`);
    try {
        const tx = await contract.withdraw(amount, { gasLimit: 45000 });
        await tx.wait();
        console.log(`✅ Unwrap successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
    } catch (error) {
        console.error("❌ Unwrap failed:", error.reason || error.message || error);
    }
}

// Fungsi Swap di Uniswap (1x dengan token acak)
export async function swapUniswap(wallet) {
    const tokens = Object.entries(CONTRACTS.UNISWAPTOKENS);
    if (tokens.length === 0) return console.error("❌ No tokens available for Uniswap swap.");

    const [symbol, tokenAddress] = tokens[Math.floor(Math.random() * tokens.length)];
    const router = new ethers.Contract(CONTRACTS.ROUTERS.UNISWAP, [
        { name: "swapExactETHForTokens", type: "function", stateMutability: "payable", inputs: ["uint256", "address[]", "address", "uint256"], outputs: ["uint256[]"] }
    ], wallet);

    const amountInWei = getRandomAmount(0.001, 0.003);

    console.log(`[${wallet.address}] Swapping ${ethers.formatEther(amountInWei)} MON for ${symbol} via Uniswap...`);
    try {
        const tx = await router.swapExactETHForTokens(
            0,
            [CONTRACTS.WMON, tokenAddress],
            wallet.address,
            Math.floor(Date.now() / 1000) + 600,
            { value: amountInWei, gasLimit: 170000 }
        );
        await tx.wait();
        console.log(`✅ Swap successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
    } catch (error) {
        console.error(`❌ Swap failed on Uniswap: ${error.reason || error.message || error}`);
    }
}

// Fungsi Swap di Taya (1x dengan token acak)
export async function swapTaya(wallet) {
    const tokens = Object.entries(CONTRACTS.TAYATOKENS);
    if (tokens.length === 0) return console.error("❌ No tokens available for Taya swap.");

    const [tokenAddress, symbol] = tokens[Math.floor(Math.random() * tokens.length)];
    const router = new ethers.Contract(CONTRACTS.ROUTERS.TAYA, [
        { name: "swapExactETHForTokens", type: "function", stateMutability: "payable", inputs: ["uint256", "address[]", "address", "uint256"], outputs: ["uint256[]"] }
    ], wallet);

    const amountInWei = getRandomAmount(0.001, 0.003);

    console.log(`[${wallet.address}] Swapping ${ethers.formatEther(amountInWei)} MON for ${symbol} via Taya...`);
    try {
        const tx = await router.swapExactETHForTokens(
            0,
            [CONTRACTS.WMON, tokenAddress],
            wallet.address,
            Math.floor(Date.now() / 1000) + 600,
            { value: amountInWei, gasLimit: 170000 }
        );
        await tx.wait();
        console.log(`✅ Swap successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
    } catch (error) {
        console.error(`❌ Swap failed on Taya: ${error.reason || error.message || error}`);
    }
}
