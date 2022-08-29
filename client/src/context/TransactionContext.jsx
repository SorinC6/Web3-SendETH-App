import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({ provider, signer, transactionContract });
  return transactionContract;
};

export const TrasnactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  console.log("currentAccount@@@@@", currentAccount);
  const handleChange = (e, name) => {
    setFormData((prevState) => {
      return { ...prevState, [name]: e.target.value };
    });
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts?.length) {
        setCurrentAccount(accounts[0]);

        // get all transaction here later
      } else {
        console.log("NO acounts found");
      }

      console.log("ACCOUNTS CONNECTED", accounts);
    } catch (error) {
      console.log("ERROR", error);
      throw new Error("No etherum object found");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("ERROR", error);
      throw new Error("No etherum object found");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const { addressTo, amount, keyword, message } = formData;
      console.log("FORM DATAAAAA", { addressTo, amount, keyword, message });
      console.log("currentAccount", currentAccount);

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setLoading(true);
      console.log("LOADING", transactionHash.hash);
      await transactionHash.wait();
      setLoading(false);
      console.log("SUCCESSS", transactionHash.hash);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log("ERROR", error);
      throw new Error("No etherum object found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
