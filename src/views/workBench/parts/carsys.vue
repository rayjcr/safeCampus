<template>
    <div class="box_h300">
        <div class="boxTit">
            <h3>车辆管理</h3>
            <!-- <div class="setting">预警设置</div> -->
        </div>
        <div class="kqbox">
            <div class="chartsBox" id="chartsBox_car"></div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
export default {
    name:"CarChart", 
    data () {
        return {
            carCounts:[],
            chartData: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    icon: 'circle',
                    top: 10,
                    left: '60%',
                    itemWidth: 10, //修改icon图形大小
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 400,
                        color: '#333',
                        lineHeight: '16',
                    },
                    data: [
                        {
                            name: '滞留总车辆',
                            textStyle: {
                                fontWeight: 'bold'
                            }
                        }, '校内',
                        {
                            name: '校内出',
                        },
                        {
                            name: '校内入',
                        }, '外来',
                        {
                            name: '校外出',
                        },
                        {
                            name: '校外入',
                        }
                    ],
                    formatter: (name) => {
                        var index = 0;
                        var carLabels = ['滞留总车辆', '校内', '校内出', '校内入', '外来', '校外出', '校外入'];
                        var carCounts = this.carCounts;
                        carLabels.forEach(function (value, i) {
                            if (value === name) {
                                index = i;
                                name += "：   " + carCounts[index];
                            } else return;
                        });
                        return "  " + name;
                    }
                },
                series: [
                    {
                        name: '滞留总车辆',
                        type: 'pie',
                        color: '#fff',
                        selectedMode: 'single',
                        radius: [0, '26%'],
                        center: ['30%', '50%'],
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: 335,
                                name: '滞留车辆\n335',
                                label: {
                                    position: 'center',
                                    fontSize: '13',
                                    color: '#333',
                                    lineHeight: 13,
                                }
                            },
                        ]
                    },
                    {
                        name: '车辆性质',
                        type: 'pie',
                        radius: ['25%', '55%'],
                        center: ['30%', '50%'],
                        label: {
                            show: false,
                            position: 'inner',
                            fontSize: '12px',
                            color: '#333',
                        },
                        data: [
                            {
                                value: 100,
                                name: '校内',
                                itemStyle: {
                                    color: '#54ABFF'
                                }
                            },
                            {
                                value: 50,
                                name: '外来',
                                itemStyle: {
                                    color: '#F9C076'
                                }
                            },
                        ]
                    },
                    {
                        name: '进出来源',
                        type: 'pie',
                        radius: ['55%', '75%'],
                        center: ['30%', '50%'],
                        label: {
                            show: false,
                            position: 'inner',
                            fontSize: '12px',
                            color: '#333',
                        },
                        data: [
                            {
                                value: 50,
                                name: '校内入',
                                itemStyle: {
                                    color: '#A8D4FF'
                                }
                            },
                            {
                                value: 50,
                                name: '校内出',
                                itemStyle: {
                                    color: '#9677EE'
                                }
                            },
                            {
                                value: 35,
                                name: '校外入',
                                itemStyle: {
                                    color: '#FFE0B8'
                                }
                            },
                            {
                                value: 15,
                                name: '校外出',
                                itemStyle: {
                                    color: '#FFB087'
                                }
                            }
                        ]
                    }
                ]
            },
        }
    },
    created(){
        this.getCarVisitList()
    },
    methods:{
        /**
         * 获取首页车辆管理列表并调用getCharts 画图表
         */
        async getCarVisitList(){
            var data = {
                schoolCode: this.$parent.schoolCode,
                date: this.$parent.today   
            }
            let res = await api.getCarManageEcharts(data)
            //测试数据 真实数据丢res
            let TestList =  {
                resultCode:1,
                value:{
                    retentionCount:66,
                    carTypeStatisticsList:[
                        {vehicleType:0,retentionCount:3,inCount:3,outCount:0},{vehicleType:1,retentionCount:10,inCount:5,outCount:5},{vehicleType:2,retentionCount:53,inCount:30,outCount:23}
                    ]
                }
            }
            this.getCharts(TestList)
        },
        getCharts(res){
             // 获取图表dom对象
            let chartsObj = echarts.init(document.getElementById('chartsBox_car'));

            var list = res.value;
            let carCounts = list.retentionCount;
            let schoolIn=0,schoolOut=0,visitIn=0,visitOut=0;

            if(carCounts<1){
                chartsObj.showLoading({
                    text: '暂无数据',
                    color: '#ffffff',
                    textColor: '#8a8e91',
                    maskColor: 'rgba(255, 255, 255, 0.8)',
                })
                return false
            }
            

            for(let i=0;i<list.carTypeStatisticsList.length;i++){
                if(list.carTypeStatisticsList[i].vehicleType==1){
                    schoolIn = list.carTypeStatisticsList[i].inCount;
                    schoolOut = list.carTypeStatisticsList[i].outCount;
                }else{
                    visitIn = visitIn + list.carTypeStatisticsList[i].inCount
                    visitOut = visitOut + list.carTypeStatisticsList[i].outCount
                }
            }
            this.carCounts = [carCounts,schoolIn+schoolOut,schoolOut,schoolIn,visitIn+visitOut,visitOut,visitIn]
            
            this.chartData.series[0].data[0].value = this.carCounts[0];
            this.chartData.series[0].data[0].name = '滞留车辆\n'+this.carCounts[0]

            this.chartData.series[1].data[0].value = this.carCounts[1];
            this.chartData.series[1].data[1].value = this.carCounts[4];

            this.chartData.series[2].data[0].value = this.carCounts[2];
            this.chartData.series[2].data[1].value = this.carCounts[3];
            this.chartData.series[2].data[2].value = this.carCounts[5];
            this.chartData.series[2].data[3].value = this.carCounts[6];

            this.$parent.getChartsInit(chartsObj,this.chartData)
        },
    }
}
</script>