<template>
    <div class="box_h300">
        <div class="boxTit">
            <h3>{{schoolName}}</h3>
        </div>
        <div class="statisticsInfo u-flex_row">
            <div class="statisBox">
                <div class="tit">校区数量</div>
                <div class="num">{{schoolInfo.addressCount}}</div>
            </div>
            <div class="statisBox">
                <div class="tit">在校学生总数</div>
                <div class="num">{{schoolInfo.studentCount}}</div>
            </div>
            <div class="statisBox">
                <div class="tit">在校教职工总数</div>
                <div class="num">{{schoolInfo.teacherCount}}</div>
            </div>
            <div class="statisBox">
                <div class="tit">安保人员总数</div>
                <div class="num">{{schoolInfo.guarduserCount}}</div>
            </div>
        </div>
        <div class="boxTit mt10">
            <h3>日常巡更</h3>
        </div>
        <div class="patrolStatis u-flex_row">
            <div class="patrolBox bg_1">
                今日巡更计划<span>{{patrolInfo.patrolDayTaskCount}}</span>
            </div>
            <div class="patrolBox bg_2">
                今日巡更人员<span>{{patrolInfo.patrolDayUserCount}}</span>
            </div>
            <div class="patrolBox bg_3">
                未完成计划<span>{{patrolInfo.notFinishedCount}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import * as baseApi from "@/api/baseApi.js";
import * as benchApi from "@/api/workBench.js";
export default {
    name:"ApatrolPart", 
    data () {
        return {
            schoolName: localStorage.getItem("schoolName"),
            schoolInfo:{},              //学校的统计
            patrolInfo:{},
        }
    },
    created(){
        this.getSchoolUserCount()
    },
    methods:{
        
        /**
         * 获取学校相关统计
         * 1.getSchoolUserCount 获取学校学生,老师,安防人员数量
         */
        async getSchoolUserCount(){
            var data = {
                schoolCode: this.$parent.schoolCode
            }
            await Promise.all([
                baseApi.getSchoolUserCount(data),
                benchApi.getPatrolDayStatistics({...data,date:this.$parent.today})
            ]).then((res) => {
                var val = res.map(item => {
                    return item.value ? item.value:{}
                })
                this.schoolInfo = val[0]
                this.patrolInfo = val[1]
            })
        },
    }
}
</script>