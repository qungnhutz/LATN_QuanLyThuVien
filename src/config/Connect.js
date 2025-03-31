import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true, // Gửi cookie nếu server yêu cầu
});

export const requestLogin = async (data) => {
    const res = await request.post('api/login', data);
    return res.data;
};

export const requestOTP = async ({ masinhvien, email }) => {
    const res = await request.post('/api/sendOTP', { masinhvien, email });
    return res;
};

export const requestverity_OTP = async ({ masinhvien, otp, newPassword }) => {
    const res = await request.post('/api/verifyOTP', { masinhvien, otp, newPassword });
    return res;
};

export const requestChangePassword = async ({ oldPass, newPass, confirmNewPass }) => {
    try {
        console.log('Sending change password request:', { oldPass, newPass, confirmNewPass });
        const res = await request.put('/api/changePassword', { oldPass, newPass, confirmNewPass });
        console.log('Response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error response:', error.response?.data);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

// Sửa hàm fetchUserInfo để gọi tới endpoint mới
export const fetchUserInfo = async () => {
    try {
        const res = await request.get('/api/getStudentFromToken');
        return res.data; // Trả về trực tiếp dữ liệu student từ API
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

export const requestEditProfile = async (data) => {
    try {
        const res = await request.put('/api/editReader', data);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};

// Interceptor cho request: Thêm token từ cookie vào header Authorization
request.interceptors.request.use(
    (config) => {
        // Sửa lại logic lấy token từ cookie
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('Token='))
            ?.split('=')[1]; // Lấy giá trị token từ cookie có tên 'Token'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/*// Interceptor cho response: Xử lý lỗi từ server
request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Không được ủy quyền - Vui lòng đăng nhập lại');
                    break;
                case 403:
                    console.error('Bị cấm - Bạn không có quyền truy cập');
                    break;
                case 404:
                    console.error('Không tìm thấy API');
                    break;
                default:
                    console.error('Lỗi từ máy chủ:', error.response.data);
            }
        } else {
            console.error('Lỗi kết nối:', error.message);
        }
        return Promise.reject(error);
    }
);*/

export default request;