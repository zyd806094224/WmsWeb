// src/utils/request.js
import axios from 'axios';
import { Message } from 'element-ui'; // 可选：UI 提示库
import router from '@/router'; // 可选：路由跳转

// 创建实例
const service = axios.create({
    // baseURL: "http://localhost:8088", // 从环境变量读取
    baseURL: "http://106.15.7.132:8088", // 从环境变量读取
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json', // 默认头
    },
});

// 请求拦截器：自动添加 Token
service.interceptors.request.use(
    (config) => {
        // 从本地存储或 Vuex 获取 Token
        const token = localStorage.getItem('user-token') || '';
        // if (token && !config.headers['Authorization']) {
        //     config.headers['Authorization'] = `Bearer ${token}`; // JWT 标准格式[5](@ref)
        // }

        if(!config.url.includes('/login')){ //登录接口不添加token
            if (token) {
                config.headers['token'] = token;
            }
        }

        // 可扩展：添加其他全局头参数
        if (config.headers['X-Custom-Header'] === undefined) {
            config.headers['X-Custom-Header'] = 'default-value';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：统一错误处理
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        // 根据后端约定判断业务逻辑错误（如 code !== 200）
        console.log("zzz222" + JSON.stringify(response))
        console.log("zzz222" + res.code)
        if (res.code != 200) {
            Message.error("请求出错。。");
            // return Promise.reject(new Error("出错了"));
            router.replace('/'); //去登录
        }
        return res;
    },
    (error) => {
        // HTTP 状态码处理（如 401 跳登录页）
        console.log("zzz" + JSON.stringify(error))
        if (error.response?.status === 401) {
            router.replace('/login');
            localStorage.removeItem('user-token');
        }
        Message.error(error.message || '请求失败');
        return Promise.reject(error);
    }
);

export default service;
