<template>
  <div class="login_bg">
    <div class="login_box">
      <!-- 头像 -->
      <div class="logo"></div>
      <!-- 表单 -->
      <el-form label-width="55px" class="from" :model="lgfrom" :rules="lgrules" ref="lgref">
        <el-form-item label="账号" prop="username">
          <el-input v-model="lgfrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="lgfrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="login">登录</el-button>
          <el-button type="info" plain @click="resetlgfrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      lgfrom: {
        username: 'admin',
        password: '123456'
      },
      //表单的认证规则
      lgrules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //重置
    resetlgfrom() {
      this.$refs.lgref.resetFields()
    },
    login() {
      this.$refs.lgref.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.lgfrom)
        if (result.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // console.log(result)
        // 将登录成功之后的token，保存到客户端的sessionStorage 
        window.sessionStorage.setItem('token', result.data.token)
        //通过编译后，跳转到后台主页 路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_bg {
  background: radial-gradient(circle, #bedefc, #ebf6fc);
  width: 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 10px;
  background-color: #ebf6fc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: #ccc 4px 4px 10px;
}
.logo {
  // background-color: aqua;
  width: 130px;
  height: 130px;
  margin: auto;
  background-image: url("../assets/timg.jpg");
  background-size: 100% 100%;
  border-radius: 50%;
  margin-top: -65px;
  box-shadow: #ccc -4px -4px 10px;
}
.from {
  padding: 0 50px;
  margin-top: 30px;
  text-align: right;
}
</style>
