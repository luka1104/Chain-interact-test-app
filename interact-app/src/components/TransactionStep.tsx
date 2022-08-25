import React, { useState, useContext } from 'react'
import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Stack,
    useColorMode,
    Text,
    Center
  } from '@chakra-ui/react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { TransactionContext } from '../contexts/transactionContext'
import { generatePayload } from '../utils/generatePayload'
import { AptosClient, AptosAccount, Types } from "aptos";
import { shortenString } from '../utils/shortenString'

const TransactionStep = () => {
    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const client = new AptosClient(NODE_URL);
    const { address, contractAddress, connectWallet, disconnect } = useContext(TransactionContext);
    const [balance, setBalance] = useState(0);

    const sendEVMTransaction = async () => {
        const address_to = "0x7f4e3511bb10b78be2dd7ab7068948c00b1f36ea0ad9b3b0a00c375c474f79ce"
        const third_addr = "872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"

        const tranferPayload = generatePayload("transfer", [`0x${address_to.substring(26)}`, '100000'], contractAddress)
        console.log(tranferPayload);
        const transferResponse = await (window as any).spika.signAndSubmitTransaction(tranferPayload);
        await client.waitForTransaction(transferResponse.hash);
        console.log(transferResponse);

        const balanceOfPayload = generatePayload("balanceOf", [`0x${address_to.substring(26)}`], contractAddress)
        console.log(balanceOfPayload);
        const account = new AptosAccount(undefined, address)
        const txnRequest = await client.generateTransaction(address, balanceOfPayload);
        const simResponse = await client.simulateTransaction(account, txnRequest);
        const changes = simResponse[0].changes as Types.WriteResource[]; 
        const evmOutput = changes.find(c => c.data.type === "0x1::account::Evm")?.data.data  as { output: string };
        console.log(`Balance is: ${parseInt(evmOutput.output, 16)}`);
        setBalance(parseInt(evmOutput.output, 16));
    };
    return (
        <>
            <Center mt="100px">
                <Flex>
                    <Text pr="5%" w='300px' h="40px" lineHeight="40px">Step 3: Send EVM Transactions</Text>
                    <Button
                        disabled={!address || !contractAddress}
                        bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                        color='white'
                        opacity='0.8'
                        _hover={{
                        opacity: '1'
                        }}
                        onClick={sendEVMTransaction}
                    >
                        <AiOutlineTransaction />
                        &nbsp;&nbsp;Send 100000 Token to Bob
                    </Button>
                </Flex>
            </Center>
            <Center>
                <Text>Bob's Balance:{balance}</Text>
            </Center>
        </>
    )
}

export default TransactionStep;