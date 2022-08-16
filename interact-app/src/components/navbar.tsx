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
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box><Text>Transaction Speed Test</Text></Box>

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
                onClick={()  => (window as any).aptos.connect()}
              >
                <BiWallet />&nbsp;&nbsp;Connect Wallet
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
