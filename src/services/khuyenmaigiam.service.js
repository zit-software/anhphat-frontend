const { default: request } = require('utils/request');

class KhuyenMaiGiam {
    async getAllKMG() {
        try {
            return await (
                await request.get('/khuyenmaigiam')
            ).data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new KhuyenMaiGiam();
