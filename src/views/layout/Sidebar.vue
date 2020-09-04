<template>
    <div class="sidebar-container u-flex_col">
        <div class="hdmenu u-flex_row">
            <!-- <div class="logo"><img :src="avatar"/></div>
            <div class="schoolname">{{infoxxmc}}</div> -->
        </div>
        <div class="u-flex">
            <router-link :to="'/'" class="sider-index sider-hover">
                <i class="el-icon-setting"></i>
                <span>工作台</span>
            </router-link>
            <div class="sider-index sider-hover tolink" @click="goUrl('http://124.160.79.218:8959/ydjy-demo/#/')">
                <i class="el-icon-setting"></i>
                <span>指挥中心</span>
            </div>
            <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse">
                <sidebar-item :routes='changepermissionMenus'></sidebar-item>
            </el-menu>
        </div>
        <div class="u-drawer" @click="toggleSideBar" :class="{'is-active':sidebar.opened}">
            <i class="el-icon-arrow-left"></i>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import router,{asyncRouterMap} from '@/router/index';
export default {
    data(){
        return{
            changepermissionMenus:[],
            avatar:window.localStorage.getItem("schoolLogo"),
            infoxxmc:window.localStorage.getItem("schoolName"),
        }
    },
    components: {
        SidebarItem
    },
    mounted() {
    },

    computed: {
        ...mapGetters([
            'sidebar',
            'permissionMenus'
        ]),
        isCollapse() {
            return !this.sidebar.opened
        }
    },
    created() {
        this.getMenu()
    },
    watch:{
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar',{"opened":this.sidebar.opened})
        },
        goUrl(url){
           window.open(url); 
        },
        getMenu(){
            const accessedRouters = this.filterAsyncRouter(asyncRouterMap);
            this.changepermissionMenus = accessedRouters
            // if(this.permissionMenus){
                // console.log(this.permissionMenus)
                // this.changepermissionMenus = [
                //     {
                //         title:"基础管理",
                //         code:'basicManage',
                //         children:[
                //             {
                //                 title:"教师通讯录",
                //                 code:'teacherAddress'
                //             }
                //         ]
                //     },{
                //         title:"安全管理",
                //         code:'baseManager2',
                //         children:[
                //             {
                //                 title:"教师通讯录2",
                //                 code:'hdw'
                //             }
                //         ]
                //     }
                // ]
                // const menuDatas = {};
                // this.changepermissionMenus.forEach(item => {
                //     menuDatas[item.code] = item
                // })
                // const accessedRouters = this.filterAsyncRouter(asyncRouterMap, menuDatas);
                //  router.addRoutes(accessedRouters) // 动态添加可访问路由表
            // }else{
            //     this.$notify({type: 'error',message: '初始化用户菜单出错,请联系管理员',duration: 4000});  
            // }
        },
        filterAsyncRouter(asyncRouterMap) {
            const accessedRouters = asyncRouterMap.filter(route => {
        
                route.title = route.name
                route.code = route.path.substr(0,1)=='/'?route.path.substr(1):route.path;
                if (route.children && route.children.length) {
                    route.children = this.filterAsyncRouter(route.children);
                }
                return route
            })
            return accessedRouters
        }
    }
}
</script>
