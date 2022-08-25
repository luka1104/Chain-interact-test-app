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
import { shortenString } from '../utils/shortenString';

const DeployStep = () => {

    const { address, contractAddress, deployContract } = useContext(TransactionContext);
    return (
        <>
            <Center mt="100px">
                <Flex>
                    <Text pr="5%" w="250px" h="40px" lineHeight="40px">Step 2: Deploy Contract</Text>
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
                        <FaFileContract />
                        {contractAddress ? (
                            <>&nbsp;&nbsp;{shortenString(contractAddress, 12)}</>
                        ) : (
                            <>&nbsp;&nbsp;Deploy Contract</>
                        )}
                    </Button>
                </Flex>
            </Center>
        </>
    )
}

export default DeployStep
