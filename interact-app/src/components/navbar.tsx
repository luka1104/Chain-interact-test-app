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
import { BiWallet } from 'react-icons/bi';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
// import contract from '../contracts/Frens.json'
import contract from '../contracts/DemoToken.json'
import { AptosClient, AptosAccount, FaucetClient, Types, HexString, BCS, TxnBuilderTypes } from "aptos";
import { MoveResource } from 'aptos/dist/generated';
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { WalletContext } from '../contexts/walletContext'

const Navbar = () => {
  const { address, setAddress, connectWallet } = useContext(WalletContext);
  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
  const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

  const client = new AptosClient(NODE_URL);
  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

  const { colorMode, toggleColorMode } = useColorMode();
  // const [address, setAddress] = useState('')
  const [contractAddress, setContractAddress] = useState('')

  const shortenString = (str: string, n: any) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  }

  // const handleWalletConnect = async () => {
  //   const result = await (window as any).spika.connect();
  //   console.log("result" + result);
  //   if(result.account) {
  //     setAddress(result.account)
  //   }
  // }

  const checkWalletAddress = async () => {
    const status = await (window as any).spika.account()
    if(status) {
      const accountAddress = await (window as any).spika.account()
      setAddress(accountAddress.account)
    }
  }

  const disconnect = async () => {
    await (window as any).spika.disconnect()
  }

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

  const generatePayload = (funcName: string, inputs: string[], contractAddr: string) => {
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

  const deployContract = async () => {
    let payload: Types.TransactionPayload = {
      type: "contract_bundle_payload",
      modules: [{ bytecode: contract.bytecode }],
    };
    const resp = await (window as any).spika.signAndSubmitTransaction(payload)
    await client.waitForTransaction(resp.hash);

    const resources = await client.getAccountResources(address);
    const contractAddr = await getEVMResources(address);
    console.log(`EVM contract address: ${contractAddr}`);
    setContractAddress(contractAddr);
  }

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
              <Button onClick={sendNFTTransaction}>NFT</Button>
              <Button onClick={deployContract}>deploy</Button>
              <Button onClick={sendEVMTransaction}>Bean token</Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
