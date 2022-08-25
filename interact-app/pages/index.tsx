import type { NextPage } from 'next'
import React from 'react'
import { Center, Grid, Box } from '@chakra-ui/react'
import Navbar from '../src/components/navbar'
import ConnectStep from '../src/components/connectStep'
import DeployStep from '../src/components/deployStep'

const Home: NextPage = () => {  
  return (
    <Box bg='white'>
      <Navbar />
      <ConnectStep />
      <DeployStep />
    </Box>
  )
}

export default Home