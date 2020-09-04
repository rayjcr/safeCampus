<template>
    <div class="page-container patrol-set">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <el-button type="primary" size="small" @click="openPatrolDrawer"
                    >新增巡更</el-button
                >
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <el-table height="500" :data="tableData">
                    <el-table-column
                        label="巡更计划名称"
                        width="150"
                        prop="deviceSerial"
                    >
                    </el-table-column>
                    <el-table-column 
                        label="巡更开始时间" 
                        min-width="150" 
                        prop="code"
                    >
                    </el-table-column>
                    <el-table-column
                        label="巡更结束时间"
                        min-width="150"
                        prop="typeName"
                    >
                    </el-table-column>
                    <el-table-column label="巡更地点" width="150" prop="area">
                    </el-table-column>
                    <el-table-column label="创建人" width="150" prop="address">
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                        min-width="150"
                        prop="installDate"
                    >
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="openEditDialog(scope.row)"
                            >删除</el-button>
                            <el-button
                                size="mini"
                                @click="openDetailDrawer(scope.row.code)"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                @click="openDetailDrawer(scope.row.code)"
                            >启用</el-button>
                            <el-button
                                size="mini"
                                @click="openDetailDrawer(scope.row.code)"
                            >禁用</el-button>
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

        <div>
            <!-- <DetailDrawer
                :visible.sync="detailDrawerVisible"
                v-on:closeDetailDrawer="closeDetailDrawer"
            ></DetailDrawer> -->
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import * as api from "@/api/index.js";
// import DetailDrawer from './detailDrawer';

export default {
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            addDeviceDrawer: false,   // 新增设备drawer
            addPatrolDrawer: false,   // 新增巡更drawer
            tableData: [],   // 列表数据
            queryPagination: { // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
        };
    },
    mounted () {
        this.getList();
    },
    methods: {
        // 获取列表数据
        getList () {
            var data = {
                schoolCode: this.schoolCode,
            }
            api.getDeviceManage(data).then(res => {
                var table = res.value ? res.value : [];
                this.tableData = table;
            });
        },
        // 打开新增巡更绑定
        openPatrolDrawer () {
            this.addDeviceDrawer = true;
        },
        // 关闭新增巡更绑定
        closePatrolDrawer () {
            this.addDeviceDrawer = false;
        },
        // 
        openDetailDrawer (code) {
            this.detailDrawerVisible = true;
            this.mathineCode = code;
        },
        // 关闭详情drawer
        closeDetailDrawer: function (childValue) {
            this.detailDrawerVisible = childValue;
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


<style lang="scss">
.patrol-set {
    .filter-container {
        padding: 15px 3px;
    }

    .m_GenTableBox {
        display: inline-block;

        .tipsAlert {
            margin: 20px 0;
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
