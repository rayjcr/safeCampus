<template>
    <div class="page-container safetyWarning">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="searchBox u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">选择日期：</span>
                        <el-date-picker
                            :clearable="false"
                            size="small"
                            v-model="collectList.date"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">预警来源：</span>
                        <el-select
                            v-model="collectList.origin"
                            size="small"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in WarngSchoolList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">预警提醒人：</span>
                        <el-input
                            size="small"
                            class="w150"
                            v-model="collectList.txr"
                        ></el-input>
                    </div>
                </div>
                <div class="searchBtn">
                    <el-button
                        type="primary"
                        size="small"
                        @click="getListPage(1)"
                        >查 询</el-button
                    >
                    <el-button type="primary" size="small" @click="reset"
                        >重 置</el-button
                    >
                </div>
            </div>
            <div class="m_GenTableBox">
                <div class="next-line">
                    <el-button type="primary" style="success" size="small"
                        >导出</el-button
                    >
                </div>
                <el-table class="tableBorder" :data="tableData">
                    <el-table-column label="预警日期" prop="createDate">
                        <template slot-scope="scope">
                            {{ scope.row.createDate.split(" ")[0] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="预警来源" prop="sourceName">
                    </el-table-column>
                    <el-table-column label="预警类型" prop="warnCategoryName">
                    </el-table-column>
                    <el-table-column label="预警时间" prop="createDate">
                        <template slot-scope="scope">
                            {{ scope.row.createDate.split(" ")[0] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="预警提醒人" prop="pushUsers">
                        <template slot-scope="scope">
                            <span
                                v-for="(p, index) of scope.row.pushUsers"
                                :key="index"
                                >{{ p.userName }},</span
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
</template>

<script>
import * as api from "@/api/index.js";
import formatDate from '@/utils/formatDate'
export default {
    name: 'safety',
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            collectList: {   // 采集人数展示
                date: [],
                origin: null,
                txr: '',
            },
            tableData: [],
            WarngSchoolList: [], // 预警类型    
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            ruleForm: {
                resource: '',
                desc: ''
            }
        }
    },
    watch: {
        watchData () {
            this.getListPage();
        }
    },
    computed: {
        watchData () {
            var { date, origin, txr } = this.collectList;
            var { pageIndex, pageSize } = this.queryPagination;
            return { date, origin, txr, pageIndex, pageSize };
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        async init () {
            await this.getWarngSchoolList();
            var date = new Date().getTime();
            this.collectList.date = [
                formatDate(date, 'yyyy-MM-dd'),
                formatDate(date, 'yyyy-MM-dd')
            ]
        },
        // 获取预警类型
        getWarngSchoolList () {
            api.getWarngSchoolList({
                schoolCode: this.schoolCode
            }).then(res => {
                let arr = [];
                res.value.forEach(e => {
                    arr.push(...e.children);
                })
                arr.unshift({
                    id: null,
                    name: '全部',
                });
                this.WarngSchoolList = arr;
            });
        },
        getListPage (page = this.queryPagination.pageIndex) {
            this.queryPagination.pageIndex = page;
            api.listMessagePushed({
                begin: this.collectList.date[0],
                end: this.collectList.date[1],
                category: '',
                p: this.queryPagination.pageIndex,
                ps: this.queryPagination.pageSize,
                schoolCode: this.schoolCode,
                userId: this.userId
            }).then(res => {
                this.tableData = res.value.dataList || [];
                this.queryPagination.countTotal = res.value.totalCount;
            })
        },
        reset () {
            var date = new Date().getTime();
            this.collectList = {   // 采集人数展示
                date: [
                    formatDate(date, 'yyyy-MM-dd'),
                    formatDate(date, 'yyyy-MM-dd')
                ],
                origin: null,
                txr: '',
            }
            this.queryPagination.pageIndex = 1;
        },
        // 选择表格每页数量
        handleSizeChange (val) {
            this.queryPagination.pageSize = val;
        },
        // 选择第几页
        handleCurrentChange (val) {
            this.queryPagination.pageIndex = val;
        },
    }
}
</script>

<style lang="scss" scoped>
.safetyWarning {
    height: auto;

    .m_GenTableBox {
        height: 600px;
        padding: 20px;

        .m_GenLeft {
            height: 100%;
        }

        .el-table {
            padding-top: 20px;
        }
    }
}
.tipText {
    color: #666;
    font-size: 14px;
}
</style>
