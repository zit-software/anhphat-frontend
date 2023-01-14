import request from 'utils/request';

class HoaDonNhapService {
    static async taoHoaDon(payload) {
        return await request.post('nhaphang/phieunhap', payload);
    }

    static async layPhieuNhap(ma) {
        return await (
            await request.get(`nhaphang/phieunhap/${ma}`)
        ).data;
    }

    static async getAll({ page, limit, daluu } = {}) {
        return await (
            await request.get('nhaphang/phieunhap', {
                params: { page, limit, daluu }
            })
        ).data;
    }

    static async themSanPham(maphieunhap, danhSachSanPham) {
        for (const sanpham of danhSachSanPham) {
            delete sanpham.ma;
            await request.post('nhaphang/phieunhap/themsp', { maphieunhap, ...sanpham });
        }
    }

    static async capNhat(ma, payload) {
        return await request.put(`nhaphang/phieunhap/${ma}`, payload);
    }

    static async luu(ma) {
        return await request.put(`nhaphang/phieunhap/${ma}/luu`);
    }
}

export default HoaDonNhapService;
