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
import contract from '../contracts/DemoToken.json'
import { TransactionContext } from '../contexts/transactionContext';
import { FaFileContract } from 'react-icons/fa';

const DeployStep = () => {

    const { address, deployContract } = useContext(TransactionContext);
    return (
        <>
            <Center>
                <Flex>
                    <Text>Step 2: Deploy Contract</Text>
                    <Button
                        disabled={!address}
                        bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                        color='white'
                        opacity='0.8'
                        _hover={{
                        opacity: '1'
                        }}
                        onClick={() => {deployContract(contract)}}
                    >
                        <FaFileContract />&nbsp;&nbsp;Deploy
                    </Button>
                </Flex>
            </Center>
        </>
    )
}

export default DeployStep
