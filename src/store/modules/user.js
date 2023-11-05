import { loginAPI } from '@/api/user'
import { removeToken, setToken } from '@/utils/auth'
import { getToken } from '@/utils/auth'
import { getProfileAPI } from '@/api/user'
export default {
  namespaced: true,
  state: {
    // 登录的token数据,先从cookie中拿到数据
    token: getToken() || '',
    profile: {} // 存储个人权限信息
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      // token存入cookie中，token持久化
      setToken(newToken)
    },
    setProfile(state, profile) {
      state.profile = profile
    },
    clearInfo(state) {
      state.token = ''
      state.profile = {}
      removeToken()
    }
  },
  //   接口请求 提交mutation
  actions: {
    // 调用异步请求方法进行请求数据,传入请求参数
    async asyncLogin(ctx, { username, password }) {
      // 拿到后端返回的token数据
      const res = await loginAPI({ username, password })
      ctx.commit('setToken', res.data.token)
    },
    // 获取个人权限信息存到state中去
    async getProfile(ctx) {
      const res = await getProfileAPI()
      ctx.commit('setProfile', res.data)
      return res.data.permissions
    }
  }
}
