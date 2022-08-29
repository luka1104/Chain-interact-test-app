import { AptosClient, AptosAccount, Types } from "aptos";
import { generatePayload } from '../utils/generatePayload'

export const getBalance = async (address: string, contractAddress: string) => {
    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const client = new AptosClient(NODE_URL);

    const balanceOfPayload = generatePayload("balanceOf", [`0x${address.substring(26)}`], contractAddress)
    const account = new AptosAccount(undefined, address)
    const txnRequest = await client.generateTransaction(address, balanceOfPayload);
    const simResponse = await client.simulateTransaction(account, txnRequest);
    const changes = simResponse[0].changes as Types.WriteResource[]; 
    const evmOutput = changes.find(c => c.data.type === "0x1::account::Evm")?.data.data as { output: string };
    return evmOutput
}