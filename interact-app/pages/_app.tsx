import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { WalletProvider } from '../src/contexts/walletContext'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp
