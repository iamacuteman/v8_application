import axios from 'axios'
import auth from "./auth"
import message from 'ant-design-vue/lib/message';


class BaseApi {

    constructor() {
        this.axios = axios.create({
            timeout: 30000,
            withCredentials: true,
            headers: {
                'platform': "mixapplication",
                'Content-Type': "application/json",
            },
            params: {}
        });
        this.axios.interceptors.request.use((config) => {
            //解决开发环境下第一次打开应用鉴权失败的场景
            //在发送请求之前，判断headers有没有传Authorization,没有的话加上
            if (!config.headers.Authorization) {
                let user = auth.getUser()
                let token = user ? user.token : ""
                // let token = 'Q3AxVnVBWU1HUmJ6bjNGbmZNU1pWVXo1RzJnT2tWcUNOR3dSd25ERU1LYys2czhCZE5EN2FuZU1nTGQxUVFyNA=='
                config.headers.Authorization = 'Bearer ' + token
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        this.axios.interceptors.response.use((response) => {
            if (response.data) {
                if (response.data.code === 403) {
                    //跳转门户首页
                    window.location.href = '/#/'
                    return;
                } else if (response.data.code === 401) {
                    //跳转登录页
                    window.location.href = '/#/login';
                    return;
                } else if (response.data.code === 500 || response.data.code === 0) {
                    let errorMsg = response.data['info'] || response.data['msg'];
                    message.error(errorMsg);
                    return Promise.reject(response);
                }
            }
            return Promise.resolve(response)
        }, this.error);
    }

    error(error) {
        if (!error.response) {
            message.error(error.message);
            return Promise.reject(error);
        }
        if (error.response.status === 403) {
            //跳转门户首页
            window.location.href = '/#/'
            return;
        } else if (error.response.status === 401) {
            //跳转登录页
            window.location.href = '/#/login'
            return;
        }
        let errorMsg = error.response.data['info'] || error.response.data['msg'] || '未知错误';
        message.error(errorMsg);
        return Promise.reject(error);
    }

    get($url, data = {}) {
        return new Promise((resolve, reject) => {
            this.axios.get($url, { params: data }).then(response => { //http response
                if (response.status === 200) {
                    resolve(response.data)
                } else {
                    reject("something went wrong")
                }
            }).catch((error) => {
                reject(error)
            });
        })
    }

    post($url, data = {}, header = null, config = {}) {
        let conf = {
            ...config
        }
        if (header) {
            conf.headers = header;
        }
        return new Promise((resolve, reject) => {
            this.axios.post($url, data, conf).then(response => { //http response
                if (response.status === 200) {
                    resolve(response.data)
                } else {
                    reject("something went wrong")
                }
            }).catch((error) => {
                reject(error)
            });
        })
    }

    axios() {
        return this.axios
    }
}

export default new BaseApi()
