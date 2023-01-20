import request from 'utils/request';

class ThongKeService {
    static async thongketheongay({ ngaybd, ngaykt }) {
        return await request.get('thongke/ngay', {
            params: {
                ngaybd,
                ngaykt,
            },
        });
    }

    static async thongketheoloaihangban({ ngaybd, ngaykt }) {
        return await request.get('thongke/loaihangban', {
            params: {
                ngaybd,
                ngaykt,
            },
        });
    }

    static async thongketheoloaihangnhap({ ngaybd, ngaykt }) {
        return await request.get('thongke/loaihangnhap', {
            params: {
                ngaybd,
                ngaykt,
            },
        });
    }
}

export default ThongKeService;
