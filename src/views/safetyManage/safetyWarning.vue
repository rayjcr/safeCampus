<template>
    <div class="app-container safetyWarning">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filters-wapper">
                    <div class="conditionBox">
                        <span class="filterTit">选择日期：</span>
                        <el-date-picker
                            :clearable="false"
                            size="small"
                            v-model="filters.date"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">区域：</span>
                        <el-select
                            v-model="filters.area"
                            size="small"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in areaList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">位置：</span>
                        <el-select
                            v-model="filters.address"
                            size="small"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in addressList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">预警类型：</span>
                        <el-select
                            v-model="filters.category"
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
                        <span class="filterTit">预警状态：</span>
                        <el-select
                            v-model="filters.status"
                            size="small"
                            clearable
                        >
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="(item, index) in WarnType"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">处理人：</span>
                        <el-input
                            size="small"
                            class="w150"
                            v-model="filters.clr"
                        ></el-input>
                    </div>

                    <!--          <div class="conditionBox">
            <el-button type="primary" size="small">查 询</el-button>
            <el-button type="primary" size="small">重 置</el-button>
          </div> -->
                </div>
                <div>
                    <el-button type="primary" size="small" @click="getList(1)"
                        >查 询</el-button
                    >
                    <el-button type="primary" size="small" @click="reset"
                        >重 置</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogVisible1 = true"
                        >预警设置</el-button
                    >
                    <el-alert
                        class="tipsAlert"
                        :closable="false"
                        title="注：1、行为预警来源于摄像监控设备分析；2、人员预警来源于访客和人脸监控；3、传感预警来源于消防等相应设备；4、事件预警来源于摄像监控设备；"
                        type="info"
                    ></el-alert>
                </div>
            </div>
            <div class="m_GenTableBox">
                <div class="m_GenLeft">
                    <sunbutstChart></sunbutstChart>
                </div>
                <div class="m_GenRight">
                    <div class="w100per">
                        <el-button
                            type="primary mgAll10 fl"
                            style="success"
                            size="small"
                            >导出</el-button
                        >
                    </div>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="预警来源" prop="courceName">
                        </el-table-column>
                        <el-table-column label="区域" prop="area">
                        </el-table-column>
                        <el-table-column label="位置" prop="address">
                        </el-table-column>
                        <el-table-column
                            label="预警类型"
                            prop="warnCategoryName"
                        >
                        </el-table-column>
                        <el-table-column label="预警时间" prop="createDate">
                        </el-table-column>
                        <el-table-column label="处理状态" prop="state">
                            <template slot-scope="scope">
                                {{ scope.row.state == "0" ? "未处理" : "处理" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="处理人" prop="doUserName">
                        </el-table-column>
                        <el-table-column label="处理时间" prop="doDate">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="handleDone"
                                    >{{
                                        scope.row.state == "0"
                                            ? "预警处理"
                                            : "修 改"
                                    }}</el-button
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

        <!-- 预警处理弹框 -->
        <el-dialog
            title="预警处理"
            top="30vh"
            :visible.sync="dialogVisible"
            @close="handleDoneClose"
            width="30%"
        >
            <el-form
                label-position="right"
                label-width="90px"
                label-suffix="："
                :model="ruleForm"
            >
                <el-form-item label="预警状态">
                    <el-radio-group v-model="ruleForm.resource">
                        <el-radio
                            :label="item.value"
                            v-for="(item, index) in WarnType"
                            :key="index"
                            >{{ item.label }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="预警处理">
                    <el-input
                        type="textarea"
                        v-model="ruleForm.desc"
                        maxlength="500"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false"
                    >保 存</el-button
                >
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 预警查看 -->
        <el-dialog
            title="预警查看"
            top="30vh"
            :visible.sync="dialogVisible1"
            width="30%"
        >
            <div slot="title">
                <h3>预警查看</h3>
                <el-alert
                    :closable="false"
                    title="注:预警设置关联预警消息记录,必须配合相关硬件实现。"
                    type="info"
                >
                </el-alert>
            </div>
            <table
                v-if="selectCategorie"
                class="warnTable"
                border="1"
                cellspacing="0"
            >
                <tr>
                    <th>大类</th>
                    <td class="flexTd">
                        <i
                            class="el-icon-arrow-left"
                            @click="handleChangeTypeInd(-1)"
                        ></i>
                        <div class="scroll">
                            <div
                                class="tagScroll"
                                :style="
                                    'transform: translateX(-' +
                                    100 * bigTypeInd +
                                    '%);'
                                "
                            >
                                <el-tag
                                    class="tag"
                                    :effect="
                                        c.id == selectCategorie.id
                                            ? 'dark'
                                            : 'plain'
                                    "
                                    v-for="(c, index) of WarngSchoolList"
                                    :key="index"
                                    @click="selectCategorie = c"
                                >
                                    {{ c.name }}
                                </el-tag>
                            </div>
                        </div>
                        <i
                            class="el-icon-arrow-right"
                            @click="handleChangeTypeInd(1)"
                        ></i>
                    </td>
                </tr>
                <tr>
                    <th>子类</th>
                    <td class="minH">
                        <el-tag
                            class="tag zl"
                            v-for="(n, index) in selectCategorie.children"
                            :key="index"
                            >{{ n.name }}</el-tag
                        >
                    </td>
                </tr>
            </table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import formatDate from '@/utils/formatDate'
import sunbutstChart from './charts/sunburstChart.vue';
export default {
    name: 'safety',
    components: {
        sunbutstChart
    },
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            tableData: [{
                cardStr: '1'
            }],
            filters: {
                date: [], //开始结束时间
                area: null, // 区域
                address: null, // 位置
                category: null, // 预警类型
                status: '', // 预警状态
                clr: "" // 处理人
            },
            areaList: [], // 设备区域
            addressList: [], // 设备位置
            WarngSchoolList: [], // 预警类型
            WarnType: [{
                label: '正常预警',
                value: 1
            }, {
                label: '异常预警',
                value: 0
            }],
            queryPagination: { // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            dialogVisible: false,
            dialogVisible1: false,
            ruleForm: {
                resource: '',
                desc: ''
            },
            selectCategorie: null,
            bigTypeInd: 0, //大类分页
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            var date = new Date().getTime();
            this.filters.date = [
                formatDate(date, 'yyyy-MM-dd'),
                formatDate(date, 'yyyy-MM-dd')
            ]
            this.getDeviceAreaList();
            this.getDeviceAddressList();
            this.getWarngSchoolList();
            this.getList();
            this.getStatis();
        },
        getList (page = this.queryPagination.pageIndex) {
            this.queryPagination.pageIndex = page;
            var params = {
                begin: this.filters.date[0],
                end: this.filters.date[1],
                category: this.filters.category,
                p: this.queryPagination.pageIndex,
                ps: this.queryPagination.pageSize,
                schoolCode: this.schoolCode,
                userId: this.userId
            }
            api.safetyListMessages(params).then(res => {
                this.tableData = res.value.dataList || [];
                this.queryPagination.countTotal = res.value.totalCount;
            })
        },
        getStatis () {
            var params = {
                begin: this.filters.date[0],
                end: this.filters.date[1],
                schoolCode: this.schoolCode,
                userId: this.userId
            }
            api.safetyStaticsList(params).then(res => {
                if (res.value) {
                    res.value.forEach(e => {

                    })
                }
            })
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
        // 大类切页
        handleChangeTypeInd (val) {
            var page = this.bigTypeInd + val;
            var total = Math.floor(this.WarngSchoolList.length / 4);
            total = this.WarngSchoolList.length < 4 ? 0 : total;
            if (page <= total && page >= 0) {
                this.bigTypeInd = page;
            }
        },
        // 获取设备区域
        getDeviceAreaList () {
            api.getDeviceArea({
                schoolCode: this.schoolCode
            }).then(res => {
                let areaList = [];
                res.value.map(item => {
                    areaList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                areaList.unshift({
                    value: null,
                    label: '全部'
                });
                this.areaList = areaList;
            });
        },
        // 获取设备位置
        getDeviceAddressList () {
            api.getDeviceAddress({
                schoolCode: this.schoolCode
            }).then(res => {
                let addressList = [];
                res.value.map(item => {
                    addressList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                addressList.unshift({
                    value: null,
                    label: '全部'
                });
                this.addressList = addressList;
            });
        },
        // 获取预警类型
        getWarngSchoolList () {
            api.getWarngSchoolList({
                schoolCode: this.schoolCode
            }).then(res => {
                let WarngSchoolList = res.value;
                let arr = [];
                res.value.forEach(e => {
                    arr.push(...e.children);
                })
                WarngSchoolList.unshift({
                    id: null,
                    name: '全部',
                    children: arr,
                });
                this.selectCategorie = WarngSchoolList[0];
                this.WarngSchoolList = WarngSchoolList;
            });
        },
        // 重置
        reset () {
            var date = new Date().getTime();
            this.filters = {   // 采集人数展示
                date: [
                    formatDate(date, 'yyyy-MM-dd'),
                    formatDate(date, 'yyyy-MM-dd')
                ],
                area: null, // 区域
                address: null, // 位置
                category: null, // 预警类型
                status: '', // 预警状态
                clr: "" // 处理人
            }
            console.log(this.filters, 317)
            this.getList(1)
        },
        // 预警处理
        handleDone (row) {
            if (row.status != '0') {
                // 已处理
                this.ruleForm = {
                    resource: row.doState,
                    desc: row.doRemark
                }
            }
            this.dialogVisible = true;
        },
        // 关闭处理弹框
        handleDoneClose () {

            this.$confirm('是否确认取消?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.ruleForm = {
                    resource: '',
                    desc: ''
                }
                this.dialogVisible = false;
            }).catch(() => {
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.safetyWarning {
    height: auto;

    .m_GenTableBox {
        height: 600px;

        .m_GenLeft {
            height: 100%;
        }

        .m_GenRight {
            .el-table {
                padding-top: 20px;
            }
        }
    }
}

.tipText {
    color: #666;
    font-size: 14px;
}

table,
table tr th,
table tr td {
    border: 1px solid #ccc;
}

.warnTable {
    width: 100%;
    font-size: 20px;

    th {
        width: 80px;
        color: #000;
    }

    td {
        &.flexTd {
            display: flex;
            align-items: center;
        }

        .scroll {
            flex: 1;
            height: 42px;
            overflow: hidden;
            display: inline-block;

            .tagScroll {
                width: auto;
                white-space: nowrap;
                transition: 0.3s transform;

                .tag {
                    width: calc(25% - 10px);
                }
            }
        }
    }

    .tag {
        width: 80px;
        text-align: center;
        margin: 5px;

        &.zl {
            width: 30%;
        }
    }
}
</style>
