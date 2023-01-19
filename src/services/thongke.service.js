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
}

export default ThongKeService;
