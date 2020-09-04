<template>
    <div class="page-container feature-collect">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="conditionBox" v-if="jurisdictionType == '2'">
                    <span class="filterTit">年级：</span>
                    <el-select
                        size="small"
                        v-model="searchForm.grade"
                        class="w150"
                        clearable
                        @change="getClassList"
                    >
                        <el-option
                            v-for="(item, index) in gradeList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '2'">
                    <span class="filterTit">班级：</span>
                    <el-select
                        size="small"
                        v-model="searchForm.class"
                        class="w150"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in classList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '2'">
                    <span class="filterTit">学生姓名：</span>
                    <el-input
                        size="small"
                        class="w150"
                        v-model="searchForm.name"
                    ></el-input>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '1'">
                    <span class="filterTit">部门：</span>
                    <el-select
                        size="small"
                        v-model="searchForm.bm"
                        class="w150"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in bmList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '1'">
                    <span class="filterTit">教师姓名：</span>
                    <el-input
                        size="small"
                        class="w150"
                        v-model="searchForm.name"
                    ></el-input>
                </div>
                <el-button size="small" type="primary" @click="clickSearch"
                    >搜索</el-button
                >
                <el-button size="small" type="primary" @click="clickReset"
                    >重置</el-button
                >
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft">
                    <div class="echart-filters u-flex_row">
                        <el-select
                            size="small"
                            v-model="valuechart"
                            class="w200"
                            placeholder="请选择年级"
                            @change="getFaceStatistics"
                            clearable
                            v-if="jurisdictionType == '2'"
                        >
                            <el-option
                                v-for="(item, index) in gradeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="u-chartBox">
                        <div class="u-chart" id="chartsObj"></div>
                    </div>
                </div>
                <div class="m_GenRight u-flex">
                    <!-- <el-button type="primary">导出</el-button> -->
                    <el-alert
                        class="tipsAlert"
                        :closable="false"
                        title="注：请手机端人脸录入，以下表统计"
                        type="info"
                    ></el-alert>
                    <div class="statistics">
                        总人数：{{ statistics.userCount }} 人 已录入数：{{
                            statistics.inputUserCount
                        }}
                        人 未录入数：{{ statistics.notInputUserCount }} 人
                    </div>
                    <el-table height="460" :data="tableData">
                        <el-table-column
                            :label="jurisdictionType == 1 ? '部门' : '班级'"
                            prop="classOrDeptName"
                        ></el-table-column>
                        <el-table-column
                            :label="
                                jurisdictionType == 1 ? '老师姓名' : '学生姓名'
                            "
                            prop="name"
                        ></el-table-column>
                        <el-table-column
                            label="人脸状态"
                            prop="faceUrl"
                            :formatter="stateFormat"
                        ></el-table-column>
                        <el-table-column label="人脸照片">
                            <template slot-scope="scope">
                                <img
                                    class="image"
                                    :src="scope.row.faceUrl"
                                    alt=""
                                    srcset=""
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="pageSize"
                        layout=" sizes, prev, pager, next, jumper"
                        :total="pageTotal"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import * as api from "@/api/index.js";

