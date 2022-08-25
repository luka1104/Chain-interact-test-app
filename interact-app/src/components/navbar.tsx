import React, { useState, useEffect, useContext } from 'react'
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import contract from '../contracts/Frens.json'
import contract from '../contracts/DemoToken.json'
import { AptosClient, AptosAccount, Types } from "aptos";
import { MoveResource } from 'aptos/dist/generated';
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { TransactionContext } from '../contexts/transactionContext'
import { generatePayload } from '../utils/generatePayload'

const Navbar = () => {
  const { address } = useContext(TransactionContext);
  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
  const client = new AptosClient(NODE_URL);
  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

  const { colorMode, toggleColorMode } = useColorMode();
  const [contractAddress, setContractAddress] = useState('')

  const getEVMResources = async (addr: string) => {
    const resources = await client.getAccountResources(addr);
    const accountResource = resources.find((r) => r.type === "0x1::account::Evm");
    const { output: output } = accountResource?.data as { output: string };
    return output;
  }

  const sendNFTTransaction = async () => {
    const balanceOfBytecode = Web3.utils.keccak256('balanceOf(address)').substring(2, 10);
    const mintBytecode = Web3.utils.keccak256('mintNFT(address,string)').substring(2, 10);
    const address_to = "0x7f4e3511bb10b78be2dd7ab7068948c00b1f36ea0ad9b3b0a00c375c474f79ce"
    const payload: Types.TransactionPayload = {
      type: "call_payload",
      code: { bytecode: `${mintBytecode}000000000000000000000000${address.substring(26)}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001` },
      type_arguments: [],
      arguments: [contractAddress],
    };
    const response = await (window as any).spika.signAndSubmitTransaction(payload);
    await client.waitForTransaction(response.hash);
    console.log(response);

    const payload_address: Types.TransactionPayload = {
      type: "call_payload",
      code: { bytecode: `${balanceOfBytecode}000000000000000000000000${address.substring(26)}` },
      type_arguments: [],
      arguments: [contractAddress],
    };
    const respo = await (window as any).spika.signAndSubmitTransaction(payload_address);
    await client.waitForTransaction(respo.hash);
    const Balance_address = await getEVMResources(address);
    console.log(`Balance is: ${Balance_address}`);
  }

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
  };

  // useEffect(() => {
  //   checkWalletAddress()
  // }, [])
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box><Text>Interact Test</Text></Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button onClick={sendNFTTransaction}>NFT</Button>
              <Button onClick={sendEVMTransaction}>Bean token</Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
