import React, { useState, useContext } from 'react'
import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Stack,
    useColorMode,
    Text,
    Center,
    FormControl,
    FormLabel,
    Input
  } from '@chakra-ui/react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { TransactionContext } from '../contexts/transactionContext'
import { generatePayload } from '../utils/generatePayload'
import { AptosClient, AptosAccount, Types } from "aptos";
import { toast } from 'react-toastify'
import { shortenString } from '../utils/shortenString'

const TransactionStep = () => {
    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const client = new AptosClient(NODE_URL);
    const { address, setAddress, contractAddress } = useContext(TransactionContext);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(100000);

    const sendEVMTransaction = async () => {
        const address_to = "0x7f4e3511bb10b78be2dd7ab7068948c00b1f36ea0ad9b3b0a00c375c474f79ce"
        const third_addr = "872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"

        const tranferPayload = generatePayload("transfer", [`0x${address_to.substring(26)}`, amount.toString() ], contractAddress)
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
        if(evmOutput) {
            console.log(`Balance is: ${parseInt(evmOutput.output, 16)}`);
            setBalance(parseInt(evmOutput.output, 16));
            toast('Step 3 compleated!')
        }
    };
    const handleAddressChange = (e: any) => {
        const InputVal = e.target.value;
        if(InputVal.length === 66) {
            setAddress(InputVal)
            console.log(InputVal);
        }
    }
    const handleAmountChange = (e: any) => {
        const InputVal = e.target.value;
        setAmount(InputVal)
        console.log(InputVal);
    }
    return (
        <Box mt="50px" bg={useColorModeValue('rgba(0,0,0,0.15)', 'rgba(255,255,255,0.15)')} h='300px' w="60%" mr="auto" ml="auto" borderRadius="50px">
            <Box pt="20px">
                <Text pr="5%" w='300px' h="40px" lineHeight="40px" ml="5%">Step 3: Send EVM Transactions</Text>
                <Flex ml="10%">
                    <FormControl w="40%">
                        <FormLabel>Bob's Address</FormLabel>
                        <Input 
                            placeholder='Aptos Address'
                            disabled={!address || !contractAddress}
                            onChange={(e) => {handleAddressChange(e)}}
                        />
                    </FormControl>
                    <FormControl w="20%" ml="20%">
                        <FormLabel>Amount</FormLabel>
                        <Input 
                            placeholder='Token amount'
                            onChange={(e) => {handleAmountChange(e)}}
                            disabled={!address || !contractAddress}
                        />
                    </FormControl>
                </Flex>
                <Button
                    disabled={!address || !contractAddress}
                    bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                    color='white'
                    ml="5%"
                    mt="20px"
                    opacity='0.8'
                    _hover={{
                    opacity: '1'
                    }}
                    onClick={sendEVMTransaction}
                >
                    <AiOutlineTransaction />
                    &nbsp;&nbsp;Send 100000 Token to Bob
                </Button>
            </Box>
            <Center>
                <Text>Bob's Balance:{balance}</Text>
            </Center>
        </Box>
    )
}

export default TransactionStep;