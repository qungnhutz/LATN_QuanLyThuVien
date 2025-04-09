import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true,
});


export const requestChangePassword = async ({ oldPass, newPass, confirmNewPass }) => {
        const res = await request.put('/api/changePassword', { oldPass, newPass, confirmNewPass });
        return res.data;
};


export default request;