import request from 'utils/request';

class AuthService {
    static async login(payload) {
        return await request.post('/auth/login', payload);
    }

    static async auth() {
        return await request.get('/auth');
    }
}

export default AuthService;
