
import { useState } from "react";

const shortAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getCleanTokenId = (tokenId) => {
    return tokenId.substring(tokenId.length - 4)
}

const CopyToClipboard = ({ text }) => {
    const [isCopied, setIsCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        console.log("Copied to clipboard", text);
        setTimeout(() => setIsCopied(false), 2000);
    };
    return (
        <div className="cursor-pointer" onClick={copyToClipboard}>
            {isCopied ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                :   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>}
        </div>
    );
}

export const NFTCard = ({ nft }) => {
    return (
        <div className="w-1/4 flex flex-col ">
            <div className="rounded-md">
                <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} />
            </div>
            <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
                <div className="">
                    <h2 className="text-xl text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600">Id: {getCleanTokenId(nft.id.tokenId)}</p>
                    <div className={'flex justify-between'}>
                        <p className="text-gray-600" >Address: {shortAddress(nft.contract.address)}</p>
                        <CopyToClipboard text={nft.contract.address} />
                    </div>
                </div>

                <div className="flex-grow mt-2">
                    <p className="text-gray-600">{nft.description}</p>
                </div>

                <div className={'flex justify-center mb-1'}>
                    <a
                        className="py-2 px-4 text-white bg-blue-400 rounded-sm cursor-pointer decoration-0"
                        href={`https://etherscan.io/address/${nft.contract.address}`} target="_blank" rel="noreferrer" >View on Etherscan</a>
                </div>
            </div>
        </div>
    )
}