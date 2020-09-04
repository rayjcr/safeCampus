<template>
    <div class="page-container RFID-card">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div
                    class="filters-wapper u-flex_row"
                    v-if="jurisdictionType == '1'"
                >
                    <div class="conditionBox">
                        <span class="filterTit">部门：</span>
                        <el-select
                            v-model="filters.departmentCode"
                            class="w200"
                            size="small"
                            clearable
                            placeholder="请选择部门"
                        >
                            <el-option
                                v-for="(item, index) in departmentList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">教师姓名：</span>
                        <el-input
                            class="w150"
                            size="small"
                            v-model="filters.keywords"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div
                    class="filters-wapper u-flex_row"
                    v-if="jurisdictionType == '2'"
                >
                    <div class="conditionBox">
                        <span class="filterTit">年级：</span>
                        <el-select
                            v-model="filters.gradeCode"
                            class="w200"
                            size="small"
                            clearable
                            placeholder="请选择年级"
                            @change="getClass"
                        >
                            <el-option
                                v-for="(item, index) in gradeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">班级：</span>
                        <el-select
                            v-model="filters.classCode"
                            class="w200"
                            size="small"
                            clearable
                            placeholder="请选择班级"
                        >
                            <el-option
                                v-for="(item, index) in classList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">学生姓名：</span>
                        <el-input
                            class="w150"
                            size="small"
                            v-model="filters.keywords"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div class="filtersBtn">
                    <el-button type="primary" size="small" @click="getList"
                        >查 询</el-button
                    >
                    <el-button type="primary" size="small" @click="resetFilters"
                        >重 置</el-button
                    >
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft">
                    <div
                        class="echartContent fl"
                        v-if="jurisdictionType == '1'"
                    >
                        <div class="echart-filters u-flex_row">
                            <div class="fr">
                                <el-select
                                    class="fr w150"
                                    size="small"
                                    style="background: #fff;"
                                    v-model="echartsDepCode"
                                    placeholder="请选择部门"
                                    @change="getEcharts(echartsDepCode)"
                                >
                                    <el-option
                                        v-for="(item, index) in departmentList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="chartBox">
                            <div class="u-chart" id="chartsObj_RFOD"></div>
                        </div>
                    </div>

                    <div
                        class="echartContent fl"
                        v-if="jurisdictionType == '2'"
                    >
                        <div class="echart-filters u-flex_row">
                            <div class="fr">
                                <el-select
                                    class="fr w150"
                                    size="small"
                                    style="background: #fff;"
                                    v-model="echartsGradeCode"
                                    placeholder="请选择年级"
                                    @change="getEchartsClass(echartsGradeCode)"
                                >
                                    <el-option
                                        v-for="(item, index) in gradeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="chartBox">
                            <div id="chartsObj_RFOD"></div>
                        </div>
                    </div>
                </div>
                <div class="m_GenRight u-flex">
                    <div class="w100per">
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            @click="exportPage"
                            >导出</el-button
                        >
                        <div class="pl20 ofh">
                            <div class="statistics">
                                <span>总人数：{{ collectList.allNum }} 人</span>
                                <span
                                    >已录入数：{{
                                        collectList.collectedNum
                                    }}
                                    人</span
                                >
                                <span
                                    >未录入数：{{
                                        collectList.unCollectedNum
                                    }}
                                    人</span
                                >
                            </div>
                        </div>
                    </div>
                    <el-alert
                        class="tipsAlert"
                        :closable="false"
                        title="注：请手机端人脸录入，以下表统计"
                        type="info"
                    ></el-alert>

                    <el-table
                        height="460"
                        :data="tableData"
                        v-if="jurisdictionType == '1'"
                    >
                        <el-table-column label="部门" prop="departmentName">
                        </el-table-column>
                        <el-table-column label="教师姓名" prop="teacherName">
                        </el-table-column>
                        <el-table-column
                            label="卡号录入状态"
                            prop="collected"
                            :formatter="stateFormat"
                        >
                        </el-table-column>
                        <el-table-column label="卡号" prop="cardStr">
                        </el-table-column>
                    </el-table>
                    <el-table
                        height="460"
                        :data="tableData"
                        v-if="jurisdictionType == '2'"
                    >
                        <el-table-column label="班级" prop="className">
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="studentName">
                        </el-table-column>
                        <el-table-column
                            label="卡号录入状态"
                            prop="collected"
                            :formatter="stateFormat"
                        >
                        </el-table-column>
                        <el-table-column label="卡号" prop="cardStr">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryPagination.pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="queryPagination.pageSize"
                        layout=" sizes, prev, pager, next, jumper"
                        :total="queryPagination.pageTotal"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as api from "@/api/index.js";
