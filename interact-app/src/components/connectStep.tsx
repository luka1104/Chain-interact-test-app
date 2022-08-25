import React, { useContext } from 'react'
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
import { BiWallet } from 'react-icons/bi';
import { TransactionContext } from '../contexts/transactionContext'
import { shortenString } from '../utils/shortenString'

const ConnectStep = () => {
    const { address, connectWallet, disconnect } = useContext(TransactionContext);
    return (
        <>
            <Center mt="100px">
                <Flex>
                    <Text pr="5%" w="200px" h="40px" lineHeight="40px">Step 1: Connect Wallet</Text>
                    <Button
                        bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                        color='white'
                        opacity='0.8'
                        _hover={{
                        opacity: '1'
                        }}
                        onClick={address ? disconnect : connectWallet}
                    >
                        <BiWallet />
                        {address ? (
                        <>
                            &nbsp;&nbsp;{shortenString(address, 12)}
                        </>
                        ) : (
                        <>
                            &nbsp;&nbsp;Connect Wallet
                        </>
                        )}
                    </Button>
                </Flex>
            </Center>
        </>
    )
}

export default ConnectStep
