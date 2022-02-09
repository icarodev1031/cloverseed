import { SET_WALLET_CONNECTION_STATUS, SET_NET_CONNECTION_STATUS, SET_COINBASE_ADDRESS } from "../types";

export const isWalletConnect = ( state = false, action ) => {
    console.log('sdfsdf',action)
    switch (action.type) {
        case SET_WALLET_CONNECTION_STATUS:
            return action.payload;
    
        default:
            return state;
    }
}

export const isNetConnect = ( state = false, action ) => {
    console.log('sssssss',action) 
    switch (action.type) {
        case SET_NET_CONNECTION_STATUS:{
            return action.payload;
        }
    
        default:
            return state;
    }
}

export const coinbaseAddress = (state = '', action) => {
    switch (action.type) {
        case SET_COINBASE_ADDRESS:
            return action.payload
    
        default:
            return state
    }
}