import echarts from 'echarts';
export default {
    data () {
        return {
            jurisdictionType: '1',              //教师1  学生2
            schoolCode: localStorage.schoolCode,    // 学校代码
            schoolYear: localStorage.xueNian,    // 学年
            term: localStorage.xueQi,    // 学期
            filters: {
                departmentCode: "",  // 部门
                gradeCode: "",    // 年级
                classCode: "",    // 班级
                keywords: "",    // 姓名
            },
            departmentList: [],   // 部门列表
            gradeList: [],   // 年级列表
            classList: [],   // 班级列表
            collectList: {   // 采集人数展示
                allNum: "",
                collectedNum: "",
                unCollectedNum: "",
            },
            tableData: [],
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            echartsDepCode: "",      // 图表选择部门
            echartsGradeCode: "",     // 图表选择年级 
            teacherChartsData: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                dataZoom: [　　　　　　　　　　//X轴滑动条
                    {
                        type: 'slider', //滑动条
                        show: false,      //开启
                        xAxisIndex: [0],
                        left: '0%',  //滑动条位置
                        start: 0,    //初始化时，滑动条宽度开始标度
                        end: 35,     //初始化时，滑动条宽度结束标度
                        zoomLock: true,  // 不可缩放
                        left: 25,
                        bottom: -15,
                        borderColor: '#f2f2f2',
                        showDetail: false,  // 拖拽时的文字显示
                        handleStyle: {    // 手柄样式
                            color: ''
                        },
                    },
                    {
                        type: 'inside',  //内置滑动，随鼠标滚轮展示
                        xAxisIndex: [0],
                        start: 0,//初始化时，滑动条宽度开始标度
                        end: 40  //初始化时，滑动条宽度结束标度
                    }
                ],
                legend: {
                    icon: 'circle',
                    itemWidth: 10, //修改icon图形大小
                    right: 0,
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
                    left: 12,
                    right: 40,
                    bottom: 20,
                    containLabel: true
                },
                xAxis: [{
                    name: '',
                    type: 'category',
                    data: [],
                    axisLabel: {
                        interval: 0,
                        margin: 10,
                        algin: 'center',
                        formatter: function (value) {
                            var xAxisName = "";
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
                                    xAxisName += tempStr;
                                }
                            } else {
                                xAxisName = value;
                            };
                            return xAxisName
                        },
                    },
                    axisLine: {
                        show: true,   // 坐标轴是否显示
                        lineStyle: {
                            height: '1px',
                            color: '#000',
                            opacity: 0.2,
                        },
                    },
                    axisTick: {
                        show: false,   // 坐标轴上的刻度是否显示
                    }
                }],
                yAxis: [{
                    name: '人数',
                    nameGap: 20,
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#000',  //坐标轴的颜色
                            opacity: 0.2,
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000',  //坐标值得具体的颜色
                        }
                    },
                    axisTick: {
                        show: true,   // 坐标轴上的刻度是否显示
                        lineStyle: {
                            color: '#000',  //坐标轴的颜色
                            opacity: 0.2,
                        }
                    },
                    splitLine: {
                        show: true   // 是否显示分隔线
                    }
                }],
                series: [
                    {
                        name: '已采集',
                        type: 'bar',
                        stack: '采集',
                        barWidth: 15,
                        color: '#54ABFF',
                        label: { show: false },
                        data: []
                    },
                    {
                        name: '未采集',
                        type: 'bar',
                        stack: '采集',
                        barWidth: 15,
                        color: '#F9C076',
                        label: { show: false },
                        data: []
                    },
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
                    right: 0,
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
                    left: 12,
                    right: 40,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: [{
                    name: '',
                    type: 'category',
                    data: [],
                    axisLabel: {
                        interval: 0,
                        margin: 10,
                        algin: 'right',
                        formatter: function (value) {
                            var xAxisName = "";
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
                                    xAxisName += tempStr;
                                }
                            } else {
                                xAxisName = value;
                            };
                            return xAxisName
                        },
                    },
                    axisLine: {
                        show: true,   // 坐标轴是否显示
                        lineStyle: {
                            height: '1px',
                            color: '#000',
                            opacity: 0.2,
                        },
                    },
                    axisTick: {
                        show: false,   // 坐标轴上的刻度是否显示
                    }
                }],
                yAxis: [{
                    name: '人数',
                    nameGap: 20,
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#000',  //坐标轴的颜色
                            opacity: 0.2,
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000',  //坐标值得具体的颜色
                        }
                    },
                    axisTick: {
                        show: true,   // 坐标轴上的刻度是否显示
                        lineStyle: {
                            color: '#000',  //坐标轴的颜色
                            opacity: 0.2,
                        }
                    },
                    splitLine: {
                        show: true   // 是否显示分隔线
                    }
                }],
                series: [
                    {
                        name: '已采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#54ABFF',
                        label: { show: false },
                        data: []
                    },
                    {
                        name: '未采集',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#F9C076',
                        label: { show: false },
                        data: []
                    },
                ]
            },
        }
    },
    watch: {},
    created () {
        this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2'
        if (this.jurisdictionType == '1') {
            this.getDepartment();
        } else {
            this.getGrade();
            this.getClass();
        }
    },
    mounted () {
        this.getList();
        if (this.jurisdictionType === '1') {
            let teacherCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
            teacherCharts.setOption(this.teacherChartsData);
            this.getEcharts();
        } else if (this.jurisdictionType === '2') {
            let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
            studentCharts.setOption(this.studentChartsData);
            this.getEcharts();
        };
    },
    methods: {
        // 过滤传参
        dealObjectValue (cardList) {
            for (var key in cardList) {
                if (cardList[key] == null || cardList[key] == undefined || cardList[key] === "") {
                    delete cardList[key]
                }
            }
            return cardList;
        },
        // 获取列表数据
        getList () {
            this.getNumber();
            var newFilters = _.cloneDeep(this.filters)
            var filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.pageIndex = this.queryPagination.pageIndex;
            filtersObj.pageSize = this.queryPagination.pageSize;
            if (this.jurisdictionType === '1') {
                api.getRFIDTeacherList(filtersObj).then(res => {
                    this.queryPagination.countTotal = res.value.totalCount;
                    let table = res.value.dataList;
                    if (table) {
                        table.map(item => {
                            let cardStr = "";
                            let cardList = [item.cardNo1, item.cardNo2, item.cardNo3, item.cardNo4];
                            cardList.filter(item => {
                                if (item !== null && item !== "") {
                                    cardStr = item += ","
                                }
                                return cardStr
                            });
                            item.cardStr = cardStr
                            return table
                        })
                    }
                    this.tableData = table;
                });
            } else if (this.jurisdictionType === '2') {
                api.getRFIDStudentList(filtersObj).then(res => {
                    let table = res.value.dataList;
                    if (table) {
                        table.map(item => {
                            let cardStr = "";
                            let cardList = [item.cardNo1, item.cardNo2, item.cardNo3, item.cardNo4];
                            cardList.filter(item => {
                                if (item !== null && item !== "") {
                                    cardStr = item += " "
                                }
                                return cardStr
                            });
                            item.cardStr = cardStr
                            return table
                        })
                    }
                    this.tableData = table;
                });
            }
        },
        // 获取采集数量
        getNumber () {
            this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2';
            var newFilters = _.cloneDeep(this.filters)
            var filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            if (this.jurisdictionType === '1') {
                api.getRFIDTeacherNum(filtersObj).then(res => {
                    this.collectList.allNum = res.value.totalNumber;
                    this.collectList.collectedNum = res.value.enterNumber;
                    this.collectList.unCollectedNum = res.value.notEnterNumber;
                });
            };
            if (this.jurisdictionType === '2') {
                api.getRFIDStudentNum(filtersObj).then(res => {
                    this.collectList.allNum = res.value.totalNumber;
                    this.collectList.collectedNum = res.value.enterNumber;
                    this.collectList.unCollectedNum = res.value.notEnterNumber;
                });
            }
        },
        // 获取Filters部门
        getDepartment () {
            api.getDepartmentTreeList({ schoolCode: this.schoolCode }).then(res => {
                let departmentList = [];
                res.value.map(item => {
                    departmentList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                departmentList.unshift({ value: null, label: '全部' });
                this.departmentList = departmentList;

            });
        },
        // 获取Filters年级
        getGrade () {
            api.getGradeList({ schoolCode: this.schoolCode }).then(res => {
                let gradeList = [];
                res.value.map(item => {
                    gradeList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                gradeList.unshift({ value: null, label: '全部' });
                this.gradeList = gradeList;
            });
        },
        // 获取Filters班级
        getClass () {
            api.getClassList({
                gradeCode: this.filters.gradeCode,
                schoolCode: this.schoolCode,
                schoolYear: this.schoolYear,
                term: this.term,
            }).then(res => {
                let classList = [];
                res.value.map(item => {
                    classList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                classList.unshift({ value: null, label: '全部' });
                this.classList = classList;
            });
        },
        // 获取图表采集数据
        getEcharts (selectVal) {
            if (this.jurisdictionType === '1') {
                var depObj = {};
                depObj.schoolCode = this.schoolCode;
                if (selectVal !== null || selectVal !== "") {
                    depObj.departmentCode = this.echartsDepCode;
                };
                api.getRFIDTeacherDepartment(depObj).then(res => {
                    var json = res.value.data;
                    var depName = [];
                    var collected = [];
                    var uncolleded = [];
                    json.map(item => {
                        depName.push({
                            value: item.departmentName,
                        });
                        collected.push({
                            value: item.enterNumber,
                        })
                        uncolleded.push({
                            value: item.notEnterNumber,
                        })
                        return item
                    })
                    // 是否显示滑动条
                    if (depName.length > 9) {
                        this.teacherChartsData.dataZoom[0].show = true;
                    } else {
                        this.teacherChartsData.dataZoom[0].show = false;
                    }
                    this.teacherChartsData.xAxis[0].name = "部门";
                    this.teacherChartsData.xAxis[0].data = depName;
                    this.teacherChartsData.series[0].data = collected;
                    this.teacherChartsData.series[1].data = uncolleded;
                    let teacherCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                    teacherCharts.setOption(this.teacherChartsData);
                })
            } else if (this.jurisdictionType === '2') {
                api.getRFIDStudentGrade({ schoolCode: this.schoolCode }).then(res => {
                    var json = res.value.data;
                    var gradeName = [];
                    var collected = [];
                    var uncolleded = [];
                    json.map(item => {
                        gradeName.push({
                            value: item.gradeName,
                        });
                        collected.push({
                            value: item.enterNumber,
                        })
                        uncolleded.push({
                            value: item.notEnterNumber,
                        })
                        return item
                    })
                    this.studentChartsData.xAxis[0].name = "年级";
                    this.studentChartsData.xAxis[0].data = gradeName;
                    this.studentChartsData.series[0].data = collected;
                    this.studentChartsData.series[1].data = uncolleded;
                    let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                    studentCharts.setOption(this.studentChartsData);
                })
            }

        },
        // 获取图表班级采集数据
        getEchartsClass (grade) {
            if (grade == null) {
                let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                studentCharts.setOption(this.studentChartsData);
                this.getEcharts();
            } else {
                api.getRFIDStudentClass({
                    schoolCode: this.schoolCode,
                    gradeCode: grade,
                }).then(res => {
                    var json = res.value.data;
                    var className = [];
                    var collected = [];
                    var uncolleded = [];
                    json.map(item => {
                        className.push({
                            value: item.className,
                        });
                        collected.push({
                            value: item.enterNumber,
                        })
                        uncolleded.push({
                            value: item.notEnterNumber,
                        })
                        return item
                    })
                    this.studentChartsData.xAxis[0].name = "班级";
                    this.studentChartsData.xAxis[0].data = className;
                    this.studentChartsData.series[0].data = collected;
                    this.studentChartsData.series[1].data = uncolleded;
                    let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                    studentCharts.setOption(this.studentChartsData);
                })

            }
        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                departmentCode: "",
                gradeCode: "",
                classCode: "",
                keywords: "",
            },
                this.getList();
        },
        // 导出页面数据
        exportPage () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            if (this.jurisdictionType === '1') {
                api.exportRFIDTeacher(filtersObj).then(res => {
                    const link = document.createElement('a')
                    let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    link.download = '教师卡片采集' + '.xls'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }).catch(error => {
                    console.log(error)
                })
            } else if (this.jurisdictionType === '2') {
                api.exportRFIDStudent(filtersObj).then(res => {
                    const link = document.createElement('a')
                    let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    link.download = '学生卡片采集' + '.xls'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }).catch(error => {
                    console.log(error)
                })
            }
        },
        // 卡号录入状态
        stateFormat (row, column) {
            if (row.faceUrl) {
                return <span>已录入</span>
            } else {
                return <span class="red">未录入</span>
            }
        },
        // 选择表格每页数量
        handleSizeChange (val) {
            this.queryPagination.pageSize = val;
            this.getList();
        },
        // 选择第几页
        handleCurrentChange (val) {
            this.queryPagination.pageIndex = val;
            this.getList();
        },
    }
}
</script>
<style lang='scss' scoped>
.m_GenLeft {
    width: 600px;
    height: 530px;
    padding-right: 20px;

    .chartBox {
        width: 100%;
        height: 450px;
        float: left;
        margin-top: 10px;
        > div {
            width: 98%;
            height: 98%;
            margin: 0 auto;
            position: relative;
        }
    }
}

.echartContent {
    width: 100%;
    background: #f2f2f2;
    border-radius: 15px;
    padding: 15px;
}
</style>

<style lang="scss">
.RFID-card {
    .filter-container {
        padding: 5px 15px 15px;
        position: relative;

        .filters-wapper {
            flex-wrap: wrap;
            align-items: center;
        }
    }

    .echart-filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .m_GenTableBox {
        .m_GenRight {
            .statistics {
                font-size: 14px;
                line-height: 32px;
                padding: 0 16px;
                background: #e6f7ff;
                border: 1px solid #bae7ff;
                color: #333;
                overflow: hidden;
                border-radius: 5px;

                span {
                    margin-right: 20px;
                }
            }

            .el-alert__content {
                padding: 0;
                font-weight: bold;
            }
        }
    }
}
</style>
