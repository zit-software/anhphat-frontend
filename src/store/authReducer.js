// project imports

// action - state management
import request from 'utils/request';
import * as actionTypes from './actions';

export const initialState = {
    user: {},
    pin: '',
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case actionTypes.SET_PIN:
            request.interceptors.request.use((config) => {
                config.headers.set('x-pin', action.payload);
                return config;
            });
            return {
                ...state,
                pin: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
