<template>
    <div class="box_h200">
        <div v-if="helthStatisticeIsLoad">
            <div class="boxTit u-flex_row twTitBox">
                <h3>体温检测</h3>
                <div class="twCont u-flex_row">
                    <div class="twBox bg_1">
                        <div class="addIcon">
                            体温正常
                            <span>{{helthStatistice.normalCount?helthStatistice.normalCount:0}}</span>
                        </div>
                    </div>
                    <div class="twBox bg_2">
                        <div class="addIcon">
                            体温异常
                            <span>{{helthStatistice.abnormalCount?helthStatistice.abnormalCount:0}}</span>
                        </div>
                    </div>
                    <div class="twBox bg_3">
                        <div class="addIcon">
                            复查合格
                            <span>{{helthStatistice.fjnormalCount?helthStatistice.fjnormalCount:0}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <el-table class="miniTable" height="110" :data="abnormalList">
                <el-table-column :show-overflow-tooltip="true" label="异常人员" prop="userName"
                ></el-table-column>
                <el-table-column :show-overflow-tooltip="true" label="部门">
                    <template slot-scope="scope">
                        {{scope.row.className?scope.row.className:scope.row.deptName}}
                    </template>
                </el-table-column>
                <el-table-column label="检查项目" prop="checkName">
                </el-table-column>
                <el-table-column label="体温">
                    <template slot-scope="scope">
                        {{scope.row.temperature.toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="处理状态">
                    <template slot-scope="scope">
                        <span class="open" @click="openHandle('temperature',scope.row)">待处理</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import * as api from "@/api/index.js";
import * as benchApi from "@/api/workBench.js";
export default {
    name:"HealthPart", 
    data () {
        return {
            helthStatisticeIsLoad:false,
            helthStatistice:{},
            abnormalList: [],       // 异常数据
        }
    },
    created(){
        this.getTemperature()
    },
    methods:{
        /**
         * 获取首页体温区域的统计及列表
         * 四个接口
         * 1.getIndexHelthCheckStudentTemperatureStatistics 获取首页学生的统计
         * 2.getIndexHelthCheckTeacherTemperatureStatistics 获取首页教师的统计
         * 3.getTemStudentList  获取学生温度数据 abnormalState=-1 为异常
         * 4.getTemTeacherList  获取教职工温度数据 abnormalState=-1 为异常
         */
        async getTemperature(){
            this.helthStatisticeIsLoad = false;
            var data = {
                schoolCode: this.$parent.schoolCode,
                data: this.$parent.today
            }
            var data2 = {
                userid: this.$parent.userId,
                date: this.$parent.today,
                pageIndex:1,
                pageSize:1000,
                abnormalState:-1
            }
            Promise.all([
                benchApi.getIndexHelthCheckStudentTemperatureStatistics(data),
                benchApi.getIndexHelthCheckTeacherTemperatureStatistics(data),
                api.getTemStudentList({...data,...data2}),
                api.getTemTeacherList({...data,...data2})
            ]).then((res) => {
                // 累加学生统计 和 教师统计
                if(res[0].value[0] && res[1].value[0]){
                    this.helthStatistice.abnormalCount = res[0].value[0].abnormalCount + res[1].value[0].abnormalCount;
                    this.helthStatistice.fjnormalCount = res[0].value[0].fjnormalCount + res[1].value[0].fjnormalCount;
                    this.helthStatistice.normalCount = res[0].value[0].normalCount + res[1].value[0].normalCount;    
                }else{
                    this.helthStatistice.abnormalCount = 0;
                    this.helthStatistice.fjnormalCount = 0;
                    this.helthStatistice.normalCount = 0;
                }
                
                // 合并学生异常列表 和 教师异常列表
                this.abnormalList = [...res[2].value.dataList,...res[3].value.dataList]
                this.helthStatisticeIsLoad = true;
            });
        },
    }
}
</script>