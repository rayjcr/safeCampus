<template>
    <el-row class="u-flex_row">
        <!-- <div class="hdlg u-flex">
            <el-button slot="reference" class="allApplication el-icon-menu"> 所有产品 </el-button>
        </div> -->
        <div class="hdmenu u-flex u-flex_row">
            <div class="logo"><img :src="avatar"/></div>
            <div class="schoolname">{{infoxxmc}}</div>
        </div>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper u-flex_row">
                <!-- <div class="avatar"><img :src="avatar"/></div> -->
                <span class="Topusername">{{username}}</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/">
                    <el-dropdown-item> 首页</el-dropdown-item>
                </router-link>
                <!-- <el-dropdown-item divided><span @click="grzl">个人资料</span></el-dropdown-item>
                <el-dropdown-item divided><span @click="xgmm">修改密码</span></el-dropdown-item> -->
                <el-dropdown-item divided><span @click="logout">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-row>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Headerbar',
    data() {
        return{
            username:window.localStorage.getItem("name"),
            
            avatar:window.localStorage.getItem("schoolLogo"),
            infoxxmc:window.localStorage.getItem("schoolName"),
        }
    },
    computed:{
        ...mapGetters([
            'sidebar',
        ])
    },
    components: {
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar',{"opened":this.sidebar.opened})
        },
        grzl(){},
        xgmm(){},
        logout(){
            this.$store.dispatch('LogOut').then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
        },
    }
}
</script>