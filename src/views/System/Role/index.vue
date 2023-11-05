<template>
  <div class="role-container">
    <div class="left-wrapper">
      <!-- 实现点谁谁亮，记录下标，与点击拿到的下标对比，动态添加active类名 -->
      <div v-for="(item,index) in roleList" :key="item.roleId" class="role-item " :class="{active:currentIndex === index}" @click="switchId(index)">
        <div class="role-info">
          <svg-icon icon-class="user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="goEdit(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="delRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/addRole')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="first">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                show-checkbox
                default-expand-all
                node-key="id"
              />
            </div> </div></el-tab-pane>
        <el-tab-pane label="成员列表" name="second">
          <div class="user-wrapper">
            <el-table
              :data="roleUserList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div></el-tab-pane>

      </el-tabs>

    </div>
  </div></template>

<script>
// 添加禁用disabled属性
function addDisabled(treelist) {
  treelist.forEach(element => {
    element.disabled = true
    if (element.children) {
      // 对children
      addDisabled(element.children)
    }
  })
}
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserAPI, delRoleUserAPI } from '@/api/system'
export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      currentIndex: 0, // 当前下标
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      perms: [], // 权限列表
      activeName: 'first',
      roleUserList: []
    }
  },
  async mounted() {
    // 钩子函数中调用获取函数
    // 保证页面一加载就处理权限，默认第一项先加载
    await this.getRoleList()
    await this.getTreeList()
    this.switchId(0)
  },
  methods: {
    // 删除角色
    delRole(roleId) {
      this.$confirm('是否确认删除当前角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRoleUserAPI(roleId)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 跳转路由编辑角色
    goEdit(roleId) {
      this.$router.push({
        path: '/addRole',
        query: {
          roleId
        }
      })
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListAPI()
      //   console.log(res.data)
      this.roleList = res.data
    },
    // 点谁谁亮，权限列表赋值
    async switchId(index) {
      this.currentIndex = index
      //  获取当前角色id
      const roleId = this.roleList[index].roleId
      // 根据roleId获取当前角色权限列表,调用setKeys方法赋值到列表数据
      const res = await getRoleDetailAPI(roleId)
      this.perms = res.data.perms
      //   给当前角色权限赋值
      this.$refs.tree.forEach((instance, index) => {
        instance.setCheckedKeys(this.perms[index])
      })

      // 获取成员角色列表
      const resUser = await getRoleUserAPI(roleId)
      this.roleUserList = resUser.data.rows
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      //   递归添加禁用属性
      addDisabled(this.treeList)
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
