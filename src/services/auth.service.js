import request from 'utils/request';

class AuthService {
    static async login(payload) {
        return await request.post('/auth/login', payload);
    }

    static async auth() {
        return await request.get('/auth');
    }

    static async kiemtrapin(payload) {
        return await request.post('/auth/pin', payload);
    }
}

export default AuthService;
