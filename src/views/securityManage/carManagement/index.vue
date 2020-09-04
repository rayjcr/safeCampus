<template>
    <div class="page-container smart-visitor">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker
                            class="w150"
                            type="date"
                            size="small"
                            v-model="filters.date"
                            :picker-options="pickerOptions"
                        ></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">车辆类型：</span>
                        <el-select
                            class="w150"
                            size="small"
                            clearable
                            v-model="filters.vehicleType"
                        >
                            <el-option
                                v-for="(item, index) in vehicleTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">出入类型：</span>
                        <el-select
                            class="w150"
                            size="small"
                            clearable
                            v-model="filters.vehicleOut"
                        >
                            <el-option
                                v-for="(item, index) in vehicleOutList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">车牌号：</span>
                        <el-input
                            class="w150"
                            size="small"
                            v-model="filters.plateNo"
                            placeholder="请输入车牌号"
                        ></el-input>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">姓名：</span>
                        <el-input
                            class="w150"
                            size="small"
                            v-model="filters.name"
                            placeholder="请输入姓名"
                        ></el-input>
                    </div>
                </div>
                <div>
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
                    <div class="echartContent u-flex_row">
                        <div class="chartBox">
                            <div id="chartsObj_VISITOR"></div>
                        </div>
                    </div>
                </div>
                <div class="m_GenRight">
                    <div class="w100per btnContainer">
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            @click="exportPage"
                            >导出</el-button
                        >
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            @click="openWarnSetDialog"
                            >预警设置</el-button
                        >
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            >车辆管理</el-button
                        >
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            class="strandedBtn"
                            @click="openStrandedDialog"
                            >累计滞留车辆：{{ strandedCount }}
                        </el-button>
                    </div>
                    <el-table :data="tableData">
                        <el-table-column label="日期" prop="date" width="150">
                        </el-table-column>
                        <el-table-column label="姓名" prop="personName">
                        </el-table-column>
                        <el-table-column
                            label="车辆类型"
                            prop="vehicleTypeName"
                        >
                        </el-table-column>
                        <el-table-column
                            label="出入类型"
                            prop="vehicleOutName"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            label="访客时间"
                            prop="time"
                            width="100"
                        >
                        </el-table-column>
                        <el-table-column
                            label="设备名称"
                            prop="deviceName"
                            width="150"
                        >
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
            <WarnSet
                :visible.sync="warnSetVisible"
                v-on:closeWarnSetDialog="closeWarnSetDialog"
            ></WarnSet>
            <StrandedCar
                :visible.sync="strandedVisible"
                :count="strandedCount"
                v-on:closeStrandedDialog="closeStrandedDialog"
            ></StrandedCar>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import * as api from "@/api/index.js";
import WarnSet from './warnSet.vue';
import StrandedCar from './StrandedCar.vue';

