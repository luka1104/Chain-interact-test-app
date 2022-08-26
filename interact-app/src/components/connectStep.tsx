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
            <Center w="40%" mt="100px" mr="auto" ml="auto" bg={useColorModeValue('rgba(0,0,0,0.15)', 'rgba(255,255,255,0.15)')} h='100px' borderRadius="25px">
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
