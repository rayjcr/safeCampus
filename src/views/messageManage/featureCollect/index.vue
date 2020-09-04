<template>
    <div class="page-container feature-collect">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="conditionBox">
                    <span class="filterTit">日期：</span>
                    <el-date-picker v-model="valDate" type="date"></el-date-picker>
                </div>
                <div class="conditionBox">
                    <span class="filterTit">年级：</span>
                    <el-select v-model="valGrade" class="w150" clearable>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="conditionBox">
                    <span class="filterTit">班级：</span>
                    <el-select v-model="valClass" class="w150" clearable>
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="conditionBox" v-if="jurisdictionType == '2'">
                    <span class="filterTit">学生姓名：</span>
                    <el-input class="w150"></el-input>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '1'">
                    <span class="filterTit">教师姓名：</span>
                    <el-input class="w150"></el-input>
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft">
                    <div class="echart-filters u-flex_row">
                        <div class="typeTabs">
                            <el-radio-group v-model="jurisdictionType">
                                <el-radio-button label="1">老师</el-radio-button>
                                <el-radio-button label="2">学生</el-radio-button>
                            </el-radio-group>
                        </div>
                        <el-select class="w200" v-model="valuechart" placeholder="请选择年级">
                            <el-option value="1">一年级</el-option>
                            <el-option value="2">二年级</el-option>
                        </el-select>
                    </div>
                    <div class="u-chartBox">
                        <div class="u-chart" id="chartsObj_FEATURE"></div>
                    </div>
                </div>
                <div class="m_GenRight u-flex cusMiniScroll">
                    <el-button type="primary">导出</el-button>
                    <el-alert class="tipsAlert" :closable="false" title="注：请手机端人脸录入，以下表统计" type="info"></el-alert>
                    <div class="statistics">
                        总人数：875 人 已录入数：589 人 未录入数：286 人
                    </div>
                    <el-table class="tableBorder" height="460" :data="tableData">
                        <el-table-column label="班级" prop="class"></el-table-column>
                        <el-table-column label="学生姓名" prop="name"></el-table-column>
                        <el-table-column label="人脸状态" prop="states"></el-table-column>
                        <el-table-column label="人脸照片" prop="photo"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data () {
        return {
            jurisdictionType: '1',
            valDate: "",
            valGrade: "",
            valClass: "",
            gradeList: [
                { name: "一年级", id: 1 },
                { name: "二年级", id: 2 }
            ],
            classList: [
                { name: "（1）班", id: 1 },
                { name: "（2）班", id: 2 }],
            valuechart: "",
            tableData: [
                { class: "一（1）班", name: "张三", states: "已录入", photo: "" },
                { class: "一（1）班", name: "张三", states: "已录入", photo: "" },
                { class: "一（1）班", name: "张三", states: "已录入", photo: "" },
            ],
            teacherChartsData: {
                title: {
                    zlevel: 0,
                    text: ['总人数', 135 + '人'].join('\n'),
                    x: 'center',
                    y: 'center',
                    left: '193',
                    textAlign: 'center',
                    textStyle: {
                        color: '#444444',
                        fontSize: 20,
                        fontWeight: 'bold',
                        lineHeight: 35,
                    },
                },
                tooltip: {
                    trigger: 'item',
                    show: true,
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    show: true,
                    top: 10,
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 400,
                        lineHeight: '16',
                        color: '#333',
                        opacity: 1,
                    },
                },
                series: [
                    {
                        name: '教师采集',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        top: 0,
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'inner'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: 150,
                                name: '已采集',
                                itemStyle: {
                                    color: '#9677EE'
                                }
                            },
                            {
                                value: 10,
                                name: '未采集',
                                itemStyle: {
                                    color: '#F9C076',
                                }
                            },
                        ]
                    }
                ]
            },
            studentChartsData: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 400,
                        lineHeight: '16',
                        color: '#333',
                        opacity: 1,
                    },
                    data: ['已采集', '未采集']
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['一年级', '二年级', '三年级']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '已采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#54ABFF',
                        data: [320, 332, 301, 334, 390, 330, 320],
                    },
                    {
                        name: '未采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#F9C076',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            dialogVisible: false
        }
    },
    watch: {
        jurisdictionType (val) {
            let teacherCharts = echarts.init(document.getElementById('chartsObj_FEATURE'));
            teacherCharts.clear()
            if (val == "1") {
                teacherCharts.setOption(this.teacherChartsData);
            } else {
                teacherCharts.setOption(this.studentChartsData);
            }
        }
    },
    mounted () {
        let teacherCharts = echarts.init(document.getElementById('chartsObj_FEATURE'));
        teacherCharts.setOption(this.teacherChartsData);
    },
    methods: {
        getList () {

        },
    }
}
</script>
<style lang='scss' scoped>

</style>

