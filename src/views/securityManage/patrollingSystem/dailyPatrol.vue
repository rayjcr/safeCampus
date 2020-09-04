<template>
    <div class="page-container daily-patrol">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker
                            v-model="filters.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">巡更计划：</span>
                        <el-select
                            v-model="filters.patrolTaskId"
                            size="small"
                            clearable
                            placeholder="请选择类型"
                        >
                            <el-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
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
                <div class="personnelStatistics">
                    <div class="personnelItem">
                        <div>总安保人员</div>
                        <div class="count">{{ patrolReport.guardUserCount }}</div>
                    </div>
                    <div class="personnelItem">
                        <div>今日执勤人员</div>
                        <div class="count">{{ patrolReport.toDayGuardUserCount }}</div>
                    </div>
                    <div class="personnelItem">
                        <div>今日巡更人员</div>
                        <div class="count">{{ patrolReport.patrolDayUserCount }}</div>
                    </div>
                    <div class="personnelItem">
                        <div>计划巡更次数</div>
                        <div class="count">{{ patrolReport.patrolDayTaskCount }}</div>
                    </div>
                    <div class="personnelItem">
                        <div>计划巡更地点数</div>
                        <div class="count">{{ patrolReport.patrolDayplaceCount }}</div>
                    </div>
                </div>
                <div class="btnContainer">
                    <router-link :to="'/securityManage/patrollingSystem/patrolSet'">
                        <el-button type="primary" size="small">巡更设置</el-button>
                    </router-link>
                    <router-link :to="'/securityManage/patrollingSystem/guardSchedule'">
                        <el-button type="primary" size="small" >安保排班表</el-button>
                    </router-link>
                    
                    <el-button type="primary" size="small">导出</el-button>
                </div>

                <el-table height="500" :data="tableData">
                    <el-table-column
                        label="巡更日期"
                        min-width="150"
                        prop="date"
                    >
                    </el-table-column>
                    <el-table-column label="巡更计划" min-width="180" prop="patrolName">
                    </el-table-column>
                    <el-table-column label="开始时间" min-width="100" prop="startTime">
                    </el-table-column>
                    <el-table-column label="结束时间" min-width="100" prop="endTime">
                    </el-table-column>
                    <el-table-column label="总巡更点数" min-width="100" prop="devicesCount">
                    </el-table-column>
                    <el-table-column label="已巡更点数" min-width="100" prop="signInCount">
                    </el-table-column>
                    <el-table-column
                        label="巡更状态"
                        min-width="100"
                        prop="complete"
                        :formatter="stateFormat"
                    >
                    </el-table-column>
                    
                    <el-table-column label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="openDetailDrawer(scope.row.code)"
                            >详情</el-button>
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
</template>

<script>
import _ from "lodash";
import * as api from "@/api/index.js";
import formatDate from '@/utils/formatDate';

export default {
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            tableData: [],            
            filters: {
                date: [new Date(), new Date()], 
                patrolTaskId: "", // 巡更计划
            },
            queryPagination: { // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            dialogVisible: false,
            hideSchedule: true,
            typeList: [],   // 设备类型
            areaList: [],   // 设备区域
            addressList: [],   // 设备位置
            patrolReport: {   // 巡更报表
                guardUserCount: 0,
                toDayGuardUserCount: 0,
                patrolDayUserCount: 0,
                patrolDayTaskCount: 0,
                patrolDayplaceCount: 0,
            },
        };
    },
    mounted () { 
        this.getList();
        this.getReport();
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
        // 获取日常巡更列表
        getList () {
            var data = {
                schoolCode: this.schoolCode,
                patrolTaskId: this.filters.patrolTaskId,
                startDate: this.formatDate(this.filters.date[0]),
                endDate: this.formatDate(this.filters.date[1]),
            };
            api.getDailyPatrolList(data).then(res => {
                // console.log("日常巡更=", res);
                var tableData = res.value ? res.value : [];
                this.tableData = tableData;

            })
        }, 
        // 获取日常巡更报表
        getReport () {
            api.getDailyPatrolReport({
                schoolCode: this.schoolCode,
                date: this.formatDate(new Date())
            }).then(res => {
                if(res.value) {
                    this.patrolReport = res.value;
                }
            })
        },
        // 巡更状态
        stateFormat (row) {
            if (row.complete === true) {
                return <span>已完成</span>
            } else {
                return <span class="red">未完成</span>
            }
        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                date: [new Date(), new Date()], 
                patrolTaskId: "",
            },
                this.getList();
        },
        // 表格每页数量
        handleSizeChange (val) {
            this.queryPagination.pageSize = val;
            this.getList();
        },
        // 第几页
        handleCurrentChange (val) {
            this.queryPagination.pageIndex = val;
            this.getList();
        },
    }
};
</script>

<style lang="scss" scoped>
.tipsAlert {
    height: 40px;
    margin: 20px 0 10px 0;
}
</style>

<style lang="scss">
.daily-patrol {
    .filter-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .el-range-editor {
            width: 250px;
            height: 32px;
            line-height: 32px;            
        }

        .el-input__inner {
            padding: 0 10px;
        }
    }

    .m_GenTableBox {
        display: inline-block;

        .personnelStatistics {
            display: flex;
            margin: 20px 15px 20px 0;
            align-items: center;

            .personnelItem {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 80px;
                width: 160px;
                border-radius: 10px;
                color: #fff;
                font-size: 12px;
                &:nth-child(1){
                    background: linear-gradient(180deg, #168dff 0%, #88c5ff 100%);
                }
                &:nth-child(2){
                    background: linear-gradient(180deg, #29DC9E 0%, #76F9CB 100%);
                }
                &:nth-child(3){
                    background: linear-gradient(180deg, #9677EE 0%, #B79EFF 100%);
                }
                &:nth-child(4){
                    background: linear-gradient(180deg, #FCB355 0%, #FFCB87 100%);
                }
                &:nth-child(5){
                    background: linear-gradient(180deg, #FF8564 0%, #FFA38A 100%);
                }

                & + .personnelItem {
                    margin-left: 30px;
                }

                .count {
                    font-size: 24px;
                    line-height: 30px;
                    padding-top: 10px;
                }
            }
        }
        
        .btnContainer {
            margin-bottom: 20px;

            .el-button {
                margin-right: 20px;
            }
        }
    }

    .el-table {
        .has-gutter {
            .el-checkbox__inner {
                display: none;
            }
        }

        .cell {
            .el-button {
                margin: 5px 10px 5px 0;
            }
        }
    }
}
</style>
