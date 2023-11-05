// 缓存动态路由，并融合静态路由
import { routes, resetRouter } from '@/router' // 引入静态路由
export default {
  namespaced: true,
  state: {
    menulist: [...routes]
  },
  mutations: {
    // 融合动静路由
    setMenu(state, asyncRoutes) {
      state.menulist = [...routes, ...asyncRoutes]
    },
    // 退出登录时清空数据，重置路由
    resetRouter(state) {
      resetRouter()
      state.menulist = [...routes]
    }

  }
}
