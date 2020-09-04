import axios from 'axios';
import store from '../store';
import { Message, MessageBox, Notification} from 'element-ui';
import { getToken } from '@/utils/auth';


// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 20000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    if(store.getters.token){
        config.headers.Authorization = getToken(); 
        if (!getToken()) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
            })
        }
    }
    return config;
}, error => {
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => {
        if(response.status === 200 || response.status === 304){
                    
            return response.data;
        }else{
            console.log('网络不太给力哦，检查一下您的网络再试吧！')
        }
    },
    error => {
        console.log('err' + error); // for debug
        console.log('网络不太给力哦，检查一下您的网络再试吧！')
        let message = error.message;
        const status = error.response.status;
        if (status === 401) {
            store.dispatch('FedLogOut').then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
        }else{
            Message({
                message,
                type: 'error',
                duration: 5 * 1000
            });
        }
        return Promise.reject(error);
    }
);

export default service;


