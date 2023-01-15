import request from 'utils/request';

class NppService {
    static async them(payload) {
        return await request.post('npp', payload);
    }
    static async layTatCa() {
        return await request.get('npp');
    }
    static async layMot(ma) {
        return await request.get(`npp/${ma}`);
    }
    static async capnhat(ma, payload) {
        return await request.put(`npp/${ma}`, payload);
    }
    static async xoa(ma) {
        return await request.delete(`npp/${ma}`);
    }
}

export default NppService;
