import request from 'utils/request';

const usernamangeService = {
    async getAllUsers() {
        return await (
            await request.get('quantri/taikhoan')
        ).data;
    },

    async deleteAccount(ma) {
        return await (
            await request.delete(`quantri/taikhoan/${ma}`)
        ).data;
    },

    async updateAccount(ma, payload) {
        return await (
            await request.put(`quantri/taikhoan/${ma}`, payload)
        ).data;
    }
};

export default usernamangeService;
