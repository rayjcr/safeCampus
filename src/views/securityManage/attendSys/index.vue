<template>
    <div class="page-container attend-page">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="conditionBox">
                    <span class="filterTit">日期：</span>
                    <el-date-picker
                        size="small"
                        :clearable="false"
                        v-model="searchForm.date"
                        type="date"
                        placeholder="选择日期"
                    ></el-date-picker>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '1'">
                    <span class="filterTit">部门：</span>
                    <el-cascader
                        size="small"
                        class="w150"
                        v-model="searchForm.deptCode"
                        :options="bmList"
                        :props="defaultProps"
                        clearable
                    ></el-cascader>
                </div>
                <div class="conditionBox" v-if="jurisdictionType == '2'">
                    <span class="filterTit">年级：</span>
                    <el-select
                        size="small"
                        class="w150"
                        v-model="searchForm.grade"
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
                        class="w150"
                        v-model="searchForm.class"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in classList"
                            :key="index"
                            :label="item.name"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </div>
                <div class="conditionBox">
                    <span class="filterTit">姓名：</span>
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
                            class="w200"
                            v-model="valuechart"
                            @change="getStatistics"
                            v-if="jurisdictionType == '1'"
                        >
                            <el-option
                                v-for="(item, index) in timeperiod"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>

                        <el-select
                            size="small"
                            class="w150"
                            placeholder="请选择年级"
                            v-model="valuechart_grade"
                            clearable
                            @change="getStatistics"
                            v-if="jurisdictionType == '2'"
                        >
                            <el-option
                                v-for="(item, index) in gradeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                        <el-select
                            size="small"
                            class="w150"
                            placeholder="请选择考勤类型"
                            v-model="valuechart"
                            @change="getStatistics"
                            v-if="jurisdictionType == '2'"
                        >
                            <el-option
                                v-for="(item, index) in timeperiod"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="u-chartBox">
                        <div class="u-chart" id="chartsObj"></div>
                    </div>
                </div>
                <div class="m_GenRight u-flex">
                    <div class="tableBtn">
                        <el-button size="small" type="primary" @click="clickSetWarning">预警设置</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            @click="downExcel"
                            >导出</el-button
                        >
                    </div>

                    <el-table height="540" :data="tableData">
                        <el-table-column
                            label="日期"
                            prop="date"
                            width="100"
                        ></el-table-column>
                        <el-table-column
                            :label="
                                jurisdictionType == 1 ? '教师姓名' : '学生姓名'
                            "
                            prop="userName"
                        ></el-table-column>
                        <el-table-column
                            :label="jurisdictionType == 1 ? '部门' : '班级'"
                            prop="classOrDeptName"
                        ></el-table-column>
                        <el-table-column
                            label="考勤类型"
                            prop="periodName"
                        ></el-table-column>
                        <el-table-column
                            label="考勤时间"
                            prop="time"
                        ></el-table-column>
                        <el-table-column
                            label="考勤状态"
                            prop="state"
                            :formatter="stateFormat"
                        ></el-table-column>
                        <el-table-column
                            label="考勤设备"
                            prop="mathineName"
                        ></el-table-column>
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
        <el-dialog title="预警设置" :visible.sync="dialogVisible" width="500px">
            <el-form ref="form" size="small" :model="warnForm" label-width="230px">
                <el-form-item label="各班级迟到率/早退率黄色预警值">
                    <el-input class="w150" v-model="warnForm.totalParkingPlace"></el-input> %
                </el-form-item>
                <el-form-item label="各班级迟到率/早退率红色预警值">
                    <el-input class="w150" v-model="warnForm.warning"></el-input> %
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickSureWarn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import echarts from 'echarts'
import * as api from "@/api/index.js";
import * as securityApi from "@/api/securityApi.js";
import formatDate from "@/utils/formatDate.js";

