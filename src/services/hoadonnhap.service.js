import request from 'utils/request';

class HoaDonNhapService {
    static async taoHoaDon(payload) {
        return await request.post('nhaphang/phieunhap', payload);
    }

    static async layPhieuNhap({ queryKey: [ma] }) {
        return await (
            await request.get(`nhaphang/phieunhap/${ma}`)
        ).data;
    }

    static async getAll() {
        return await (
            await request.get('nhaphang/phieunhap')
        ).data;
    }
}

export default HoaDonNhapService;
