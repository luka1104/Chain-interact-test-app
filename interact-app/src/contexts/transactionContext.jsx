import React, { useState } from 'react'
import { AptosClient } from "aptos";
import { getEVMResources } from '../utils/getEVMResources'
import { toast } from 'react-toastify'

export const TransactionContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
  const client = new AptosClient(NODE_URL);

  const [address, setAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('')
  const connectWallet = async () => {
    const result = await window.spika.connect();
    console.log("result" + result);
    if(result.account) {
      setAddress(result.account)
      toast('Step 1 compleated! Go to step 2')
    }
  }

  const checkWalletAddress = async () => {
    const status = await window.spika.account()
    if(status) {
      const accountAddress = await window.spika.account()
      setAddress(accountAddress.account)
    }
  }

  const disconnect = async () => {
    await window.spika.disconnect()
  }

  const deployContract = async (contract) => {
    let payload = {
      type: "contract_bundle_payload",
      modules: [{ bytecode: contract.bytecode }],
    };
    const resp = await window.spika.signAndSubmitTransaction(payload)
    await client.waitForTransaction(resp.hash);
    const contractAddr = await getEVMResources(address);
    if(contractAddr) {
      console.log(`EVM contract address: ${contractAddr}`);
      setContractAddress(contractAddr);
      toast('Step 2 compleated! Go to step 3')
    }
  }
    return (
        <TransactionContext.Provider value={{address, contractAddress, setAddress, connectWallet, checkWalletAddress, disconnect, deployContract}}>
          {children}
        </TransactionContext.Provider>
    )
}
