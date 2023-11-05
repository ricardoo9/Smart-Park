<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加角色</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="currentActive">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="currentActive === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="infoForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="currentActive === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                check-strictly
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="currentActive === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in disabledtreeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  check-strictly
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div></main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="currentActive>1" @click="prev">上一步</el-button>
        <el-button v-if="currentActive<3" type="primary" @click="next">下一步</el-button>
        <el-button v-if="currentActive === 3" type="primary" @click="createRole">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
// import Index from './index.vue'
import { getTreeListAPI, createRoleUserAPI, getRoleDetailAPI } from '@/api/system'

export default {
  data() {
    return {
      currentActive: 1,
      // 角色信息校验
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeList: [], // 树形权限列表
      disabledtreeList: [], // 禁用树
      perms: []
    }
  },
  mounted() {
    this.getTreeList()
    this.getRoleDetail()
  },
  methods: {
    // 获取角色列表回填
    async getRoleDetail() {
      const roleId = this.$route.query.roleId
      const res = await getRoleDetailAPI(roleId)
      const { roleName, remark, perms } = res.data
      // 回填角色数据
      this.roleForm.roleName = roleName
      this.roleForm.remark = remark
      // 回填树
      this.$refs.tree.forEach((treeinstance, index) => {
        // 调用setchecked方法回填数据
        treeinstance.setCheckedKeys(perms[index])
      })
    },
    async createRole() {
      await createRoleUserAPI({
        ...this.roleForm,
        perms: this.perms
      })
      this.$message({
        type: 'success',
        message: '添加角色成功'
      })
      // 路由跳转
      this.$router.back()
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      // 引用数据类型不能直接赋值，需要进行转换
      this.disabledtreeList = JSON.parse(JSON.stringify(res.data))
    },
    prev() {
      // 1的时候不能点击
      if (this.currentActive === 1) return
      this.currentActive--
    },
    next() {
      // 3的时候不能点击
      if (this.currentActive === 3) return
      // 角色信息统一校验
      if (this.currentActive === 1) {
        this.$refs.infoForm.validate(valid => {
          if (valid) {
            this.currentActive++
          }
        })
      } else if (this.currentActive === 2) {
        // 选择角色权限页面，判断最少选择一项
        this.$refs.tree.forEach(treeinstance => {
          // 调用getcheckkeys方法得到选择了几项,添加到权限数组判断
          this.perms.push(treeinstance.getCheckedKeys())
          if (this.perms.flat().length === 0) {
            this.$message({
              type: 'error',
              message: '请至少选择一个权限点'
            })
          } else {
            this.currentActive++
            // 第三步回填数据
            this.$refs.diabledTree.forEach((treeinstance, index) => {
              // 调用setchecked方法回填数据
              treeinstance.setCheckedKeys(this.perms[index])
            })
          }
        })
      }
    }
  }

}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
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
}
</style>
