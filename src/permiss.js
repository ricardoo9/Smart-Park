// 路由前置守卫判断是否有token，后看是否在白名单内部
import router from './router'
import store from './store'
import { asyncRoutes } from './router/asyncRoutes'
import { getToken } from './utils/auth'
const WHITE_LIST = ['/login', '/404']
// 获取一级路由
function getFirstRouter(perms) {
  const newArr = perms.map((item) => {
    return item.split(':')[0]
  })
  // set方法进行去重复项
  return [...new Set(newArr)]
}
// 处理二级路由
function getSecondRouter(perms) {
  const newArr = perms.map((item) => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(newArr)]
}
// 过滤一二级路由方法
function getRoutes(firstRouter, secondRouter, asyncRoutes) {
  // 思路：先过滤出有一级路由的项，再用map遍历出有二级路由的项
  return asyncRoutes.filter(item => {
    return firstRouter.includes(item.permission)
  }).map(item => {
    // 二级过滤
    return {
      ...item,
      children: item.children.filter(item => secondRouter.includes(item.permission)) }
  })
}

router.beforeEach(async(to, from, next) => {
  const token = getToken()
  // 判断token是否存在
  if (token) {
    // 有token放行
    next()
    // 1.调用action函数存储拿到数据
    const permissions = await store.dispatch('user/getProfile')
    // 2.调用一二级处理函数，处理成想要的格式
    const firstRouter = getFirstRouter(permissions)
    const secondRouter = getSecondRouter(permissions)
    console.log(firstRouter, secondRouter)
    // 3.根据权限标识拿到权限数据
    const routes = getRoutes(firstRouter, secondRouter, asyncRoutes)
    console.log(routes)
    // 4.将得到的路由表加入到路由系统中 addroute方法
    routes.forEach(item => {
      router.addRoute(item)
    })
    // 5.将筛选出的路由列表加入到融合路由
    store.commit('menuList/setMenu', routes)
  } else {
    // 无token：判断是否在白名单中
    if (WHITE_LIST.includes(to.path)) {
      // 在白名单内放行
      next()
    } else {
      // 不在返回登录页面
      next('/login')
    }
  }
})
