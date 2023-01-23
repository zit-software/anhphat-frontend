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
    static async capnhatdiem(manpp, diemLog) {
        console.log(manpp, diemLog);
        return await request.put(`npp/diem/${manpp}`, diemLog);
    }
    static async getAllLogsDiem(page) {
        const pageQuery = page >= 0 ? page : '';

        return await (
            await request.get(`/npp/diem?page=${pageQuery}`)
        ).data;
    }
}

export default NppService;