export default {
    components: {
        WarnSet,
        StrandedCar
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            tableData: [],
            filters: {
                date: new Date(),
                vehicleType: null,    // 车辆类型
                vehicleOut: null,    // 出入类型
                plateNo: "",   // 车牌号
                name: "",    // 姓名
            },
            vehicleTypeList: [    // 车辆类型列表
                {
                    value: null,
                    label: '全部'
                },
                {
                    value: 0,
                    label: '校内'
                },
                {
                    value: 1,
                    label: '校外'
                }
            ],
            vehicleOutList: [    // 出入类型列表
                {
                    value: null,
                    label: '全部'
                },
                {
                    value: 0,
                    label: '入校'
                },
                {
                    value: 1,
                    label: '出校'
                },
            ],
            warnSetVisible: false,  // 预警设置弹窗
            strandedVisible: false,  // 滞留车辆弹窗
            strandedCount: 0,    // 滞留车辆数
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
            echartsData: {},
        }
    },
    watch: {},
    created () {
        this.echartsData = {

            left: 'center',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: '滞留',
                    type: 'pie',
                    color: '#fff',
                    selectedMode: 'single',
                    radius: [0, '25%'],
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: 0,
                            name: '',
                            label: {
                                position: 'center',
                                fontSize: '12px',
                                color: '#333',
                                lineHeight: 13,
                            }
                        },
                    ]
                },
                {
                    name: '车辆',
                    type: 'pie',
                    radius: ['25%', '55%'],
                    label: {
                        position: 'inner',
                        fontSize: '12px',
                        color: '#333',
                    },
                    data: [
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#9677EE'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#54ABFF'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#F9C076'
                            }
                        },
                    ]
                },
                {
                    name: '车辆管理',
                    type: 'pie',
                    radius: ['55%', '80%'],
                    label: {
                        position: 'inner',
                        fontSize: '12px',
                        color: '#333',
                    },
                    data: [
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#815BEE'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#C5B1FF'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#3F98EF'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#A8D4FF'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#ECA64B'
                            }
                        },
                        {
                            value: 0,
                            name: '',
                            itemStyle: {
                                color: '#FFE0B8'
                            }
                        },
                    ]
                }
            ]
        };
        this.getEcharts();
    },
    mounted () {
        let echartsData = echarts.init(document.getElementById('chartsObj_VISITOR'));
        echartsData.setOption(this.echartsData);
        this.getList();
        this.getStrandedCar();
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
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.date = this.formatDate(filtersObj.date);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.pageIndex = this.queryPagination.pageIndex;
            filtersObj.pageSize = this.queryPagination.pageSize;
            api.getCarManageList(filtersObj).then(res => {
                this.queryPagination.countTotal = res.value.totalCount;
                var tableData = res.value.dataList ? res.value.dataList : [];
                tableData.map(item => {
                    item.vehicleOutName = item.vehicleOut === 0 ? '入校' : '出校';
                    if (item.vehicleType === 0) {
                        item.vehicleTypeName = '未登记';
                    } else if (item.vehicleType === 1) {
                        item.vehicleTypeName = '校内';
                    } else {
                        item.vehicleTypeName = '外来';
                    }
                    return item
                });
                this.tableData = tableData;
            });
        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                date: new Date(),
                vehicleType: "",
                vehicleOut: "",
                plateNo: "",
                name: "",
            },
                this.getList();
        },
        // 导出页面数据
        exportPage () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.date = this.formatDate(filtersObj.date);
            api.exportCarManageList(filtersObj).then(res => {
                const link = document.createElement('a')
                let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
                link.download = '车辆管理' + '.xls'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }).catch(error => {
                this.$message.error('导出失败！');
            })
        },
        // 获取车辆数量图表
        getEcharts () {
            var data = {
                schoolCode: this.schoolCode,
                date: this.formatDate(this.filters.date)
            }
            api.getCarManageEcharts(data).then(res => {
                this.echartsData.series[0].data[0].value = res.value.retentionCount;
                this.echartsData.series[0].data[0].name = '总滞留\n' + res.value.retentionCount;
                var echats = res.value ? res.value.carTypeStatisticsList : {};
                echats.map(item => {
                    if (item.vehicleType === 0) {
                        this.echartsData.series[1].data[0].value = item.retentionCount;
                        this.echartsData.series[2].data[0].value = item.inCount;
                        this.echartsData.series[2].data[1].value = item.outCount;
                        this.echartsData.series[1].data[0].name = '未登记：' + item.retentionCount;
                        this.echartsData.series[2].data[0].name = '校外入：' + item.inCount;
                        this.echartsData.series[2].data[1].name = '校外出：' + item.outCount;
                    } else if (item.vehicleType === 1) {
                        this.echartsData.series[1].data[1].value = item.retentionCount;
                        this.echartsData.series[2].data[2].value = item.inCount;
                        this.echartsData.series[2].data[3].value = item.outCount;
                        this.echartsData.series[1].data[1].name = '校内：' + item.retentionCount;
                        this.echartsData.series[2].data[2].name = '校外入：' + item.inCount;
                        this.echartsData.series[2].data[3].name = '校外出：' + item.outCount;
                    } else {
                        this.echartsData.series[1].data[2].value = item.retentionCount;
                        this.echartsData.series[2].data[4].value = item.inCount;
                        this.echartsData.series[2].data[5].value = item.outCount;
                        this.echartsData.series[1].data[2].name = '外来：' + item.retentionCount;
                        this.echartsData.series[2].data[4].name = '校外入：' + item.inCount;
                        this.echartsData.series[2].data[5].name = '校外出：' + item.outCount;
                    }
                });
                let echartsData = echarts.init(document.getElementById('chartsObj_VISITOR'));
                echartsData.setOption(this.echartsData);
            })
        },
        // 打开预警设置弹窗
        openWarnSetDialog () {
            this.warnSetVisible = true;
        },
        // 关闭预警设置弹窗
        closeWarnSetDialog: function (childValue) {
            this.warnSetVisible = childValue;
            this.getList();
        },
        // 获取滞留车辆
        getStrandedCar () {
            api.getStrandedCarNum({ schoolCode: this.schoolCode }).then(res => {
                this.strandedCount = res.value ? res.value : '';
            });
        },
        // 打开滞留车辆弹窗
        openStrandedDialog () {
            this.strandedVisible = true;
        },
        // 关闭滞留车辆弹窗
        closeStrandedDialog: function (childValue) {
            this.strandedVisible = childValue;
            this.getList();
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
    width: 360px;
    height: 400px;

    .chartBox {
        width: 360px;
        height: 400px;
        float: left;
        margin-top: 10px;
        > div {
            width: 98%;
            height: 100%;
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

            .el-date-editor.el-input {
                width: 150px;
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
            flex: 1;

            .btnContainer {
                height: 32px;
                line-height: 32px;
                margin-bottom: 20px;

                .strandedBtn {
                    flex: 1;
                    float: right;
                    margin-right: 15px;
                }
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