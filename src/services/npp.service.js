import request from 'utils/request';

class nppService {
    async getAllNPP({ queryKey: [_, params] }) {
        try {
            const res = await request.get('/npp');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new nppService();
