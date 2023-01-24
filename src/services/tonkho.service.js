const { default: request } = require('utils/request');

class TonKhoService {
    static async getMHCloseToExpired(page) {
        const pageQuery = page >= 0 ? page : '';
        return await (
            await request.get(`mathang/saphethan?page=${pageQuery}`)
        ).data;
    }
    static async getLHOutOfStock() {
        return await await (
            await request.get('mathang/saphet')
        ).data;
    }
}

export default TonKhoService;
