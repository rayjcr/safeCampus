<template>
    <div class="page-container check-temperture">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div
                    class="filters-wapper u-flex_row"
                    v-if="jurisdictionType == '1'"
                >
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker
                            v-model="filters.date"
                            type="date"
                            size="small"
                            clearable
                            placeholder="请选择日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">部门：</span>
                        <el-select
                            v-model="filters.dept"
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
                        <span class="filterTit">检查项目：</span>
                        <el-select
                            v-model="filters.checkId"
                            size="small"
                            clearable
                            placeholder="请选择检测项"
                        >
                            <el-option
                                v-for="(item, index) in checkList"
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
                            size="small"
                            v-model="filters.userName"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div
                    class="filters-wapper u-flex_row"
                    v-if="jurisdictionType == '2'"
                >
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker
                            size="small"
                            v-model="filters.date"
                            type="date"
                            clearable
                            placeholder="请选择日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">年级：</span>
                        <el-select
                            v-model="filters.gradeCode"
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
                        <span class="filterTit">检查项目：</span>
                        <el-select
                            v-model="filters.checkId"
                            size="small"
                            clearable
                            placeholder="请选择检查项"
                        >
                            <el-option
                                v-for="(item, index) in checkList"
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
                            size="small"
                            v-model="filters.userName"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div class="filtersBtn">
                    <el-button
                        type="primary"
                        size="small"
                        @click="
                            getList();
                            getEcharts();
                        "
                        >查 询</el-button
                    >
                    <el-button type="primary" size="small" @click="resetFilters"
                        >重 置</el-button
                    >
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft">
                    <div class="echartContent fl">
                        <div class="echart-filters u-flex_row">
                            <div class="fr">
                                <el-select
                                    v-if="jurisdictionType == '1'"
                                    class="w150"
                                    size="small"
                                    clearable
                                    style="background: #fff;"
                                    v-model="echarts.deptCode"
                                    placeholder="请选择部门"
                                    @change="getEcharts"
                                >
                                    <el-option
                                        v-for="(item, index) in departmentList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                                <el-select
                                    v-if="jurisdictionType == '2'"
                                    class="w150"
                                    size="small"
                                    clearable
                                    style="background: #fff;"
                                    v-model="echarts.gradeCode"
                                    placeholder="请选择年级"
                                    @change="getEcharts"
                                >
                                    <el-option
                                        v-for="(item, index) in gradeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                                <el-select
                                    class="w150"
                                    size="small"
                                    clearable
                                    style="background: #fff;"
                                    v-model="echarts.checkId"
                                    placeholder="请选择检查项"
                                    @change="getEcharts"
                                >
                                    <el-option
                                        v-for="(item, index) in checkList"
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
                            type="primary exportBtn"
                            style="success"
                            size="small"
                            @click="exportPage"
                            >导出</el-button
                        >
                    </div>
                    <el-table
                        height="460"
                        :data="tableData"
                        v-if="jurisdictionType == '1'"
                    >
                        <el-table-column label="日期" prop="date" width="160">
                        </el-table-column>
                        <el-table-column label="教师姓名" prop="userName">
                        </el-table-column>
                        <el-table-column label="部门" prop="deptName">
                        </el-table-column>
                        <el-table-column label="检查项目" prop="checkName">
                        </el-table-column>
                        <el-table-column label="检查时间" prop="checkTime">
                        </el-table-column>
                        <el-table-column label="体温" prop="temperature">
                        </el-table-column>
                        <el-table-column
                            label="健康状态"
                            prop="healthDec"
                            :formatter="stateFormat"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="150" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="openDialog(scope.row, '1')"
                                    >复检</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="
                                        openDrawer(
                                            scope.row.id,
                                            scope.row.userid,
                                            '1'
                                        )
                                    "
                                    >详情</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        height="460"
                        :data="tableData"
                        v-if="jurisdictionType == '2'"
                    >
                        <el-table-column label="日期" prop="date" width="160">
                        </el-table-column>
                        <el-table-column label="学生姓名" prop="userName">
                        </el-table-column>
                        <el-table-column label="班级" prop="className">
                        </el-table-column>
                        <el-table-column label="检查项目" prop="checkName">
                        </el-table-column>
                        <el-table-column label="检查时间" prop="checkTime">
                        </el-table-column>
                        <el-table-column label="体温" prop="temperature">
                        </el-table-column>
                        <el-table-column
                            label="健康状态"
                            prop="healthDec"
                            :formatter="stateFormat"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="150" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="openDialog(scope.row, '2')"
                                    >复检</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="
                                        openDrawer(
                                            scope.row.id,
                                            scope.row.userid,
                                            '2'
                                        )
                                    "
                                    >详情</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryPagination.pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="queryPagination.pageSize"
                        :total="queryPagination.countTotal"
                        layout="total, sizes, prev, pager, next, jumper"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <div>
            <Recheck
                :visible.sync="recheckDialog"
                :info="recheckInfo"
                :type="characterType"
                v-on:closeDialog="closeDialog"
            ></Recheck>
        </div>
        <div>
            <TemDetail
                :visible.sync="detailDrawer"
                :id="CheckId"
                :userId="UserId"
                :type="characterType"
                v-on:closeDrawer="closeDrawer"
            ></TemDetail>
        </div>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import echarts from 'echarts';
