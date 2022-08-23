import React from 'react'

const test = () => {
    const handleWalletConnect = async () => {
        const account = await window.spika.connect();
        console.log("result" + account);
      }
    return (
        <>
            <button onClick={handleWalletConnect}> testeetstfdatuf</button>
        </>
    )
}

export default test
