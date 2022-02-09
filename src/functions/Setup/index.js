import Web3 from "web3";
import Web3Modal from "web3modal";
import { useSelector } from 'react-redux';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { isMobile } from "react-device-detect";
import { config } from "../../const";
import CLOVER_SEEDS_TOKEN from "../../const/abis/clover_seeds_token_abi.json";
import CLOVER_SEEDS_NFT from "../../const/abis/clover_seeds_nft_abi.json";
import CLOVER_SEEDS_CONTROLLER from "../../const/abis/clover_seeds_controller_abi.json";
import CLOVER_SEEDS_STAKE from "../../const/abis/clover_seeds_stake_abi.json";


let cached_contracts = {}
//  Create WalletConnect Provider
const providerOptions = {
    /* See Provider Options Section */
    // Example with injected providers
    injected: {
        display: {
            name: "MetaMask",
        },
        package: null
    },
    // Example with WalletConnect provider
    walletconnect: {
        display: {
            name: "Mobile",
        },
        package: WalletConnectProvider, // required
        options: {
            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
        }
    }
};
  
const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
});

//Have to check the ethereum binding on the window object to see if it's installed
const { ethereum } = window

let { web3 } = window
// Function to Connect Wallet
export const connectWallet = async () => {
    if (ethereum) {
        try {
            //  Web3Modal Connect
            const provider = await web3Modal.connect();
            //  Create Web3 instance
            web3 = new Web3(provider)
            return true
        } catch (e) {
            console.error(e)
            throw new Error("User denied wallet connection!")
        }
    } else {
        throw new Error("No web3 detected!")
    }
}

export const connectNetwork = async () => {
    const _chainId = await ethereum.request({method: "eth_chainId"});
    if (_chainId != 0x3) {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: "0x3"}]
        });
    }
    return true;
}

// Function to get Accounts
export const getCoinbase = async () => {
    //  Get Accounts
    const accounts = isMobile? await web3.eth.getAccounts() : await ethereum.request({ method: 'eth_accounts' })
    //  Get Chain Id
    // const chainId = await web3.eth.chainId();
    //  Get Network Id
    // const networkId = await web3.eth.net.getId();
    return accounts.length > 0 ? accounts[0] : ""
}

// Function to get Contract
export const getContract = async (key) => {
    let ABI, address
    if (key === "CLOVER_SEEDS_TOKEN") {
        ABI = CLOVER_SEEDS_TOKEN.abi
        address = CLOVER_SEEDS_TOKEN.contractAddress
    } else if (key === "CLOVER_SEEDS_STAKE") {
        ABI = CLOVER_SEEDS_STAKE.abi
        address = CLOVER_SEEDS_STAKE.contractAddress
    } else if (key === "CLOVER_SEEDS_NFT") {
        ABI = CLOVER_SEEDS_NFT.abi
        address = CLOVER_SEEDS_NFT.contractAddress
    } else if (key === "CLOVER_SEEDS_CONTROLLER") {
        ABI = CLOVER_SEEDS_CONTROLLER.abi
        address = CLOVER_SEEDS_CONTROLLER.contractAddress
    }
    console.log(web3.eth)

    if (!web3.eth && !cached_contracts[key]) {
        cached_contracts[key] = new web3.eth.Contract(ABI, address, {from: await getCoinbase()})
    }
    return cached_contracts[key]
}

class CloverSeedsTokenContract {
    async transfer(to, amount) {
        let contract = await getContract("CLOVER_SEEDS_TOKEN")
        return (await contract?.methods.transfer(to, amount).send({
            from: await getCoinbase(),
            gasPrice: config.default_gasprice_gwei*1e9,
            gas: config.default_gas_amount,
        }))
    }
    async totalSupply() {
        let contract = await getContract("CLOVER_SEEDS_TOKEN")
        return (await contract?.methods.totalSupply().call())
    }
    async approve(spender, amount) {
        let contract = await getContract("CLOVER_SEEDS_TOKEN")
        return (await contract?.methods.approve(spender, amount).send({
            from: await getCoinbase(),
            gasPrice: config.default_gasprice_gwei*1e9,
            gas: config.default_gas_amount,
        }))
    }
    async balanceOf(address) {
        let contract = await getContract("CLOVER_SEEDS_TOKEN")
        return (await contract?.methods.balanceOf(address).call())
    }
}

class CloverSeedsStakeContract {
	constructor() {
		CLOVER_SEEDS_STAKE.callFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_STAKE")
				return (await contract?.methods[fn_name](...args).call())
			}
		});

		CLOVER_SEEDS_STAKE.transactionFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_STAKE")
				return (await contract?.methods[fn_name](...args).send({
                    from: await getCoinbase(),
                    gasPrice: config.default_gasprice_gwei*1e9,
                    gas: config.default_gas_amount,
                }))
			}
		});
	}
    async rewardRate() {
		let contract = await getContract("CLOVER_SEEDS_STAKE")
        return (await contract?.methods.rewardRate().call())
	}
}

class CloverSeedsNFTContract {
	constructor() {
		CLOVER_SEEDS_NFT.callFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_NFT")
				return (await contract?.methods[fn_name](...args).call())
			}
		});

		CLOVER_SEEDS_NFT.transactionFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_NFT")
				return (await contract?.methods[fn_name](...args).send({
                    from: await getCoinbase(),
                    gasPrice: config.default_gasprice_gwei*1e9,
                    gas: config.default_gas_amount,
                }))
			}
		});
	}
    async rewardRate() {
		let contract = await getContract("CLOVER_SEEDS_NFT")
        return (await contract?.methods.rewardRate().call())
	}
}

class CloverSeedsControllerContract {
	constructor() {
		CLOVER_SEEDS_CONTROLLER.callFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_CONTROLLER")
				return (await contract?.methods[fn_name](...args).call())
			}
		});

		CLOVER_SEEDS_CONTROLLER.transactionFunctions.forEach(fn_name => {
			this[fn_name] = async function(...args) {
				let contract = await getContract("CLOVER_SEEDS_CONTROLLER")
				return (await contract?.methods[fn_name](...args).send({
                    from: await getCoinbase(),
                    gasPrice: config.default_gasprice_gwei*1e9,
                    gas: config.default_gas_amount,
                }))
			}
		});
	}
    async rewardRate() {
		let contract = await getContract("CLOVER_SEEDS_NFT")
        return (await contract?.methods.rewardRate().call())
	}
}

window.seeds_token = new CloverSeedsTokenContract
window.seeds_nft = new CloverSeedsNFTContract
window.seeds_controller = new CloverSeedsControllerContract
window.seeds_stake = new CloverSeedsStakeContract

