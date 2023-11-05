import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 为axios添加token请求头，鉴权只有token有效，才能返回正常数据，返回的格式由后端决定
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 错误提示
    Message({
      type: 'warning',
      message: error.response.data.msg
    })

    return Promise.reject(error)
  }
)

export default service
