import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { TransactionProvider } from '../src/contexts/transactionContext'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <TransactionProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </TransactionProvider>
    </ChakraProvider>
  )
}

export default MyApp
