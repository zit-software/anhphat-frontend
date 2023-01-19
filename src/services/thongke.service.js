import request from 'utils/request';

class ThongKeService {
    static async thongketheongay() {
        return await request.get('thongke/ngay', {
            params: {
                ngaybd: '2020-10-10',
                ngaykt: '2023-10-10',
            },
        });
    }
}

export default ThongKeService;
