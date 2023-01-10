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
    }
};

export default usernamangeService;
