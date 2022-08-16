import type { NextPage } from 'next'
import React from 'react'
import { Center, Grid } from '@chakra-ui/react'
import Navbar from '../src/components/navbar'

const Home: NextPage = () => {  
  return (
    <>
      <Navbar />
      <Center>
        <Grid gridTemplateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}} gap={6}>
          
        </Grid>
      </Center>
    </>
  )
}

export default Home