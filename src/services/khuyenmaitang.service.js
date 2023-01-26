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
    async getKMT(ma) {
        try {
            return await (
                await request.get(`/khuyenmaitang/${ma}`)
            ).data;
        } catch (error) {
            console.log(error);
        }
    }
    async chinhsuachitiet(ma, newChitiet) {
        try {
            await request.put(`/khuyenmaitang/chitiet/${ma}`, newChitiet);
        } catch (error) {
            console.log(error);
        }
    }
    async themchitiet(ma, newChitietArr) {
        try {
            await request.post(`/khuyenmaitang/chitiet/${ma}`, newChitietArr);
        } catch (error) {
            console.log(error);
        }
    }
    async chinhsuakmt(ma, newKMT) {
        try {
            await request.put(`/khuyenmaitang/${ma}`, newKMT);
        } catch (error) {
            console.log(error);
        }
    }
    async themkmt(newKMT) {
        try {
            await request.post(`/khuyenmaitang`, newKMT);
        } catch (error) {
            console.log(error);
        }
    }
    async xoakmt(ma) {
        await request.delete(`/khuyenmaitang/${ma}`);
    }
}

export default new KhuyenMaiTangService();
