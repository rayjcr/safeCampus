<template>
    <div class="page-container smart-visitor">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">访客日期：</span>
                        <el-date-picker
                            type="date"
                            size="small"
                            v-model="filters.day"
                            :picker-options="pickerOptions"
                            placeholder="请选择日期"
                        ></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">访客类型：</span>
                        <el-select
                            size="small"
                            clearable
                            v-model="filters.type"
                        >
                            <el-option
                                v-for="(item, index) in visitorTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">被访人：</span>
                        <el-input
                            size="small"
                            v-model="filters.keywords"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div>
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
                    <div class="echartContent u-flex_row">
                        <div class="chartBox">
                            <div class="u-chart" id="chartsObj_VISITOR"></div>
                        </div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <div class="w100per">
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            class="exportBtn"
                            @click="exportPage"
                            >导出</el-button
                        >
                        <!-- <div class="pl20 ofh">
                            <div class="statistics">
                                <span>总访客数：{{ visitorList.allNum }}</span>
                                <span
                                    >确认中：{{ visitorList.confirmNum }}</span
                                >
                                <span
                                    >不通过：{{
                                        visitorList.notThroughNum
                                    }}</span
                                >
                                <span
                                    >未离校：{{ visitorList.notleaveNum }}</span
                                >
                            </div>
                        </div> -->
                    </div>
                    <el-table :data="tableData">
                        <el-table-column label="日期" prop="date" width="100">
                        </el-table-column>
                        <el-table-column label="被访人" prop="who" width="100">
                        </el-table-column>
                        <el-table-column
                            label="被访部门"
                            prop="departmentName"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            label="访客类型"
                            prop="typeName"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            label="访客时间"
                            prop="dateTime"
                            min-width="150"
                        >
                        </el-table-column>
                        <el-table-column
                            label="身份证号"
                            prop="cardId"
                            width="150"
                        >
                        </el-table-column>
                        <el-table-column
                            label="访客原因"
                            prop="reasonName"
                            width="120"
                        >
                        </el-table-column>
                        <el-table-column
                            label="访客状态"
                            prop="leaveName"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="120" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="openDialog(scope.row)"
                                    v-if="scope.row.leave === 0"
                                    >访客确认</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="remove(scope.row.id)"
                                    v-if="
                                        scope.row.leave === 1 &&
                                        scope.row.leaveTime == null
                                    "
                                    >离校</el-button
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
            <VisitorConfirm
                :visible.sync="visitorVisible"
                :info="visitorInfo"
                v-on:closeDialog="closeDialog"
            ></VisitorConfirm>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
import VisitorConfirm from './visitorConfirm'

