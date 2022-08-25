import React, { useState } from 'react'

export const WalletContext = React.createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const connectWallet = async () => {
    const result = await window.spika.connect();
    console.log("result" + result);
    if(result.account) {
      setAddress(result.account)
    }
  }
    return (
        <WalletContext.Provider value={{address, setAddress, connectWallet}}>
          {children}
        </WalletContext.Provider>
    )
}
