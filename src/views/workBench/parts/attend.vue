<template>
    <div class="box_h300">
        <div class="boxTit u-flex_row">
            <h3>考勤管理</h3>
            <el-select v-model="gradeValue" class="w150" size="small" placeholder="请选择年级" @change="getStatistics">
                <el-option v-for="item in gradeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <!-- <div class="setting">预警设置</div> -->
        </div>
        <div class="kqbox">
            <div class="chartsBox" id="chartsBox_attend"></div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
import * as securityApi from "@/api/securityApi.js";
export default {
    name:"AttendChart", 
    data () {
        return {
            cur_period:"",
            gradeOptions:[],
            gradeValue: "0",
            chartData: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    top: 20,
                    icon: 'circle',    // 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'          
                    itemWidth: 10, //修改icon图形大小
                    data: ['正常', '迟到/早退', '缺勤', '请假']
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    position: 'top',
                    axisLine: {
                        show: false,   // 坐标轴是否显示
                    },
                    axisTick: {
                        show: false,   // 坐标轴上的刻度是否显示
                    }
                },
                yAxis: [{
                    type: 'category',
                    nameTextStyle: {
                        width: 50
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#000',  // 坐标轴的颜色
                            opacity: 0.2,
                        }
                    },
                    axisTick: {
                        show: false,   // 坐标轴上的刻度是否显示
                    },
                    axisLabel: {
                        formatter: function (value) {
                            var className = "";
                            var nameNum = value.length;
                            var setNum = 3;     // 设定多少个字符就换行
                            var rowNum = 2;
                            if (nameNum > setNum) {
                                for (var i = 0; i < rowNum; i++) {
                                    var tempStr = "";
                                    var start = i * setNum;       // 每行开始字数
                                    var end = start + setNum;     // 每行结束字数
                                    if (i === (rowNum - 1)) {
                                        tempStr = value.substring(start, nameNum);
                                        if(tempStr.length>8){
                                            tempStr = tempStr.slice(0,8) + '...';
                                        }
                                    } else {
                                        tempStr = value.substring(start, end) + "\n";
                                    }
                                    className += tempStr;
                                }
                            } else {
                                className = value;
                            };
                            return className
                        },
                    },
                }, {
                    type: 'category',
                    nameTextStyle: {
                        width: 50
                    },
                    axisTick: {
                        show: false,   // 坐标轴上的刻度是否显示
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'red',  // 坐标值得具体的颜色
                        },
                        formatter: function (params) {
                            if (params > 10 && params < 20) {
                                return '{moreTen|' + '迟到/早退\n率超10%' + '}';
                            } else if (params > 20) {
                                return '{moreTwenty|' + '迟到/早退\n率超20%' + '}';
                            } else {
                                return " "
                            }
                        },
                        rich: {
                            moreTen: {
                                color: '#FFB600',
                            },
                            moreTwenty: {
                                color: '#FF5E33',
                            }
                        }
                    }
                }],
                color: ["#54ABFF", "#F9C076", "#FF8564", "#5FE9BA"],
                series: [
                    {
                        name: '正常',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20
                    },
                    {
                        name: '迟到/早退',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20
                    },
                    {
                        name: '缺勤',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20
                    },
                    {
                        name: '请假',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 20
                    },

                ]
            },
        }
    },
    created(){
        this.getAttendList()
    },
    methods:{
        /**
         * 获取 考勤管理 区域接口
         * 1.getAttendList 获取年级列表和时间段列表
         * 2.getStatistics 获取考勤管理的数据并调用getCharts 画图表
         */
        async getAttendList(){
            var data = {
                schoolCode: this.$parent.schoolCode
            }
            await Promise.all([
                api.getGradeList(data),
                securityApi.getTimeperiod_stu(data)
            ]).then((res) => {
                var val = res.map(item => {
                    return item.value && item.value.length > 0? item.value:[]
                })
                this.gradeOptions = [{name:"全部年级",code:'0'}].concat(val[0])
                val[1].forEach(item => {
                    if (item.cur == 1) this.cur_period = item.id
                })
                this.getStatistics()
            });
        },
        async getStatistics () {
            var data = {
                schoolCode: this.$parent.schoolCode,
                date: this.$parent.today,
                period: this.cur_period,
                grade: this.gradeValue
            }
            
            var apiUrl = this.gradeValue==0||!this.gradeValue ?  'listGradeStatisticsBySchool': 'listClassStatisticsByGrade'
            var res = await securityApi[apiUrl](data);
            this.getCharts(res)
        },
        getCharts(res){
            // 获取图表dom对象
            let chartsObj = echarts.init(document.getElementById('chartsBox_attend'));
            if(this.$parent.judgeCharts(res,chartsObj)){
                // 考勤管理
                var statistics = res.value && res.value.length > 0 ? res.value : []
                var nameList = statistics.map(({ name }) => name);
                var okCount = statistics.map(({ okCount }) => okCount);         //正常
                var lateOrLeaveearlyCount = statistics.map(({ lateOrLeaveearlyCount }) => lateOrLeaveearlyCount); //迟到/早退
                var uncardCount = statistics.map(({ uncardCount }) => uncardCount);         //缺勤
                var leaveCount = statistics.map(({ leaveCount }) => leaveCount);            //请假            
                var account = statistics.map((item) => {
                    var sum = item.lateOrLeaveearlyCount + item.okCount + item.uncardCount + item.leaveCount
                    var spec = (item.lateOrLeaveearlyCount / sum * 100).toFixed(0);
                    return spec
                });
                this.chartData.yAxis[0].data = nameList
                this.chartData.yAxis[1].data = account
                this.chartData.series[0].data = okCount
                this.chartData.series[1].data = lateOrLeaveearlyCount
                this.chartData.series[2].data = uncardCount
                this.chartData.series[3].data = leaveCount

                this.$parent.getChartsInit(chartsObj,this.chartData)
            }
        },
    }
}
</script>