<template>
    <div>
        <template v-for="item in routes">
            <el-submenu :index="item.title" class="sider-hover"  v-if='item.children&&item.children.length>0'>
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>{{item.title}}</span>	
                </template>
                <template v-for="child in item.children">
                    <sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
                    <router-link v-else :to="(item.parent?'/'+item.parent:'')+'/'+item.code+'/'+child.code">
                        <el-menu-item :index="item.code+'/'+child.code">
                            <i class="el-icon-setting"></i>
                            <span>{{child.title}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
        
            </el-submenu>
            
            <router-link v-else slot="title" :to="'/'+sidebarcurMenu+'/'+item.code">
                <el-menu-item :index="item.title">
                    <i class="el-icon-setting"></i>
                    <span>{{item.title}}</span>		
                </el-menu-item>
            </router-link>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'SidebarItem',
    props: {
        routes: {}
    },
    data(){
        return{
        }
    },
    computed: {     
        ...mapGetters([
            'sidebarcurMenu',
        ]),
    },

    mounted() {
    },
    methods:{
        toRouter(item){
            
        },
    }
}
</script>
