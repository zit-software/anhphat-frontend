import config from 'config';
import request from './request';

const accessToken = {
    get() {
        return window?.localStorage.getItem(
            config.tokenName
        );
    },
    set(newToken) {
        window?.localStorage.setItem(
            config.tokenName,
            newToken
        );

        request.defaults.headers['authorization'] =
            'Bearer ' + newToken;
    }
};

export default accessToken;
