import axios from 'axios';

const request = axios.create({
    baseURL: 'http://192.168.0.100:5000/',
    withCredentials: true,
});

export default request;