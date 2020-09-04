<template>
    <el-menu class="navbar u-flex_row" mode="horizontal">
        <div class="levelName u-flex">{{levelName}}</div>
        <el-breadcrumb class="app-levelbar" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
                <span class="no-redirect">{{item.name}}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'NavbarMin',
    components: {
    },
    data() {
        return {
            levelName: '',
            levelList:[]
        }
    },
    watch: {
        $route() {
            this.getPageTit();
        }
    },
    computed: { 
        ...mapGetters([
        ])
    },
    mounted() {
        this.getPageTit();
    },
    methods: {
        getPageTit(){
            let matched = this.$route.matched.filter(item => item.name);
            this.levelList = matched
            this.levelName = matched[matched.length-1].name;
        }
    }
}
</script>
