import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menuList from './modules/menuList'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user,
    menuList
  }
})

export default store
