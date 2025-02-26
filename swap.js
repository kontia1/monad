import { ethers } from "ethers";
import { CONTRACTS, EXPLORER_URL, ABI } from "./config.js";

export const getRandomAmount = (min, max) => ethers.parseEther((Math.random() * (max - min) + min).toFixed(4));
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function wrapMON(wallet, amount) {
    const contract = new ethers.Contract(CONTRACTS.WMON, ["function deposit() public payable"], wallet);
    try {
        console.log(`[${wallet.address}] Wrapping ${ethers.formatEther(amount)} MON...`);
        const tx = await contract.deposit({ value: amount, gasLimit: 45000 });
        console.log(`Wrapping successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
        await tx.wait();
    } catch (error) {
        console.error("Wrap failed:", error);
    }
}

export async function unwrapMON(wallet, amount) {
    const contract = new ethers.Contract(CONTRACTS.WMON, ["function withdraw(uint256 amount) public"], wallet);
    try {
        console.log(`[${wallet.address}] Unwrapping ${ethers.formatEther(amount)} WMON...`);
        const tx = await contract.withdraw(amount, { gasLimit: 45000 });
        console.log(`Unwrapping successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
        await tx.wait();
    } catch (error) {
        console.error("Unwrap failed:", error);
    }
}

export async function swapEthForTokens(wallet, token) {
    const routerAddress = CONTRACTS.ROUTERS.UNISWAP; // Using Uniswap Router
    const router = new ethers.Contract(routerAddress, ABI, wallet);
    const amountInWei = getRandomAmount(0.0001, 0.001);
    
    console.log(`Swapping ${ethers.formatEther(amountInWei)} MON for ${token.symbol} using Uniswap`);

    try {
        const tx = await router.swapExactETHForTokens(
            0, 
            [CONTRACTS.WMON, token.address], 
            wallet.address, 
            Math.floor(Date.now() / 1000) + 60 * 10, 
            {
                value: amountInWei,
                gasLimit: 170000
            }
        );
        console.log(`Swap successful! Transaction: ${EXPLORER_URL}${tx.hash}`);
        await tx.wait();
    } catch (error) {
        console.error(`Swap failed on Uniswap: ${error.message}`);
    }
}
