<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <!-- 密码记忆功能 -->
          <el-checkbox v-model="remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 1.表单校验，表单对象
      form: {
        username: '',
        password: ''
      },
      // 密码记忆功能
      remember: false,
      // 规则对象
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  //   初始化时执行加载密码用户名
  created() {
    const formData = localStorage.getItem('remember_key')
    // 对取值非空进行判断
    if (formData) {
      this.form = JSON.parse(formData)
    }
  },
  methods: {
    doLogin() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 对记忆密码进行判断,将账号密码存储到ls中
          if (this.remember) {
            localStorage.setItem('remember_key', JSON.stringify(this.form))
          } else {
            localStorage.removeItem('remember_key')
          }
          // async await保证token获取以后跳转
          await this.$store.dispatch('user/asyncLogin', this.form)
          // 跳转首页
          this.$router.push('/')
          // 提示登录成功
          this.$message({
            type: 'success',
            message: '登录成功'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}
.bg {
  width: 60vw;
  height: 100vh;
  background: url("~@/assets/login-bg.svg") no-repeat;
  background-position: right top;
  background-size: cover;
}
.box {
  margin: 200px 10% 0;
  flex: 1;
  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }
  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }
    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }
    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}
.login_btn {
  width: 100%;
}
</style>
