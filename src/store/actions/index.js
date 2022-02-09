import { SET_WALLET_CONNECTION_STATUS, SET_NET_CONNECTION_STATUS, SET_COINBASE_ADDRESS } from "../types";

export const setWalletConnectStatusAction = (status = false) => {
    return {
        type: SET_WALLET_CONNECTION_STATUS,
        payload: status
    }
}

export const setNetConnectStatusAction = (status = false) => {
    return {
        type: SET_NET_CONNECTION_STATUS,
        payload: status
    }
}

export const setCoinbaseAddressAction = (address = "") => {
    return {
        type: SET_COINBASE_ADDRESS,
        payload: address
    }
}