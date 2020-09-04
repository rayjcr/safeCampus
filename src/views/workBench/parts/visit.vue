<template>
    <div class="box_h200">
        <div class="boxTit">
            <h3>智能访客</h3>
        </div>
        <div class="kqbox200">
            <div class="chartsBox" id="chartsBox_visit"></div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
export default {
    name:"VisitCart", 
    data () {
        var visitLegend = ['入校','出校','校内','不通过'];
        var visitSeries = () =>{
            var curItem = {
                type: 'bar',
                stack: '考勤',
                barWidth: 15,
                data: [],
            }
            var res = []
            visitLegend.forEach(item => {
                res.push({name:item,...curItem})
            })
            return res
        }
        return {
            visitorTypeList: [    // 访客类型
                { value: 0, label: '其他人员'},
                { value: 1, label: '家长'},
                { value: 2, label: '交工工友'},
                { value: 3, label: '业务人员'},
                { value: 4, label: '施工人员'},
                { value: 5, label: '送货人员'},
            ],
            chartData: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                legend: {
                    icon: 'circle',    // 标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'         
                    itemWidth: 10, //修改icon图形大小
                },
                grid: {
                    top: 30,
                    left: 0,
                    right: 0,
                    bottom: 20,
                    containLabel: true
                },
                xAxis:{
                    axisLabel: {
                        interval: 0,
                        rotate: -15,   // 刻度标签旋转的角度
                        align:'center',
                        verticalAlign: 'top'
                    },
                    type: 'category',
                    data:['入校', '出校', '校内', '不通过']
                },
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false   // 是否显示分隔线
                        }
                    }
                ],
                color: ['#54ABFF','#F9C076','#5FE9BA','#FF8564'],
                series:visitSeries()
            },
        }
    },
    created(){
        this.getVisitList()
    },
    methods:{
        /**
         * 获取智能访客的数据并调用getCharts 画图表
         */
        async getVisitList(){
            var data = {
                schoolCode: this.$parent.schoolCode,
                day: this.$parent.today 
            }
            let res = await api.getVisitorTypeNum(data)
            this.getCharts(res)
        },
        
        getCharts(res){
            // 获取图表dom对象
            let chartsObj = echarts.init(document.getElementById('chartsBox_visit'));
            if(this.$parent.judgeCharts(res,chartsObj)){
                // 智能访客
                var statistics = res.value && res.value.length > 0 ? res.value : []
                var nameList = this.visitorTypeList.map(({ label }) => label);
                var enterSchool,outSchool,inSchool,disagree
                enterSchool = statistics.map(({ enterCount }) => enterCount + this.randomNum());
                outSchool = statistics.map(({ leaveCount }) => leaveCount + this.randomNum());
                inSchool = statistics.map(({ insideCount }) => insideCount + this.randomNum());
                disagree = statistics.map(({ refuseCount }) => refuseCount + this.randomNum());

                // 设置 x轴的数据类别
                this.chartData.xAxis.data = nameList

                // 分别设置 4类数据 【'入校', '出校', '校内', '不通过'】
                this.chartData.series[0].data = enterSchool
                this.chartData.series[1].data = outSchool
                this.chartData.series[2].data = inSchool
                this.chartData.series[3].data = disagree

                this.$parent.getChartsInit(chartsObj,this.chartData)
            }
        },
        
        randomNum(){
            return this.$parent.randomNum()
        },
    }
}
</script>