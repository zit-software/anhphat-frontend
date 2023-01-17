import request from 'utils/request';

class HoaDonXuatService {
    static async taoHoaDon(payload) {
        return await request.post('xuathang/phieuxuat', payload);
    }

    static async layTatCa(page, limit) {
        return await request.get('xuathang/phieuxuat', { params: { page, limit } });
    }

    static async xoaHoaDon(ma) {
        return await request.delete(`xuathang/phieuxuat/${ma}`);
    }

    static async layMotHoaDon(ma) {
        return await request.get(`xuathang/phieuxuat/${ma}`);
    }
}

export default HoaDonXuatService;
