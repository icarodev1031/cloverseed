import { combineReducers } from 'redux';
import { isWalletConnect, coinbaseAddress } from './reducers';

const rootReducer = combineReducers({
	isWalletConnect,
    coinbaseAddress
})

export default rootReducer;