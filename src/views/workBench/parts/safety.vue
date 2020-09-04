<template>
    <div class="box_h200">
        <div class="boxTit">
            <h3>安防预警</h3>
            <!-- <div class="setting">预警设置</div> -->
        </div>
        <div class="kqbox200">
            <div class="chartsBox" id="chartsBox_safety"></div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
export default {
    name:"SafetyCart", 
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
            chartData:{
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                grid: {
                    left: '0%',
                    containLabel: true
                },
                legend: {
                    orient: 'vertical',
                    top: 0,
                    left: "60%",
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                    textStyle: {
                        lineHeight: '16',
                    }
                },
                color: ['#54ABFF','#5FE9BA','#9677EE','#F9C076','#FF8564'],
                series: {
                    name: '滞留',
                    type: 'pie',
                    showVal: true,
                    selectedMode: 'single',
                    radius: ['30%', '85%'],
                    center: ['30%', '50%'],
                    label: {
                        show: false,
                    },
                    data: []
                }
            },
        }
    },
    created(){
        this.getSafetyList()
    },
    methods:{
        /**
         * 获取安防预警的数据并调用getCharts 画图表
         */
        async getSafetyList(){
            var data = {
                schoolCode: this.$parent.schoolCode,
                begin: this.$parent.today,
                end: this.$parent.today,
                userId: this.$parent.userId
            }
            let res = await api.safetyStaticsList(data)
            this.getCharts(res)
        },
        async getCharts(res){
            // 获取图表dom对象
            let chartsObj = echarts.init(document.getElementById('chartsBox_safety'));
            if(this.$parent.judgeCharts(res,chartsObj)){
                // 安防预警
                var statistics = res.value && res.value.length > 0 ? res.value : []
                //弄点模拟数据...
                let TestList = [
                    {value:await this.randomNum(),name:'行为预警'},
                    {value:await this.randomNum(),name:'人为预警'},
                    {value:await this.randomNum(),name:'传感预警'},
                    {value:await this.randomNum(),name:'事件预警'}]
                statistics = statistics.concat(TestList);

                // 把已处理和未处理的数量相加
                statistics.forEach(item => {
                    if(!item.value){
                        item.value = item.dealWithCount + item.noDealWithCount;
                    }
                });
                this.chartData.legend.formatter = (params) => {
                    statistics.forEach(item => {
                        if (item.name == params) {   //两个名称进行对比，取出对应的次数
                            params +='：' + item.value
                        }else return
                    })
                    return "  " + params;
                }
                this.chartData.series.data = statistics

                this.$parent.getChartsInit(chartsObj,this.chartData)
            }
        },
        
        randomNum(){
            return this.$parent.randomNum()
        },
    }
}
</script>