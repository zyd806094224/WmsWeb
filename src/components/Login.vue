<template>
  <div class="loginBody">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">用户登录</h1>
        <el-form :model="loginForm" label-width="100px"
                 :rules="rules" ref="loginForm">
          <el-form-item label="账号" prop="no">
            <el-input style="width: 200px" type="text" v-model="loginForm.no"
                      autocomplete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input style="width: 200px" type="password" v-model="loginForm.password"
                      show-password autocomplete="off" size="small" @keyup.enter.native="confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm" :disabled="confirm_disabled">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      confirm_disabled: false,
      loginForm: {
        no: '',
        password: ''
      },
      rules: {
        no: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    testJsonP(){
      // 定义回调函数
      window.handleResponse = (data) => {
        console.log('Response:', data);
      };
      let script = document.createElement('script');
      script.src = 'http://10.253.55.126:8088/jsonp/api?callback=handleResponse';
      document.body.appendChild(script);
    },
    async requestLogin(loginForm) {
      try {
        const response = await this.$http.post("/user/login", loginForm)
        this.confirm_disabled = false;
        let data = response.data;
        console.log(response)
        if (response.code == 200) {
          //存储
          sessionStorage.setItem("CurUser", JSON.stringify(data.user))
          localStorage.setItem("user-token", data.token)
          console.log(JSON.stringify(data.menu))
          this.$store.commit("setMenu", data.menu)
          //跳转到主页
          await this.$router.replace('/Sms');
        } else {
          alert('校验失败，用户名或密码错误！')
        }
      } catch (e) {
        this.confirm_disabled = false;
        console.log(`catch===${e}`)
        alert('校验出现异常了')
      }
    },
    confirm() {
      // this.testJsonP()
      // if(true) return
      this.confirm_disabled = true;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {// valid成功为true,失败为false
          //后台验证
          this.requestLogin(this.loginForm)
          // this.$axios.post(this.$httpUrl + "/user/login", this.loginForm)
          //     .then(res => res.data)
          //     .then(res => {
          //       if (res.code == 200) {
          //         //存储
          //         sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
          //         console.log(JSON.stringify(res.data.menu))
          //         this.$store.commit("setMenu", res.data.menu)
          //         //跳转到主页
          //         this.$router.replace('/Index');
          //       } else {
          //         this.confirm_disabled = false;
          //         alert('校验失败，用户名或密码错误！')
          //         return false;
          //       }
          //     }).catch(error => { //异常情况处理
          //   this.confirm_disabled = false;
          //   // 在这里处理 Network Error
          //   if (error.message === 'Network Error') {
          //     alert('网络错误，请检查您的网络连接')
          //   }
          // })
        } else {
          this.confirm_disabled = false;
          console.log('校验失败')
          return false;
        }
      })
    }
  }

}
</script>

<style scoped>
.loginBody {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -250px;
  width: 450px;
  height: 330px;
  background: #fff;
  border-radius: 5%;
}

.login-title {
  margin: 20px 0;
  text-align: center;
}

.login-content {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 25px;
  left: 25px;
}

</style>
