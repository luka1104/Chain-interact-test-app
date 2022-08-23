import React, { useState, useEffect } from 'react'
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
import contract from '../contracts/DemoToken.json'
import { AptosClient, AptosAccount, FaucetClient, Types, HexString, BCS, TxnBuilderTypes } from "../../ohio-sdk/sdk";

const Navbar = () => {

  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
  const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

  const client = new AptosClient(NODE_URL);

  const { colorMode, toggleColorMode } = useColorMode();
  const [address, setAddress] = useState('')

  const shortenString = (str: string, n: any) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  }

  const handleWalletConnect = async () => {
    const result = await (window as any).spika.connect();
    console.log("result" + result);
    if(result.account) {
      setAddress(result.account)
    }
  }

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

  // const sendTransaction = async () => {
  //   console.log(address);
  //   const token = new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
  //   const transaction = new TxnBuilderTypes.TransactionPayloadScriptFunction(
  //       TxnBuilderTypes.ScriptFunction.natural(
  //           "0x1::coin",
  //           "transfer",
  //           [token],
  //           [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex('0xc4688d3defda966a30c1fdab7e7f9fa600f81ad65ff39d07933ae4069d8530ca')), BCS.bcsSerializeUint64(1000)],
  //       ),
  //   );
  //   const response = await (window as any).spika.signAndSubmitTransaction(transaction)
  //   // const signedTransaction = await (window as any).aptos.signTransaction(transaction)
  //   console.log(response);
  // }

  const sendEVMTransaction = async () => {
    const payload: Types.TransactionPayload = {
      type: "call_payload",
      code: { bytecode: `70a08231000000000000000000000000a7f2ed757fc35ffce7a80462a8e3b9134bcdf0c7` },
      type_arguments: [],
      arguments: ['0x4be39abff1f4196cd05e85b7c12a976087fd0282'],
    };
    const response = await (window as any).spika.signAndSubmitTransaction(payload);
    console.log('RESPONSE:', response);
  };

  const deployContract = async () => {
    let payload: Types.TransactionPayload = {
      type: "contract_bundle_payload",
      modules: [{ bytecode: contract.bytecode }],
    };

    let txnRequest = await client.generateTransaction(address, payload);
    console.log("txnRequest" + txnRequest);

    const resp = await (window as any).spika.signAndSubmitTransaction(txnRequest)
    // await client.waitForTransaction(resp.hash);
    console.log("resp" + resp);
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
                onClick={address ? disconnect : handleWalletConnect}
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
              {/* <Button onClick={sendTransaction}>transaction</Button> */}
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
