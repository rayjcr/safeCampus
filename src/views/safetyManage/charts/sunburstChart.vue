<template>
    <div class="chartBox">
        <!-- 图例 -->
        <div class="legends">
            <div class="legend" v-for="(legend, index) in legends" :key="index">
                <div
                    class="colorBox"
                    :style="'background:' + chartColors[index]"
                ></div>
                <div class="text">{{ legend.name + ":" + legend.percent }}</div>
            </div>
        </div>
        <div id="chart" :style="'height:' + height + ';width:' + width"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'chart',
    props: {
        height: {
            type: String,
            default: '100%'
        },
        width: {
            type: String,
            default: 'auto'
        }
    },
    data () {
        return {
            chart: null,
            chartColors: ['#54ABFF','#5FE9BA','#9677EE','#F9C076'],
            legends: [{
                name: '行为预警',
                percent: '35%',
            }, {
                name: '人员预警',
                percent: '22%',
            }, {
                name: '传感预警',
                percent: '16%',
            }, {
                name: '事件预警',
                percent: '27%',
            }]
        }
    },
    mounted () {
        this.initChart()
    },
    methods: {
        initChart () {
            this.chart = echarts.init(document.getElementById('chart'));
            var option = {
                color: this.chartColors,
                graphic: [{
                    type: 'text',
                    left: 'center',
                    top: '40%',
                    style: {
                        fill: '#333',
                        text: '预警总数:\n46',
                        textAlign: 'center'
                    }
                }],
                series: {
                    radius: ['30%', '70%'],
                    center: ['50%', '40%'],
                    type: 'sunburst',
                    sort: null,
                    highlightPolicy: 'none',
                    nodeClick:false,
                    data: [{
                        name: '行为预警',
                        value: 8,
                        children: [{
                            name: '未处理',
                            value: 4,
                        }, {
                            name: '已处理',
                            value: 4
                        }]
                    }, {
                        name: '人员预警',
                        value: 4,
                        children: [{
                            name: '未处理',
                            value: 4
                        }]
                    }, {
                        name: '传感预警',
                        value: 4,
                        children: [{
                            name: '未处理',
                            value: 2,
                        }, {
                            name: '已处理',
                            value: 2,
                        }]
                    }, {
                        name: '事件预警',
                        value: 3,
                        children: [{
                            name: '未处理',
                            value: 2
                        }, {
                            name: '已处理',
                            value: 1
                        }]
                    }],
                    label: {
                        color: '#333',
                        formatter: function (param) {
                            var depth = param.treePathInfo.length;
                            if (depth === 2) {
                                return param.name;
                            }
                            else if (depth === 3) {
                                return param.name + "：" + param.value;
                            }
                        }
                    },
                    levels: [{}, {
                        label: {
                            rotate: 'tangential'
                        }
                    }, {
                        label: {
                            position: "outside",
                            rotate: 0
                        }
                    }]
                }
            };
            this.chart.setOption(option);
        }
    }
}
</script>

<style lang="scss" scoped>
.chartBox {
    height: 100%;
    position: relative;
    .legends{
        position: absolute;
        top: 75%;
        left: 50%;
        transform: translateX(-50%);
    }
    .legends {
        font-size: 14px;
        color: #333;
        display: flex;
        flex-wrap: wrap;
        width: 300px;
        justify-content: space-around;
        .legend {
            display: flex;
            align-items: center;
            height: 26px;
        }
        .colorBox,
        .text {
            display: inline-block;
        }
        .colorBox {
            width: 10px;
            height: 10px;
            margin-right: 10px;
            border-radius: 100%;
        }
    }
}
</style>
