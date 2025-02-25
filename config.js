export const RPC_URL = "https://testnet-rpc.monad.xyz/";
export const EXPLORER_URL = "https://testnet.monadexplorer.com/tx/";

export const CONTRACTS = {
    ROUTERS: {
        UNISWAP: "0xCa810D095e90Daae6e867c19DF6D9A8C56db2c89", // Uniswap router
    },
    WMON: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
    TOKENS: {
        USDC: "0x62534E4bBD6D9ebAC0ac99aeaa0aa48E56372df0",
        BEAN: "0x268E4E24E0051EC27b3D27A95977E71cE6875a05",
        JAI: "0xCc5B42F9d6144DFDFb6fb3987a2A916af902F5f8",
        DAC: "0x0f0bdebf0f83cd1ee3974779bcb7315f9808c714",
        USDT: "0x88b8e2161dedc77ef4ab7585569d2415a1c1055d",
        WETH: "0x836047a99e11f376522b447bffb6e3495dd0637c",
        MUK: "0x989d38aeed8408452f0273c7d4a17fef20878e62",
        CHOG: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B"
    }
};

export const ABI = [
    { name: "swapExactETHForTokens", type: "function", stateMutability: "payable", inputs: ["uint256", "address[]", "address", "uint256"], outputs: ["uint256[]"] }
];
