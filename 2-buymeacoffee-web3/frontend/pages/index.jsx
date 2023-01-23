import abi from '../utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x2e4B9bB22320C626BBf4549c833C0868F68B0DB6";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [amount, setAmount] = useState(0.001);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [withdrawAccount, setWithdrawAccount] = useState('');

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      debugger;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(amount.toString()) }
        );

        setLoading(true)
        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setLoading(false);
        setAmount(0.001);
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onAmountChange = (e) => {
    console.log('value', e.target.value)
    setAmount(e.target.value)
  }

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos.map((i) => ({
          ...i,
          timestamp: new Date(i.timestamp * 1000),
        })));
      } else {
        console.log("Metamask is not connected");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const checkIsOwner = async () => {
    try {
      const { ethereum } = window;

      debugger
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const isOwner = await buyMeACoffee.isOwner();
        setIsOwner(isOwner)
      }
    } catch (err) {
      console.error('Something went wrong with checking owner', err)
    }
  }

  const onChangeWithdrawAccount = (e) => {
    setWithdrawAccount(e.target.value)
  }

  const updateWithdrawAccount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        await buyMeACoffee.setWithdrawalAddress(withdrawAccount);
        console.log('Account is changed')

      }
    } catch (err) {
      console.error('Cant change withdraw account, something went wrong', err)
    }
  }

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();
    checkIsOwner();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);



  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Leo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy Leo a Coffee!
        </h1>

        {currentAccount ? (
          <div style={{ display: 'flex' }}>
            <form>
              <div>
                <label>
                  Name
                </label>
                <br />

                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                />
              </div>
             <br />
              <div>
                <label>
                  Send Leo a message
                </label>
                <br />

                <textarea
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                >
                </textarea>
              </div>
              <br />
              <div>
                <label>
                  Amount
                </label>
                <br />

                <input
                  id="amount"
                  type="number"
                  placeholder="0.001"
                  value={amount}
                  onChange={onAmountChange}
                />
              </div>
              <br />
              <div>
                <button
                  type="button"
                  onClick={buyCoffee}
                  disabled={loading}
                >
                  Send 1 Coffee for {amount}ETH
                </button>
              </div>
            </form>
            {isOwner && <form>
              <div>
                <label>
                  Set Withdraw account
                </label>
                <br />
                <input
                  id="withdrawAccount"
                  type="text"
                  placeholder="0x121212212"
                  onChange={onChangeWithdrawAccount}
                />
              </div>
              <br />
              <div>
                <button
                  type="button"
                  onClick={updateWithdrawAccount}
                >
                  Update withdraw account
                </button>
              </div>
            </form>}

          </div>
        ) : (
            <button onClick={connectWallet}> Connect your wallet </button>
          )}
      </main>

      {currentAccount && (<h1>Memos received</h1>)}

      {loading && <div>Loading...</div>}

      {currentAccount && (memos.map((memo, idx) => {
        return (
          <div key={idx} style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px" }}>
            <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href="https://alchemy.com/?a=roadtoweb3weektwo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by @melghost for Alchemy's Road to Web3 lesson two!
        </a>
      </footer>
    </div>
  )
}
