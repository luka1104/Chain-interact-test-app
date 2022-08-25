import { AptosClient } from "aptos";

export const getEVMResources = async (addr: string) => {
    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const client = new AptosClient(NODE_URL);
    const resources = await client.getAccountResources(addr);
    const accountResource = resources.find((r) => r.type === "0x1::account::Evm");
    const { output: output } = accountResource?.data as { output: string };
    return output;
}