
import './App.css';
import Web3 from "web3";
import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [etherInput, setEtherInput] = useState(1);
  const [nUSDInput, setnUSDInput] = useState(1);
  const [connectedAddress, setConnectedAddress] = useState("");
  

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask");
    }
    return provider;
  };
  // To detect network change
  useEffect(() => {
    const currentProvider = detectCurrentProvider();
    if (currentProvider) {
      currentProvider.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }
  }, []);

  // To detect account change
  useEffect(() => {
    const currentProvider = detectCurrentProvider();
    if (currentProvider) {
      currentProvider.on("accountsChanged", (accounts) => {
        window.location.reload();
      });
    }
  }, []);

  //Web3 connection to MetaMask
  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        ethBalance = web3.utils.fromWei(ethBalance, "ether");
        //check for network
        const networkId = await web3.eth.net.getId();
        // if (networkId !== 1) {
        //   await currentProvider.request({
        //     method: "wallet_switchEthereumChain",
        //     params: [{ chainId: "0x1" }],
        //   });
        // }
        // window.alert(network);
        window.alert(`Connected to ${currentProvider.selectedAddress}`);
        setConnectedAddress(currentProvider.selectedAddress);

      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeEth = (event) => {
    console.log(event.target.value);
    setEtherInput(event.target.value);
  };  
  const handleChangenUSD = (event) => {
    console.log(event.target.value);
    setnUSDInput(event.target.value);
  };  
  const startPayment = async ({ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      await window.ethereum.send("eth_requestAccounts",[]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      ethers.utils.getAddress(connectedAddress);
      let z = etherInput
      console.log(z)
      z = z.toString()
      console.log("z", ethers.utils.parseEther(z))
      const tx = await signer.sendTransaction({
        to: "0xc66bAfCDAeF239b869178c0711FeD4A864C419CD",
        value: ethers.utils.parseEther(z),
      });
      // console.log({ ether, addr });
      // console.log("tx", tx);
      window.alert("Transaction hash: " + tx.hash);
      // setTxs([tx]);
    } catch (err) {
      window.alert("Transaction failed");
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div>
      <button className="connectBtn" onClick={onConnect}>
                  Connect
                </button>
      </div>
      <div>
        <input
          type="text"
          placeholder={`1 ETH to nUSD`}
          name="ether"
          onChange={handleChangeEth}
              value={etherInput}
          className="inputcontainer aactive"
        />
        <button onClick={startPayment}>Deposit</button>
      </div><div>
        <input
          type="text"
          placeholder={`1 nUSD to ETH`}
          name="ether"
          onChange={handleChangenUSD}
              value={nUSDInput}
          className="inputcontainer aactive"
        />
        <button>Redeem</button>
      </div>
    </div>
  );
}

export default App;