export default {
    components: {
        VisitorConfirm
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            tableData: [],
            visitorVisible: false,  // 访客确认弹窗
            visitorInfo: {},    // 弹窗信息
            filters: {
                day: new Date(),
                type: "",    // 访客类型
                keywords: "",    // 被访人
            },
            visitorTypeList: [    // 访客类型
                {
                    value: null,
                    label: '全部',
                },
                {
                    value: 0,
                    label: '其他人员',
                },
                {
                    value: 1,
                    label: '家长'
                },
                {
                    value: 2,
                    label: '交工工友'
                },
                {
                    value: 3,
                    label: '业务人员'
                },
                {
                    value: 4,
                    label: '施工人员'
                },
                {
                    value: 5,
                    label: '送货人员'
                }
            ],
            visitStatus: [      // 访问许可状态
                {
                    value: 0,
                    label: '未审核',
                },
                {
                    value: 1,
                    label: '同意入校'
                },
                {
                    value: 2,
                    label: '不同意入校'
                },
            ],
            visitReason: [    // 访问事由
                {
                    value: 0,
                    label: '其他',
                },
                {
                    value: 1,
                    label: '家校沟通'
                },
                {
                    value: 2,
                    label: '访问亲友'
                },
                {
                    value: 3,
                    label: '探望宿舍'
                },
                {
                    value: 4,
                    label: '看望子女'
                },
                {
                    value: 5,
                    label: '业务联系'
                },
                {
                    value: 6,
                    label: '维修施工'
                },
                {
                    value: 7,
                    label: '送货服务'
                }
            ],
            visitorList: {      // 访客人数展示
                allNum: "",
                confirmNum: "",
                notThroughNum: "",
                notleaveNum: "",
            },
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            pickerOptions: {      // 日期选择今天之后的不可选择
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6;    //如果没有后面的-8.64e6就是不可以选择今天的
                }
            },
            enterSchool: [],   // 入校
            outSchool: [],   // 出校
            inSchool: [],   // 在校
            disagree: [],   // 不同意入校
            echartsData: {
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
                    data: ['入校', '出校', '校内', '不通过']
                },
                grid: {
                    left: 15,
                    right: 65,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: [{
                    name: '访客类型',
                    type: 'category',
                    data: [],
                    axisLabel: {
                        interval: 0,
                        // rotate: -15,   // 刻度标签旋转的角度
                        margin: 15,
                        algin: 'center',
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
                        name: '入校',
                        type: 'bar',
                        barWidth: 70,//柱图宽度
                        stack: '访客信息',
                        barWidth: 15,
                        color: '#54ABFF',
                        label: {
                            show: true,
                            formatter: '{c}',
                            color: '#333',
                        },
                        data: [10, 10, 10, 10, 10, 10],

                    },
                    {
                        name: '出校',
                        type: 'bar',
                        barWidth: 70,//柱图宽度

                        stack: '访客信息',
                        barWidth: 15,
                        color: '#F9C076',
                        label: {
                            show: true,
                            formatter: '{c}',
                            color: '#333',
                        },
                        data: [10, 10, 10, 10, 10, 10],

                    },
                    {
                        name: '校内',
                        type: 'bar',
                        barWidth: 70,//柱图宽度
                        stack: '访客信息',
                        barWidth: 15,
                        color: '#FF8564',
                        label: {
                            show: true,
                            formatter: '{c}',
                            color: '#333',
                        },
                        data: [10, 10, 10, 10, 10, 10],

                    },
                    {
                        name: '不通过',
                        type: 'bar',
                        barWidth: 70,//柱图宽度
                        stack: '访客信息',
                        barWidth: 15,
                        color: '#5FE9BA',
                        label: {
                            show: true,
                            formatter: '{c}',
                            color: '#333',
                        },
                        data: [10, 10, 10, 10, 10, 10],
                    },
                ]
            },
        }
    },
    watch: {},
    mounted () {
        let echartsData = echarts.init(document.getElementById('chartsObj_VISITOR'));
        echartsData.setOption(this.echartsData);
        this.getList();
        this.getEcharts();
    },
    methods: {
        // 过滤传参
        dealObjectValue (obj) {
            for (var key in obj) {
                if (obj[key] == null || obj[key] == undefined || obj[key] === "") {
                    delete obj[key]
                }
            }
            return obj;
        },
        // 获取列表数据
        getList () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.pageIndex = this.queryPagination.pageIndex;
            filtersObj.pageSize = this.queryPagination.pageSize;
            if (filtersObj.day === undefined) {
                filtersObj.day = this.formatDate(new Date());
            } else {
                filtersObj.day = this.formatDate(filtersObj.day);
            }
            api.getSmartVisitorList(filtersObj).then(res => {
                this.queryPagination.countTotal = res.value ? res.value.totalCount : 0;
                let table = res.value ? res.value.dataList : [];
                if (table) {
                    table.map(child => {
                        this.visitorTypeList.map(item => {
                            if (child.type === item.value) {
                                child.typeName = item.label;
                            }
                        });
                        this.visitReason.map(item => {
                            if (child.reason === item.value) {
                                child.reasonName = item.label;
                            }
                        });
                        this.visitStatus.map(item => {
                            if (child.leave === item.value) {
                                if (child.leaveTime !== null && child.leave === 1) {
                                    child.leaveName = '已确认';
                                } else {
                                    child.leaveName = item.label;
                                }
                            }
                        });
                        return child
                    })
                }
                this.tableData = table;
            });
        },
        // 获取图表部门采集数据
        getEcharts (selectVal) {
            api.getVisitorTypeNum({
                day: '2015-11-19',
                schoolCode: this.schoolCode
            }).then(res => {
                var json = res.value;
                var xAxisName = [];
                var that = this;
                json.map(item => {
                    this.visitorTypeList.map(child => {
                        if (item.type === child.value) {
                            xAxisName.push({
                                value: child.label,
                            });
                        }
                    });
                    this.enterSchool.push([
                        item.leaveCount,
                    ])
                    this.outSchool.push([
                        item.leaveCount,
                    ])
                    this.inSchool.push([
                        item.insideCount,
                    ])
                    this.disagree.push([
                        item.refuseCount,
                    ])
                    return item
                })
                this.echartsData.xAxis[0].data = xAxisName;
                this.echartsData.series[0].label.formatter = function (params) {
                    return that.enterSchool[params.dataIndex];
                };
                this.echartsData.series[1].label.formatter = function (params) {
                    return that.outSchool[params.dataIndex];
                };
                this.echartsData.series[2].label.formatter = function (params) {
                    return that.inSchool[params.dataIndex];
                };
                this.echartsData.series[3].label.formatter = function (params) {
                    return that.disagree[params.dataIndex];
                };
                let echartsData = echarts.init(document.getElementById('chartsObj_VISITOR'));
                echartsData.setOption(this.echartsData);
            })

        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                day: "",
                type: "",
                keywords: "",
            },
                this.getList();
        },
        // 导出页面数据
        exportPage () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.day = '2015-11-19';
            api.getVisitorExport(filtersObj).then(res => {
                const link = document.createElement('a')
                let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
                link.download = '智能访客' + '.xls'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }).catch(error => {
                console.log(error)
            })
        },
        // 打开访客确认弹窗
        openDialog (info) {
            this.visitorVisible = true;
            this.visitorInfo = info;
        },
        // 关闭访客确认弹窗
        closeDialog: function (childValue) {
            this.visitorVisible = childValue;
            this.getList();
        },
        // 移除离校按钮
        remove (visitorId) {
            let id = parseInt(visitorId);
            this.$confirm('确定要离校吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.putVisitorLeave(`${id}`).then(res => {
                    this.$message({
                        type: 'success',
                        message: '已成功离校!'
                    });
                });
                this.getList();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消离校',
                });
            });
        },
        // 日期格式化
        formatDate (getDate) {
            let year = getDate.getFullYear();
            let month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
            var day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();
            var setDate = year + "-" + month + "-" + day;
            return setDate
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
.typeTabs {
    width: 100%;
}

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
.smart-visitor {
    .filter-container {
        padding: 15px;
        position: relative;

        .filters-wapper {
            flex-wrap: wrap;
            align-items: center;

            .el-input {
                width: 160px;
            }
        }
    }

    .tableBorder {
        padding-top: 20px;

        .el-button--primary {
            width: 86px;
            height: 32px;
            padding: 5px;
            line-height: 1;
        }
    }

    .m_GenTableBox {
        .m_GenRight {
            .exportBtn {
                margin-bottom: 20px;
            }

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

            .el-table {
                margin-top: 20px;
            }

            .el-pagination {
                padding: 30px 5px 0px;
            }
        }
    }
}
</style>
