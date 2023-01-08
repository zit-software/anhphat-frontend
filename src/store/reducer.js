import { combineReducers } from 'redux';
import authReducer from './authReducer';

// reducer import
import customizationReducer from './customizationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    auth: authReducer
});

export default reducer;
