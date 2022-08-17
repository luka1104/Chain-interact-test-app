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
import { BCS, TxnBuilderTypes } from 'aptos';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [address, setAddress] = useState('')

  const shortenString = (str: string, n: any) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  }

  const handleWalletConnect = async () => {
    const result = await (window as any).aptos.connect();
    if(result.address) {
      setAddress(result.address)
    }
    console.log(result);
  }

  const checkWalletAddress = async () => {
    const status = await (window as any).aptos.isConnected()
    if(status) {
      const accountAddress = await (window as any).aptos.account()
      setAddress(accountAddress.address)
    }
  }

  const disconnect = async () => {
    await (window as any).aptos.disconnect()
  }

  const sendTransaction = async () => {
    console.log(address);
    const token = new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
    const transaction = new TxnBuilderTypes.TransactionPayloadScriptFunction(
        TxnBuilderTypes.ScriptFunction.natural(
            "0x1::coin",
            "transfer",
            [token],
            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex('0xc4688d3defda966a30c1fdab7e7f9fa600f81ad65ff39d07933ae4069d8530ca')), BCS.bcsSerializeUint64(1000)],
        ),
    );
    const response = await (window as any).aptos.signAndSubmitTransaction(transaction)
    // const signedTransaction = await (window as any).aptos.signTransaction(transaction)
    console.log(response);
  }

  useEffect(() => {
    checkWalletAddress()
  }, [])
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
              <Button onClick={sendTransaction}>test</Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
