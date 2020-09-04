<template>
    <el-container class="app-container">
        <el-aside width="200px" :class="{hideSidebar:!sidebar.opened}">
            <sidebar></sidebar>
        </el-aside>
        <el-container>
            <el-header>
                <Headerbar></Headerbar>
            </el-header>
            <el-main class="u-flex_col">
                <navbar></navbar>
                <app-main class="u-flex"></app-main>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { Headerbar, Sidebar, AppMain, Navbar } from '@/views/layout';

export default {
    name: 'layout',
    components: {
        Headerbar, Sidebar, AppMain, Navbar
    },
    computed: {
        ...mapGetters([
            'sidebar',
        ]),
    }
}
</script>

