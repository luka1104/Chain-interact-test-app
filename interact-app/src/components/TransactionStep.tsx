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
import { getBalance } from '../utils/getBalance'
import { insertComma } from '../utils/insertComma'

const TransactionStep = () => {
    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const client = new AptosClient(NODE_URL);
    const { address, setAddress, contractAddress, balance, setBalance } = useContext(TransactionContext);
    const [bobBalance, setBobBalance] = useState(0);
    const [amount, setAmount] = useState(100000);

    const sendEVMTransaction = async () => {
        const address_to = "0x7f4e3511bb10b78be2dd7ab7068948c00b1f36ea0ad9b3b0a00c375c474f79ce"
        const third_addr = "872449c44937f6Ac266cbBCDCb189B25AcEBb9E9"

        const tranferPayload = generatePayload("transfer", [`0x${address_to.substring(26)}`, amount.toString() ], contractAddress)
        if((window as any).aptos){
            const transferResponse = await (window as any).aptos.signAndSubmitTransaction(tranferPayload);
            await client.waitForTransaction(transferResponse.hash);
        } else {
            const transferResponse = await (window as any).spika.signAndSubmitTransaction(tranferPayload);
            await client.waitForTransaction(transferResponse.hash);
        } 
        const evmOutput = await getBalance(address, contractAddress)
        if(evmOutput) {
            setBalance(parseInt(evmOutput.output, 16));
        }
        const evmOutput2 = await getBalance(address_to, contractAddress)
        if(evmOutput) {
            setBobBalance(parseInt(evmOutput2.output, 16));
            toast('Step 3 completed!')
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
                        <FormLabel>Address</FormLabel>
                        <Input 
                            placeholder='Aptos Address'
                            disabled={!address || !contractAddress}
                            onChange={(e) => {handleAddressChange(e)}}
                            value={address}
                        />
                    </FormControl>
                    <FormControl w="20%" ml="20%">
                        <FormLabel>Amount</FormLabel>
                        <Input 
                            placeholder='Token amount'
                            onChange={(e) => {handleAmountChange(e)}}
                            disabled={!address || !contractAddress}
                            value={amount}
                        />
                    </FormControl>
                </Flex>
                <Button
                    disabled={!address || !contractAddress}
                    bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                    color='white'
                    ml="56%"
                    mt="20px"
                    opacity='0.8'
                    _hover={{
                    opacity: '1'
                    }}
                    onClick={sendEVMTransaction}
                >
                    <AiOutlineTransaction />
                    &nbsp;&nbsp;Send Token to Bob
                </Button>
            </Box>
            <Text ml="5%" mt="10px">Your balance:&nbsp;&nbsp;{insertComma(balance)}&nbsp;&nbsp;Tokens</Text>
            <Text ml="5%" mt="10px">Balance of Bob:&nbsp;&nbsp;{insertComma(bobBalance)}&nbsp;&nbsp;Tokens</Text>
        </Box>
    )
}

export default TransactionStep;