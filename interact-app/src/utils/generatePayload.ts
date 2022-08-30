import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import contract from '../contracts/DemoToken.json'
import { Types } from "aptos";

export const generatePayload = (funcName: string, inputs: string[], contractAddr: string) => {
    const web3 = new Web3();
    const abi = contract.abi.find(a => a.name == funcName)
    const code = web3.eth.abi.encodeFunctionCall((abi as AbiItem), inputs);
    console.log(code);
    const payload: Types.TransactionPayload = {
      type: "call_payload",
      code: { bytecode: code },
      type_arguments: [],
      arguments: [contractAddr],
    };
    return payload
}