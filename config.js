import { ethers } from "ethers";

// Konfigurasi jaringan dan explorer
export const RPC_URL = "https://testnet-rpc.monad.xyz/";
export const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";

// Kontrak-kontrak penting
export const CONTRACTS = {
    ROUTERS: {
        UNISWAP: "0xCa810D095e90Daae6e867c19DF6D9A8C56db2c89",
        TAYA: "0x4ba4bE2FB69E2aa059A551Ce5d609Ef5818Dd72F"
    },
    WMON: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    UNISWAPTOKENS: {
        USDC: "0x62534E4bBD6D9ebAC0ac99aeaa0aa48E56372df0",
        BEAN: "0x268E4E24E0051EC27b3D27A95977E71cE6875a05",
        JAI: "0xCc5B42F9d6144DFDFb6fb3987a2A916af902F5f8",
        DAC: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
        USDT: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
        WETH: "0x836047a99e11f376522b447bffb6e3495dd0637c",
        MUK: "0x989d38aeed8408452f0273c7d4a17fef20878e62",
        CHOG: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B"
    },
    TAYATOKENS: {
        "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714": "DAK",
        "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50": "YAKI",
        "0xE0590015A873bF326bd645c3E1266d4db41C4E6B": "CHOG",
        "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea": "USDC",
        "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D": "USDT"
    }
};

// Provider Ethereum
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Fungsi Utilitas
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRandomAmount = (min, max) =>
    ethers.parseEther((Math.random() * (max - min) + min).toFixed(6));
