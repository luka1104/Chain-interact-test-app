import type { NextPage } from 'next'
import React from 'react'
import { Center, Grid, Box } from '@chakra-ui/react'
import Navbar from '../src/components/navbar'
import Card from '../src/components/card'

const Home: NextPage = () => {  
  return (
    <Box bg='white'>
      <Navbar />
      <Center>
        <Grid gridTemplateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}} gap={6}>
          <Card />
        </Grid>
      </Center>
    </Box>
  )
}

export default Home