import Recheck from './recheck';
import TemDetail from './detail';

export default {
    components: {
        Recheck,
        TemDetail
    },
    data () {
        return {
            jurisdictionType: '1',              //教师1  学生2
            schoolCode: localStorage.schoolCode,    // 学校代码            
            schoolYear: localStorage.xueNian,    // 学年
            term: localStorage.xueQi,    // 学期
            userId: localStorage.userId,    // 用户Id
            filters: {
                date: new Date(),  // 日期
                checkId: "",    // 检查项目
                dept: "",  // 部门
                gradeCode: "",    // 年级
                classCode: "",    // 班级
                userName: "",    // 姓名
            },
            checkList: [],   // 检查项目列表
            departmentList: [],   // 部门列表
            gradeList: [],   // 年级列表
            classList: [],   // 班级列表
            tableData: [],
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            echarts: {
                checkId: 20,      // 图表检查项目
                deptCode: "",      // 图表选择部门
                gradeCode: "",     // 图表选择年级 
            },
            characterType: "",       // 人物类型：1：老师，2：学生
            recheckDialog: false,    // 复检
            recheckInfo: {},       // 复检信息
            detailDrawer: false,    // 详情         
            CheckId: 0,   // 检查项的id
            UserId: "",   // 详情的编号
            chartsData: {},
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
        }
    },
    watch: {},
    created () {
        this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2'
        if (this.jurisdictionType == '1') {
            this.getDepartment();
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
                    right: 0,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 400,
                        lineHeight: '16',
                        color: '#333',
                        opacity: 1,
                    },
                    data: ['体温正常', '体温异常']
                },
                grid: {
                    left: 0,
                    right: 40,
                    bottom: 20,
                    containLabel: true
                },
                series: {
                    name: '体温',
                    type: 'pie',
                    radius: '70%',
                    emphasis: {
                        label: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    label: {
                        position: 'inner',
                        color: '#333',
                    },
                    color: ['#9677EE', '#F9C076'],
                    data: [
                        {
                            value: 0,
                            name: '体温正常'
                        },
                        {
                            value: 0,
                            name: '体温异常'
                        }
                    ]
                }
            }
            this.getEcharts();
        } else {
            this.getGrade();
            this.getClass();
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
                    right: 0,
                    textStyle: {
                        fontSize: '12',
                        fontWeight: 400,
                        lineHeight: '16',
                        color: '#333',
                        opacity: 1,
                    },
                    data: ['体温正常', '体温异常']
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
                        name: '体温正常',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#54ABFF',
                        label: { show: false },
                        data: []
                    },
                    {
                        name: '体温异常',
                        type: 'bar',
                        stack: '考勤',
                        barWidth: 15,
                        color: '#F9C076',
                        label: { show: false },
                        data: []
                    },
                ]
            }
            this.getEcharts();
        }
    },
    mounted () {
        echarts.init(document.getElementById('chartsObj_RFOD')).setOption(this.chartsData);
        this.getList();
        this.getCheck();
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
        // 日期格式化
        formatDate (getDate) {
            let year = getDate.getFullYear();
            let month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
            var day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();
            var setDate = year + "-" + month + "-" + day;
            return setDate
        },
        // 获取列表数据
        getList () {
            var newFilters = _.cloneDeep(this.filters)
            var filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.userid = this.userId;
            filtersObj.pageIndex = this.queryPagination.pageIndex;
            filtersObj.pageSize = this.queryPagination.pageSize;
            if (filtersObj.date == undefined) {
                filtersObj.date = this.formatDate(new Date());
            } else {
                filtersObj.date = this.formatDate(filtersObj.date);
            }
            if (this.jurisdictionType === '1') {
                api.getTemTeacherList(filtersObj).then(res => {
                    this.queryPagination.countTotal = res.value ? res.value.totalCount : 0;
                    let table = res.value ? res.value.dataList : [];
                    this.tableData = table;
                });
            } else if (this.jurisdictionType === '2') {
                api.getTemStudentList(filtersObj).then(res => {
                    this.queryPagination.countTotal = res.value ? res.value.totalCount : 0;
                    let table = res.value ? res.value.dataList : [];
                    if (table) {
                    }
                    this.tableData = table;
                });
            }
        },
        // 获取检查项目
        getCheck () {
            api.getTemCheckList({ schoolCode: this.schoolCode }).then(res => {
                let checkList = [];
                res.value.map(item => {
                    checkList.push({
                        value: item.id,
                        label: item.name,
                    })
                    return item
                })
                checkList.unshift({ value: null, label: '全部' });
                this.checkList = checkList;
            });
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
        // 获取图表数据
        getEcharts () {
            var newCharts = _.cloneDeep(this.echarts)
            var ChartsObj = this.dealObjectValue(newCharts);
            ChartsObj.schoolCode = this.schoolCode;
            if (this.filters.date == undefined) {
                ChartsObj.data = this.formatDate(new Date());
            } else {
                ChartsObj.data = this.formatDate(this.filters.date);
            }
            if (this.jurisdictionType === '1') {
                api.getTemTeacherCharts(ChartsObj).then(res => {
                    var json = res.value ? res.value : {};
                    var normalNum = '';
                    var abnormalNum = '';
                    json.map(item => {
                        normalNum = item ? item.normalCount : '';
                        abnormalNum = item ? item.abnormalCount : '';
                        return item
                    })
                    this.chartsData.series.data[0].value = normalNum;
                    this.chartsData.series.data[1].value = abnormalNum;
                    let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                    studentCharts.setOption(this.chartsData);
                })
            } else if (this.jurisdictionType === '2') {
                api.getTemStudentCharts(ChartsObj).then(res => {
                    var json = res ? res.value : {};
                    var xAxisName = [];
                    var normalNum = [];
                    var abnormalNum = [];
                    json.map(item => {
                        xAxisName.push({
                            value: item.name,
                        });
                        normalNum.push({
                            value: item.normalCount,
                        });
                        abnormalNum.push({
                            value: item.abnormalCount,

                        })
                        return item
                    })
                    this.chartsData.xAxis[0].data = xAxisName;
                    this.chartsData.series[0].data = normalNum;
                    this.chartsData.series[1].data = abnormalNum;
                    let studentCharts = echarts.init(document.getElementById('chartsObj_RFOD'));
                    studentCharts.setOption(this.chartsData);
                })
            }
        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                date: new Date(),
                checkId: "",
                dept: "",
                gradeCode: "",
                classCode: "",
                userName: "",
            },
                this.getList();
            this.getEcharts();
        },
        // 导出页面数据
        async exportPage () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj = {
                schoolCode: this.schoolCode,
                userid: this.userId,
            };
            if (filtersObj.date == undefined) {
                filtersObj.date = this.formatDate(new Date());
            } else {
                filtersObj.date = this.formatDate(filtersObj.date);
            }
            var res = this.jurisdictionType == '1' ? await api.exportTemTeacher(filtersObj) : await api.exportTemStudent(filtersObj);
            const link = document.createElement('a')
            let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = (this.jurisdictionType == '1' ? '教师体温检测' : '学生体温检测') + '.xls'
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        // 打开复检弹窗   
        openDialog (info, type) {
            this.recheckDialog = true;
            this.recheckInfo = info;
            this.characterType = type;
        },
        // 关闭复检弹窗        
        closeDialog: function (childValue) {
            this.recheckDialog = childValue;
            this.getList();
        },
        // 打开详情drawer 
        openDrawer (CheckId, UserId, type) {
            this.CheckId = CheckId;
            this.UserId = UserId;
            this.detailDrawer = true;
            this.characterType = type;
        },
        // 关闭详情drawer       
        closeDrawer: function (childValue) {
            this.detailDrawer = childValue;
            this.getList();
        },
        // 状态样式
        stateFormat (row) {
            if (row.healthDec === '正常') {
                return <span>正常</span>
            } else {
                return <span class="red">异常</span>
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
    width: 40%;
    padding-right: 20px;
    min-width: 400px;
    min-height: 550px;

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
</style>

<style lang="scss">
.check-temperture {
    .filter-container {
        padding: 5px 15px 15px;
        position: relative;

        .filters-wapper {
            flex-wrap: wrap;
            align-items: center;

            .el-input {
                width: 160px;
            }
        }
    }

    .echart-filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .m_GenTableBox {
        .m_GenLeft {
            width: 600px;
        }

        .echartContent {
            width: 100%;
            background: #f2f2f2;
            border-radius: 15px;
            padding: 15px;
        }

        .m_GenRight {
            .exportBtn {
                margin-bottom: 20px;
            }
        }
    }
}
</style>
