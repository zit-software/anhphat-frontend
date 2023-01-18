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
    async themKMG(values) {
        try {
            await request.post('/khuyenmaigiam', values);
        } catch (error) {
            console.log(error);
        }
    }
    async xoaKMG(ma) {
        try {
            await request.delete(`/khuyenmaigiam/${ma}`);
        } catch (error) {
            console.log(error);
        }
    }
    async suaKMG(ma, values) {
        try {
            await request.put(`/khuyenmaigiam/${ma}`);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new KhuyenMaiGiam();
