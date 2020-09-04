<template>
    <div class="app-container login-container">
        <div class="login-form">
            <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" v-if="!chooseAct">
                <h3 class="title">智校安平台</h3>
                <el-form-item prop="username">
                    <el-input name="username" type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
            <div class="actBox" v-if="chooseAct">
                <h3 class="title">选择角色</h3>

                <ul class="chooseAct cusMiniScroll">
                    <li v-for="(item, index) in actList" :key="index" @click="loginTicket(item)">
                        <div class="actHeader">
                            <div class="img">
                                <img @src="item.schoolLogo">
                            </div>
                        </div>
                        <p class="name">{{item.schoolName}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import * as api from '@/api/index';
import { setToken } from '@/utils/auth';
const Base64 = require('js-base64').Base64
export default {
    name: 'login',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username:"",
                password:"",
            },
            loginRules:{
                username: [{
                    required: true,
                    message: '账户不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    trigger: 'blur',
                    validator: validatePass
                }],
            },
            loading: false,
            actList:[],
            chooseAct: false
        }
    },
    methods: {
        handleLogin(){
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    var loginForm = {
                        username: this.loginForm.username,
                        password: this.randpass(this.loginForm.password),
                    }
                    api.login(loginForm).then(res => {
                        if(res.resultCode==1){
                            this.tokenSuccess(res);
                            this.loading = false;
                        }else{
                            this.$notify({title:"提示",message:"用户名密码错误",type:"error"});
                            this.loading = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        async tokenSuccess(res){
            var list = res.value?res.value:[]
            if(list.length<1){
                this.loginForm = {
                    username:"",
                    password:"",
                }
                this.$notify({title:"提示",message:"当前账号暂无权限，请切换账号进行登录",type:"error"});
            }else if(list.length==1){
                this.loginTicket(list[0])
            }else{
                this.loginTicket(list[0])
                // this.actList = list
                // this.chooseAct= true
            }
        },
        async loginTicket(valObj){
            var data = {
                token: valObj.ticket
            }
            var res = await api.loginTicket(data)
            if(res.resultCode==1){
                this.$store.dispatch("setToken",valObj.ticket)
                setToken(valObj.ticket)
                window.localStorage.setItem('schoolCode',valObj.schoolCode)
                window.localStorage.setItem('userId',valObj.userId)
                window.localStorage.setItem('name',valObj.name)
                window.localStorage.setItem('schoolName',valObj.schoolName)
                window.localStorage.setItem('schoolLogo',valObj.schoolLogo)
                this.getXuenian()
                this.$router.push({path:'/'})
            }else{
                this.$notify({title:"提示",message:"登录失败，请重新登录",type:"error"});
            }
            
        },
        async getXuenian(){
            var res = await api.getXuenian()
            if(res.value){
                window.localStorage.setItem('xueNian',res.value.xueNian)
                window.localStorage.setItem('xueQi',res.value.xueQi)
            }
        },
        randpass(pas){
            var l = pas.length;
            var ofs = parseInt(Math.random() * 100 % 4) + 2;
            ofs = ofs > 4 ? 4 : ofs;
            var icount = parseInt(l / ofs);
            var imod = l % ofs;
            var q = [];
            var is = 0;
            var endOffset = ofs;
            for (var i = 0; i < icount; i++) {
                q.push(pas.substring(is, endOffset));
                q.push(this.randomString(1));
                is = endOffset;
                endOffset = is + ofs;
            }
            if (imod > 0) {
                q.push(pas.substring(is, l));
            }
            var src = ofs + "" + q.join("");
            console.log(pas)
            return Base64.encode(src);
        },
        randomString(w){
            var q = [];
            var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*_+!()#$%^";
            var l = str.length;

            for (var i = 0; i < w; i++) {
                var ofs = parseInt(Math.random() * 100) % l;
                q.push(str[ofs]);
            }
            return q.join("");
        },
    },
}
</script>