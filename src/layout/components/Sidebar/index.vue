<template>
  <div class="has-logo">
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 左侧菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        :collapse-transition="false"
        :unique-opened="true"
      >
        <!-- 菜单中的每一项 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem, Logo },
  computed: {
    routes() {
      // 根据此处的路由渲染左侧列表
      // 1.将路由表转化为动态添加，放在vuex中缓存，并与原始的静态路由融合
      return this.$store.state.menuList.menulist // 取出vuex中menu路由数据进行渲染
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

