import axios from 'axios'
import store from '@/store'
import {ElLoading, ElMessage} from 'element-plus'

const service = axios.create({
    baseURL: '/',
    loadingStatus: false
});

let loadingInstance = null;
let loadEntity = {
    lock: true,
    text: '数据正在加载中',
    background: 'rgba(0, 0, 0, 0.3)',
    customClass: 'loadingClass'
};
let needLoadingRequestCount = 0;
service.interceptors.request.use(
    config => {
        config.headers = {};
        config.headers['Content-Type'] = "application/json";
        config.headers['token'] = store.state.user.token;
        config.headers['Access-Token'] = store.state.user.token;
        config.headers['projectId'] = store.state.user.project_id;
        if (config.loadingStatus) {
            needLoadingRequestCount++;
            loadingInstance = ElLoading.service(loadEntity);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// response 拦截器
service.interceptors.response.use(
    response => {
        if (response.config.loadingStatus) {
            needLoadingRequestCount--;
            if (needLoadingRequestCount <= 0) {
                loadingInstance.close();
            }
        }
        return response.data;
    },
    error => {
        if (error && error.response && error.response.status === 401) { //未登录
            window.parent.location.href = window.location.protocol + "//" + document.domain + process.env.VUE_APP_GIC_URL
        } else {
            ElMessage.error({
                message: '网络错误，请稍后操作或联系管理员！',
                type: 'error'
            })
        }
        needLoadingRequestCount--;
        if (needLoadingRequestCount <= 0) {
            loadingInstance.close();
        }
        return Promise.reject(error.response.data);
    }
);
export default service
