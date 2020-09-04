<template>
    <div class="page-container feature-collect">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container">
                <div class="searchBox u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">归属：</span>
                        <el-select size="small" v-model="searchForm.organize" class="w150" clearable>
                            <el-option v-for="(item,index) in organizeList" :key="index" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">姓名：</span>
                        <el-input size="small" class="w150" v-model="searchForm.name"></el-input>
                    </div>
                    <el-button type="primary" @click="clickSearch">搜索</el-button>
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenCenter u-flex">
                    <el-radio-group class="mb20" v-model="switchType" size="small">
                        <el-radio-button class="classTab" label="1">白名单</el-radio-button>
                        <el-radio-button class="classTab" label="2">黑名单</el-radio-button>
                    </el-radio-group>
                    <el-table class="tableBorder" height="500" :data="tableData">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column label="归属" prop="gs"></el-table-column>
                        <el-table-column label="姓名" prop="name"></el-table-column>
                        <el-table-column label="人脸照片">
                            <template slot-scope="scope">
                                <img :src="scope.row.faceUrl" alt="" srcset="">
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="primary" @click="clickSearch(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="primary" @click="clickSearch(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import * as api from '@/api/index';
export default {
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            organizeList: [],              //归属
            searchForm:{
                organize: "",
                name:"",
            },
            tableData: [],
            pageIndex: 1,               //页码
            pageSize: 10,
            pageTotal:1,    
            
            switchType:1,

        }
    },
    created () {
        this.getList()
    },
    mounted () {
    },
    methods: {
        // 搜索
        clickSearch(){
            
        },
        getList(){
            this.tableData=[
                {
                    gs:"校内人员",
                    name:"张三",
                    faceUrl:""
                },
                {
                    gs:"校内人员",
                    name:"张三2",
                    faceUrl:""
                },
                {
                    gs:"校内人员",
                    name:"张三3",
                    faceUrl:""
                }
            ]
        },


        handleSizeChange(){

        },
        handleCurrentChange(){

        },
    }
}
</script>
<style lang='scss' scoped>

</style>

