// project imports

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    user: {}
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;
