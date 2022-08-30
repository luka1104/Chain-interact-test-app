import React, { useState, useCallback, useContext } from 'react'
import {
    Box,
    Input,
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
    const [file, setFile] = useState(contract)
    const uploadImage = useCallback((e: any) => {
        const reader = new FileReader()
        reader.onload = async (e: any) => { 
            const text = (e.target.result)
            setFile(JSON.parse(text))
        };
        reader.readAsText(e.target.files[0])
    }, [])

    const { address, contractAddress, deployContract } = useContext(TransactionContext);
    return (
        <>
            <Box w="60%" mt="50px" mr="auto" ml="auto" bg={useColorModeValue('rgba(0,0,0,0.15)', 'rgba(255,255,255,0.15)')} borderRadius="25px">
                <Text ml="5%" pt="20px" pr="5%" lineHeight="40px">Step 2: Deploy Contract</Text>
                <Box pb="20px" mt="10px">
                    <Input ml="5%" w="30%" mr="5%" type="file" onChange={(event) => {uploadImage(event)}} />
                    <Button
                        disabled={!address}
                        bgGradient='linear(to-br, #0EA4FF, #0AB7AA)'
                        color='white'
                        opacity='0.8'
                        _hover={{
                            opacity: '1'
                        }}
                        onClick={() => {deployContract(file)}}
                    >
                        <FaFileContract />
                        {contractAddress ? (
                            <>&nbsp;&nbsp;{shortenString(contractAddress, 12)}</>
                        ) : (
                            <>&nbsp;&nbsp;Deploy Contract</>
                        )}
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default DeployStep