export default {
    data () {
        return {
            jurisdictionType: '1',              //教师1  学生2
            schoolCode: localStorage.getItem("schoolCode"),
            userId: localStorage.getItem("userId"),
            searchForm: {
                date: formatDate(new Date().getTime(), "yyyy-MM-dd"),
                deptCode: '',
                grade: "",
                class: "",
                name: ''
            },
            bmList: [],
            gradeList: [],
            classList: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'code'
            },
            timeperiod: [],                  //时间段
            cur_period: '',
            valuechart: '',
            valuechart_grade: '',
            chartsData: {},
            tableData: [],
            pageIndex: 1,               //页码
            pageSize: 10,
            pageTotal: 1,
            dialogVisible: false,
            warnForm:{},
        }
    },
    created () {

        this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2'
        if (this.jurisdictionType == '1') {
            this.getDepartmentList()
            this.chartsData = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [{
                    name: '教师总人数',
                    type: 'pie',
                    color: '#fff',
                    radius: ['0', '30%'],
                    label: {
                        position: 'center',
                        color: '#333',
                    },
                    data: []
                }, {
                    name: '考勤',
                    type: 'pie',
                    radius: ['29%', '75%'],
                    label: {
                        position: 'inner',
                        color: '#333',
                    },
                    color: ['#54ABFF', '#5FE9BA', '#9677EE', '#F9C076'],
                    data: []
                }]
            }
        } else {
            this.getGradeList()
            this.getClassList()
            this.chartsData = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
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
            }
        }
        this.getTimeperiod()
    },
    mounted () {
        echarts.init(document.getElementById('chartsObj')).dispose();
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
        async getTimeperiod () {
            var data = {
                schoolCode: this.schoolCode,
            }
            var apiUrl = this.jurisdictionType == '1' ? 'getTimeperiod_teach' : 'getTimeperiod_stu'
            var res = await securityApi[apiUrl](data);
            this.timeperiod = res.value && res.value.length > 0 ? res.value : []
            this.timeperiod.forEach(item => {
                if (item.cur == 1) this.cur_period = item.id
            })
            this.valuechart = this.cur_period
            this.getStatistics()
            this.getList()
        },
        async getStatistics () {
            let charts = echarts.init(document.getElementById('chartsObj'));
            charts.clear()
            var data = {
                schoolCode: this.schoolCode,
                date: this.searchForm.date,
                period: this.valuechart,
                grade: this.valuechart_grade
            }
            var apiUrl = this.jurisdictionType == '1' ? 'getStatistics_teach' :
                (this.valuechart_grade ? 'listClassStatisticsByGrade' : 'listGradeStatisticsBySchool')

            var res = await securityApi[apiUrl](data);
            if (this.jurisdictionType == '1') {
                var statistics = res.value  ? res.value : {}
                var seriesData = [{
                    value: statistics.okCount,
                    name: "到勤",
                }, {
                    value: statistics.lateOrLeaveearlyCount,
                    name: "迟到早退",
                }, {
                    value: statistics.uncardCount,
                    name: "缺勤",
                }, {
                    value: statistics.leaveCount,
                    name: "请假",
                }]
                var val = []
                seriesData.forEach(item => {
                    if(item.value)
                        val.push(item)
                })
                if (val.length < 1) {
                    charts.showLoading({
                        text: '暂无数据',
                        color: '#ffffff',
                        textColor: '#8a8e91',
                        maskColor: 'rgba(255, 255, 255, 0.8)',
                    })
                    return false
                }
                this.chartsData.series[0].data = [{
                    value: statistics.userCount,
                    name: '教师总人数\n' + statistics.userCount,
                }]
                this.chartsData.series[1].data = val
                
            } else {
                var statistics = res.value && res.value.length > 0 ? res.value : []
                if (statistics.length < 1) {
                    charts.showLoading({
                        text: '暂无数据',
                        color: '#ffffff',
                        textColor: '#8a8e91',
                        maskColor: 'rgba(255, 255, 255, 0.8)',
                    })
                    return false
                }
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

                this.chartsData.yAxis[0].data = nameList
                this.chartsData.yAxis[1].data = account
                this.chartsData.series[0].data = okCount
                this.chartsData.series[1].data = lateOrLeaveearlyCount
                this.chartsData.series[2].data = uncardCount
                this.chartsData.series[3].data = leaveCount
            }
            charts.hideLoading()
            charts.setOption(this.chartsData);

        },
        // 获取信息列表
        async getList () {
            var data = {
                ...this.searchForm,
                period: this.cur_period,
                schoolCode: this.schoolCode,
                p: this.pageIndex,
                ps: this.pageSize
            }
            var apiUrl = this.jurisdictionType == '1' ? 'getListPage_teach' : 'getListPage_stu'
            var res = await securityApi[apiUrl](data);
            var statistics = res.value
            this.tableData = []
            if (!statistics) return false;
            this.pageIndex = statistics.currentPage
            this.pageTotal = statistics.totalCount
            this.tableData = statistics.dataList && statistics.dataList.length > 0 ? statistics.dataList : []
        },
        clickSearch () {
            this.getList()
            this.getStatistics()
        },
        clickReset () {
            this.searchForm = {
                date: formatDate(new Date().getTime(), "yyyy-MM-dd"),
                deptCode: '',
                grade: "",
                class: "",
                name: ''
            }
        },
        // 考勤状态
        stateFormat (row, column) {
            if (row.state == 1) {
                return <span>正常</span>
            } else {
                return <span class="red">不正常</span>
            }
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange (val) {
            this.pageIndex = val
            this.getList()

        },
        async downExcel () {
            var data = {
                date: this.searchForm.date,
                period: this.cur_period,
                schoolCode: this.schoolCode
            }

            var apiUrl = this.jurisdictionType == '1' ? 'downExcel_teach' : 'downExcel_stu'
            var res = await securityApi[apiUrl](data)

            if (res.resultCode != 1) {
                this.$message.error(res.resultMessage);
                return false
            }
            const link = document.createElement('a')
            let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = (this.jurisdictionType == '1' ? '教师考勤' : '学生考勤') + '.xls'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
        clickSetWarning(){
            this.dialogVisible = true
        },
        clickSureWarn(){
            // var data = {
            //     ...this.searchForm,
            //     schoolCode: this.schoolCode
            // }
            // var res = await securityApi.setProportion(data);
            // var statistics = res.value
        },
    }
}
</script>