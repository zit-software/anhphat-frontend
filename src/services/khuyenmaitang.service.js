const { default: request } = require('utils/request');

class KhuyenMaiTangService {
    async getAllKMT() {
        try {
            const res = await request.get('/khuyenmaitang');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new KhuyenMaiTangService();
