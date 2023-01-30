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
    static async laytatcatinh() {
        return await (
            await request.get('thongke/alltinh')
        ).data;
    }
    static async thongketinh(tinh, ngaybd, ngaykt) {
        if (!tinh) return;
        return await (
            await request.get(`thongke/tinh/${tinh}`, {
                params: {
                    ngaybd,
                    ngaykt,
                },
            })
        ).data;
    }
}

export default ThongKeService;
