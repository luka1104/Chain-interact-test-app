import React, { useState, useEffect } from 'react'
import { AptosClient, AptosAccount } from "aptos";
import { getEVMResources } from '../utils/getEVMResources'
import { getBalance } from '../utils/getBalance'
import { toast } from 'react-toastify'

export const TransactionContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
  const client = new AptosClient(NODE_URL);

  const [address, setAddress] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [balance, setBalance] = useState(0)

  const connectWallet = async () => {
    if(window.aptos) {
      const result = await window.aptos.connect();
      if(result.address) {
        setAddress(result.address)
        toast('Step 1 completed! Go to step 2')
      }
    } else if(window.spika) {
      const result = await window.spika.connect();
      if(result.account) {
        setAddress(result.account)
        toast('Step 1 completed! Go to step 2')
      }
    } else {
      toast('Please install the wallet extension')
    }
  }

  const checkWalletAddress = async () => {
    const status = await window.aptos.isConnected()
    if(status) {
      const currentAddress = await window.aptos.account()
      setAddress(currentAddress.address)
    }
  }

  const disconnect = async () => {
    if(window.aptos) {
      await window.aptos.disconnect()
    } else {
      await window.spika.disconnect()
    }
  }

  const deployContract = async (contract) => {
    let payload = {
      type: "contract_bundle_payload",
      modules: [{ bytecode: contract.bytecode }],
    };
    if(window.aptos) {
      const resp = await window.aptos.signAndSubmitTransaction(payload)
      await client.waitForTransaction(resp.hash);
    } else {
      const resp = await window.spika.signAndSubmitTransaction(payload)
      await client.waitForTransaction(resp.hash);
    }
    const contractAddr = await getEVMResources(address);
    if(contractAddr) {
      console.log(`EVM contract address: ${contractAddr}`);
      setContractAddress(contractAddr);
      toast('Step 2 completed! Go to step 3')
    }
    const evmOutput = await getBalance(address, contractAddr)
    if(evmOutput) {
        setBalance(parseInt(evmOutput.output, 16));
    }
  }
  useEffect(() => {
    if(window.aptos) {
      checkWalletAddress()
    }
  }, [])
  return (
      <TransactionContext.Provider value={{address, contractAddress, balance, setAddress, connectWallet, checkWalletAddress, disconnect, deployContract, setBalance}}>
        {children}
      </TransactionContext.Provider>
  )
}
