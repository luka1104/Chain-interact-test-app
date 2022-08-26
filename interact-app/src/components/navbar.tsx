import React, { useContext } from 'react'
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
import { TransactionContext } from '../contexts/transactionContext'

const Navbar = () => {
  const { walletProvider, setWalletProvider } = useContext(TransactionContext);
  const { colorMode, toggleColorMode } = useColorMode();

  const toggleWalletProvider = () => {
    if(walletProvider === 'petra') {
      setWalletProvider('spika');
    } else {
      setWalletProvider('petra');
    }
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box><Text>Interact Test</Text></Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleWalletProvider}>
                {walletProvider === 'petra' ? <>P</> : <>S</>}
              </Button>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
