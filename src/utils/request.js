import axios from 'axios';
import config from 'config';

const request = axios.create({
    baseURL: process.env.REACT_APP_BACKENDURL || 'http://localhost:5000',
    headers: {
        authorization: `Bearer ${window?.localStorage.getItem(config.tokenName)}`,
    },
});

export default request;
