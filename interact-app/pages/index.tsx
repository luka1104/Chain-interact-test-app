import type { NextPage } from 'next'
import React from 'react'
import { Center, Grid, Box, useColorModeValue } from '@chakra-ui/react'
import Navbar from '../src/components/navbar'
import ConnectStep from '../src/components/connectStep'
import DeployStep from '../src/components/deployStep'
import TransactionStep from '../src/components/TransactionStep'

const Home: NextPage = () => {  
  return (
    <Box bg={useColorModeValue('white', 'gray.800')}>
      <Navbar />
      <ConnectStep />
      <DeployStep />
      <TransactionStep />
    </Box>
  )
}

export default Home