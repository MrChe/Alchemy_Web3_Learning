import { useState } from 'react'
import {NFTCard} from "../components/NFTCard";
import PaginationBar from "../components/PaginationBar";

const api_key = "n8Q9gfCXvvo1g60CYiAPYB6EAB0dl2IZ"
const Home = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [collectionAddress, setCollectionAddress] = useState("");
    const [NFTs, setNFTs] = useState([]);
    const [fetchForCollection, setFetchForCollection]=useState(false)
    const [pageKeys, setPageKeys] = useState([""]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNFTsForCollection = async ( nextToken = "", pageIndex = 0) => {
        setLoading(true);
        setNFTs([]);

        if (collectionAddress) {
            const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
            const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=true&startToken=${nextToken}`;

            try {
                const nfts = await fetch(fetchURL, {
                    method: "GET",
                }).then((data) => data.json());

                if (nfts) {
                    if (nfts.nextToken) {
                        setPageKeys((prevKeys) => {
                            const newKeys = [...prevKeys];
                            newKeys[pageIndex + 1] = nfts.nextToken;

                            return newKeys;
                        });
                    }

                    console.log("NFTs in collection:", nfts);
                    setLoading(false);
                    setNFTs(nfts.nfts);
                }
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    };


    const fetchNFTs = async ( pageKey = "", pageIndex = 0) => {

        setLoading(true);
        setNFTs([]);
        const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
        const fetchURL = !collectionAddress
            ? `${baseURL}?owner=${walletAddress}&pageKey=${pageKey}`
            : `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}&pageKey=${pageKey}`;

        try {
            const nfts = await fetch(fetchURL, {
                method: "GET",
            }).then((data) => data.json());

            if (nfts) {
                if (nfts.pageKey) {
                    setPageKeys((prevKeys) => {
                        const newKeys = [...prevKeys];
                        newKeys[pageIndex + 1] = nfts.pageKey;

                        return newKeys;
                    });
                }
                console.log("nfts:", nfts);
                setLoading(false);
                setNFTs(nfts.ownedNfts);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleWalletChange = (e) => {
        setWalletAddress(e.target.value);
    };

    const handleCollectionChange = (e) => {
        setCollectionAddress(e.target.value);
    }

    const handleFetchForCollectionChange = (e) => {
        setFetchForCollection(e.target.checked);
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (fetchForCollection) {
            fetchNFTsForCollection();
        } else {
            fetchNFTs();
        }
    }

    const onClickPage = async ( pageIndex) => {
        if (currentPage === pageIndex) return;

        try {
            if (fetchForCollection && collectionAddress) {
                fetchNFTsForCollection( pageKeys[pageIndex], pageIndex);
            } else {
                fetchNFTs( pageKeys[pageIndex], pageIndex);
            }
            setCurrentPage(pageIndex);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-y-3">
            <div className="flex flex-col w-full justify-center items-center gap-y-2">
                <div>
                    <label htmlFor="email" className="text-black text-sm">Wallet Address</label>

                    <div className="relative">

                        <input disabled={fetchForCollection}
                               className="disabled:text-gray-400 w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                               onChange={handleWalletChange}
                               value={walletAddress} type={"text"}
                               placeholder="Add your wallet address"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="text-black text-sm">Collection Address</label>

                    <div className="relative">

                        <input
                            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                            onChange={handleCollectionChange}
                            value={collectionAddress}
                            type={"text"}
                            placeholder="Add the collection address" />
                    </div>

                    <div className="relative">
                        <label className="text-gray-600">
                            <input type={"checkbox"} className="mr-2" onChange={handleFetchForCollectionChange} />
                            Fetch for collection
                        </label>
                    </div>

                    <div>
                        <button
                            disabled={!walletAddress && !collectionAddress}
                            className={"w-full disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm"} onClick={handleSubmit}>Fetch NFTs</button>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
                {
                    NFTs.length && NFTs.map((nft, i) => {
                        return (
                            <NFTCard key={i} nft={nft} />
                        )
                    })
                }
            </div>

            {loading && <div className="flex justify-center items-center mt-4"> Loading ... </div>}

            {pageKeys.length > 1 && (
                <PaginationBar
                    currentPage={currentPage}
                    pageKeys={pageKeys}
                    onClickPage={onClickPage}
                    className="border-t"
                />
            )}
        </div>
    )
}

export default Home

// contractMetadata.deployedBlockNumber