export default {
    data () {
        return {
            jurisdictionType: '1',              //教师1  学生2
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            gradeList: [],
            classList: [],
            bmList: [],
            nameList: [],
            searchForm: {
                date: [new Date(), new Date()],
                grade: "",
                class: "",
                name: "",
                bm: '',
            },
            statisticsList: [],
            statistics: {},
            valuechart: "",
            tableData: [],
            pageIndex: 1,               //页码
            pageSize: 10,
            pageTotal: 1,
            chartsData: {},
        }
    },
    created () {
        this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2'
        if (this.jurisdictionType == '1') {
            this.chartsData = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                },
                series: {
                    name: '教师采集',
                    type: 'pie',
                    radius: '70%',
                    emphasis: {
                        label: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    label: {
                        formatter: '{b}: {c}'
                    },
                    color: ['#9677EE', '#F9C076'],
                    data: []
                }
            }
            this.getDepartmentList()
        } else {
            this.chartsData = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
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
                    }, {
                        name: '未采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#F9C076',
                    },
                ]
            }
            this.getGradeList()
            this.getClassList()
        }
    },
    mounted () {
        echarts.init(document.getElementById('chartsObj')).dispose();
        this.getFaceStatistics()               //饼图统计
        this.getFaceList()
    },
    methods: {
        async getGradeList () {
            var data = {
                schoolCode: this.schoolCode
            }
            var res = await api.getGradeList(data);
            this.gradeList = res.value ? res.value : []
        },
        async getClassList () {
            var data = {
                gradeCode: this.searchForm.grade,
                schoolCode: this.schoolCode,
                schoolYear: window.localStorage.getItem("xueNian"),
                term: window.localStorage.getItem("xueQi")
            }
            var res = await api.getClassList(data);
            this.classList = res.value ? res.value : [];
            this.searchForm.class = ""
        },
        async getDepartmentList () {
            var data = {
                schoolCode: this.schoolCode,
            }
            var res = await api.getDepartmentList(data);
            this.bmList = res.value ? res.value : []
        },
        // 统计
        async getFaceStatistics () {
            var data = {
                schoolCode: this.schoolCode,
                userId: this.userId,
            }
            this.statisticsList = []
            if (this.jurisdictionType == '1') {
                var res = await api.getTeacherFaceStatistics(data);
                this.statisticsList = res.value ? this.statisticsList.concat(res.value) : []
            } else {
                data.gradeCode = this.valuechart
                if (!this.valuechart) var res = await api.getStudentFaceStatisticsTreeGrade(data);
                else var res = await api.getStudentFaceStatisticsTreeClass(data);
                this.statisticsList = res.value ? res.value : []

            }
            let charts = echarts.init(document.getElementById('chartsObj'));
            charts.clear()
            if (this.statisticsList.length > 0) {
                var nameList = this.statisticsList.map(({ name }) => name);
                var collectUserCount = this.statisticsList.map(({ collectUserCount }) => collectUserCount);
                var unCollectUserCount = this.statisticsList.map(({ unCollectUserCount }) => unCollectUserCount);
                if (this.jurisdictionType == '1') {
                    var chartsData = [{
                        value: collectUserCount[0],
                        name: '已采集',
                    }, {
                        value: unCollectUserCount[0],
                        name: '未采集',
                    }]
                    this.chartsData.series.data = chartsData
                } else {
                    this.chartsData.xAxis.data = nameList
                    this.chartsData.series[0].data = collectUserCount
                    this.chartsData.series[1].data = unCollectUserCount
                }
                charts.hideLoading()
                charts.setOption(this.chartsData);
            } else {
                charts.showLoading({
                    text: '暂无数据',
                    color: '#ffffff',
                    textColor: '#8a8e91',
                    maskColor: 'rgba(255, 255, 255, 0.8)',
                })
            }
        },
        async getFaceList () {
            var data = {
                name: this.searchForm.name,
                schoolCode: this.schoolCode,
                userId: this.userId,
                p: this.pageIndex,
                ps: this.pageSize
            }
            if (this.jurisdictionType == '1') {
                data.departCode = this.searchForm.bm
                var res = await api.getTeacherFaceList(data);
            } else {
                data.classCode = this.searchForm.class
                data.gradeCode = this.searchForm.grade
                var res = await api.getStudentFaceList(data);
            }
            this.statistics = res.value
            if (!this.statistics) return false;
            this.pageIndex = this.statistics.data.currentPage
            this.pageTotal = this.statistics.data.totalCount
            this.tableData = this.statistics.data.dataList ? this.statistics.data.dataList : []
        },

        // 重置
        clickReset () {
            this.searchForm = {
                grade: "",
                class: "",
                name: "",
                bm: '',
            }
        },
        // 搜索
        clickSearch () {
            this.getFaceList()
        },
        stateFormat (row, column) {
            if (row.faceUrl) {
                return <span>已录入</span>
            } else {
                return <span class="red">未录入</span>
            }
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.getFaceList()
        },
        handleCurrentChange (val) {
            this.pageIndex = val
            this.getFaceList()

        },
    }
}
</script>
<style scoped>
.image {
    width: 50px;
}
</style>
