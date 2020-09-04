<template>
    <div class="page-container safetyWarning">
        <div class="u_cardMain u-flex_col" v-if="hideSchedule">
            <div class="filter-container u-flex_row">
                <div class="conditionBox">
                    <span class="filterTit">安保人员姓名：</span>
                    <el-input
                        size="small"
                        class="w150"
                        v-model="collectList.name"
                    ></el-input>
                </div>
                <div class="conditionBox">
                    <span class="filterTit">手机号：</span>
                    <el-input
                        size="small"
                        class="w150"
                        v-model="collectList.phone"
                    ></el-input>
                </div>
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
            <div class="m_GenTableBox">
                <div class="personnelStatistics">
                    <div class="personnelItem">
                        <div>总安保人员</div>
                        <div class="count">{{ civilStatics.userCount }}</div>
                    </div>
                    <div class="personnelItem">
                        <div>今日执勤人员</div>
                        <div class="count">{{ civilStatics.palnUserCount }}</div>
                    </div>
                </div>
                <div class="btnContainer">
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogVisible = true"
                        >添加</el-button
                    >
                    <el-button type="primary" size="small" @click="handlePlan"
                        >安保排班表</el-button
                    >
                    <el-button type="primary" size="small">导出</el-button>
                </div>

                <el-table class="tableBorder" :data="tableData">
                    <el-table-column label="安保人员姓名" prop="userName">
                    </el-table-column>
                    <el-table-column label="性别" prop="sex">
                        <template slot-scope="scope">
                            {{ scope.row.sex == "0" ? "女" : "男" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号" prop="mobile">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                            ></el-button>
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

        <div class="u_cardMain u-flex_col" v-else>
            <div class="filter-container">
                <div class="searchBox u-flex u-flex_row">
                    <span class="filterTit">月份：</span>
                    <el-select
                        v-model="month"
                        size="small"
                        @change="getPlanListByMonth"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in selectMonths"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="m_GenTableBox">
                <table class="scheduleTable" border="1" cellspacing="0">
                    <tr>
                        <th class="lineTd">
                            <span style="float: left; margin-top: 20px;"
                                >姓名</span
                            >
                            <span style="float: right; margin-top: 0px;"
                                >日期</span
                            >
                        </th>
                        <td
                            class="minW"
                            v-for="(n, index) in selectMonths[month ? month : 0]
                                .dayLen"
                            :key="index"
                        >
                            {{ n }}
                        </td>
                    </tr>
                    <tr v-for="(person, index) of personList" :key="index">
                        <th>{{ person.userName }}</th>
                        <td
                            class="minW"
                            v-for="(n, index) in selectMonths[month ? month : 0]
                                .dayLen"
                            :key="index"
                        >
                            <select
                                class="inputArea"
                                v-model="person.states[n - 1]"
                            >
                                <option value="2">早</option>
                                <option value="6">晚</option>
                                <option value="1">休</option>
                                <option value="8">全</option>
                            </select>
                        </td>
                    </tr>
                </table>
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
            <div class="m_GenTableBox bottom">
                <el-alert
                    title="班次: 早(班)/晚(班)/全(班)/休(息)"
                    type="info"
                    :closable="false"
                    description="注: 早班:7:00-19:00  晚班: 19:00-7:00"
                >
                </el-alert>
                <div class="midBtns">
                    <el-button type="primary" size="small" @click="handleSave"
                        >保存</el-button
                    >
                    <el-button type="primary" size="small" @click="handleCancel"
                        >关闭</el-button
                    >
                </div>
            </div>
        </div>

        <!-- 添加安保人员 -->
        <el-drawer
            title="选择人员"
            :visible.sync="dialogVisible"
            direction="rtl"
            :show-close="false"
            :before-close="
                () => {
                    dialogVisible = false;
                }
            "
        >
            <div v-if="treeData" class="addPersonBox">
                <el-input
                    v-model="filterText"
                    prefix-icon="el-icon-search"
                    size="small"
                    placeholder="搜索姓名"
                ></el-input>
                <div class="filter-tree">
                    <el-tree
                        style="background-color: inherit;"
                        show-checkbox
                        :data="treeData"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        lazy
                        :load="loadNode"
                        @check="handleCheckChange"
                        node-key="userId"
                        ref="tree"
                    >
                    </el-tree>
                </div>
                <div class="line"></div>
                <div class="selectedBox">
                    <span class="label">已选中:</span>
                    <div class="selected">
                        <el-tag
                            class="tag"
                            v-for="tag in tags"
                            :key="tag.userId"
                            closable
                            @close="handleCancelPerson(tag)"
                            type="info"
                        >
                            {{ tag.name }}
                        </el-tag>
                    </div>
                </div>
            </div>
            <div class="line"></div>
            <div class="bottom">
                <el-button size="small" @click="dialogVisible = false"
                    >取消</el-button
                >
                <el-button type="primary" size="small" @click="savePerson"
                    >保存</el-button
                >
            </div>
        </el-drawer>
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
            collectList: { // 采集人数展示
                name: "",
                phone: "",
            },
            tableData: [],
            queryPagination: { // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            dialogVisible: false,
            ruleForm: {
                mobile: '',
                sex: '1',
                userId: '',
                userName: ''
            },
            hideSchedule: true,
            selectMonths: [{
                label: '1月',
                value: 0,
                dayLen: 31,
            }, {
                label: '2月',
                value: 1,
                dayLen: 28,
            }, {
                label: '3月',
                value: 2,
                dayLen: 31,
            }, {
                label: '4月',
                value: 3,
                dayLen: 30,
            }, {
                label: '5月',
                value: 4,
                dayLen: 31,
            }, {
                label: '6月',
                value: 5,
                dayLen: 30,
            }, {
                label: '7月',
                value: 6,
                dayLen: 31,
            }, {
                label: '8月',
                value: 7,
                dayLen: 31,
            }, {
                label: '9月',
                value: 8,
                dayLen: 30,
            }, {
                label: '10月',
                value: 9,
                dayLen: 31,
            }, {
                label: '11月',
                value: 10,
                dayLen: 30,
            }, {
                label: '12月',
                value: 11,
                dayLen: 31,
            }],
            month: 0,
            personList: [],
            civilStatics: {
                palnUserCount: 0,
                userCount: 0
            },
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'leaf'
            },
            filterText: '',
            tags: [],
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.getGuarduserStatistics();
            this.getListPage();
            this.getTreeList();
        },
        // 获取部门列表
        async getTreeList () {
            var data = {
                schoolCode: this.schoolCode
            }
            var res = await api.getTeacherDepartment(data)
            var value = res.value ? res.value : [];
            value.forEach(e => e.userId = e.code);
            this.treeData = value;
        },
        // 获取首页统计
        getGuarduserStatistics () {
            api.getGuarduserStatistics({
                schoolCode: this.schoolCode,
                userId: this.userId,
            }).then(res => {
                Object.assign(this.civilStatics, res.value);
            })
        },
        // 获取首页表格
        getListPage (page = this.queryPagination.pageIndex) {
            this.queryPagination.pageIndex = page;
            api.getGuarduserPage({
                mobile: this.collectList.phone,
                name: this.collectList.name,
                p: this.queryPagination.pageIndex,
                ps: this.queryPagination.pageSize,
                schoolCode: this.schoolCode,
                userId: this.userId
            }).then(res => {
                this.tableData = res.value.dataList || [];
                var arr = [];
                res.value.dataList.forEach(e => {
                    let param = {
                        day: [],
                        states: new Array(31).fill('')
                    }
                    Object.assign(param, e);
                    arr.push(param)
                })
                this.personList = arr;
                this.queryPagination.countTotal = res.value.totalCount;
            })
        },
        // 获取安排人表格
        getPersonListPage (page = this.queryPagination.pageIndex) {
            this.queryPagination.pageIndex = page;
            api.getGuarduserPage({
                mobile: '',
                name: '',
                p: this.queryPagination.pageIndex,
                ps: this.queryPagination.pageSize,
                schoolCode: this.schoolCode,
                userId: this.userId
            }).then(res => {
                var arr = [];
                res.value.dataList.forEach(e => {
                    let param = {
                        day: [],
                        states: new Array(31).fill('')
                    }
                    Object.assign(param, e);
                    arr.push(param)
                })
                this.personList = arr;
                this.queryPagination.countTotal = res.value.totalCount;
            })
        },
        // 按月获取安排
        getPlanListByMonth () {
            var date = new Date();
            date.setMonth(this.month, 1);
            var datetime = formatDate(date.getTime(), "yyyy-MM-dd")
            api.getGuarduserpan({
                schoolCode: this.schoolCode,
                date: datetime,
            }).then(res => {
                if (res.value) {
                    res.value.forEach(e => {
                        var per = this.personList.find(p => p.userId == e.userId);
                        if (per) {
                            per.states = [];
                            e.planList.forEach((e) => {
                                var ind = Number(e.date.split('T')[0].split('-')[2]);
                                per.states[ind - 1] = e.state;
                            })
                        }
                    })
                } else {
                    this.personList.forEach(e => {
                        e.states = new Array(31).fill('');
                    })
                }
            })
        },
        addGuarduser () {
            var params = Object.assign({ schoolCode: this.schoolCode }, this.ruleForm);
            api.addGuarduser(params).then(res => {
                if (res.resultCode == 1) {
                    this.$notify({
                        type: 'success',
                        message: '添加成功',
                        title: '成功'
                    })
                    this.dialogVisible = false;
                    this.getListPage(1);
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage,
                        title: '错误'
                    })
                }
            })
        },
        reset () {
            this.collectList = { // 采集人数展示
                phone: '',
                name: '',
            }
            this.queryPagination.pageIndex = 1;
        },
        handleDelete (item) {
            this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.removeGuarduser({ schoolCode: this.schoolCode, userId: item.userId }).then(res => {
                    this.$notify({
                        type: 'success',
                        message: '删除成功',
                        title: '成功'
                    })
                    this.getListPage(1);
                })
            }).catch(() => {
            });
        },
        handleBack () {
            this.hideSchedule = true;
            this.queryPagination.pageIndex = 1;
            this.getListPage(1);
        },
        handleCancel () {
            this.$confirm('是否确定要关闭?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleBack()
            }).catch(() => {
            });
        },
        handleSave () {
            var param = {
                date: '',
                schoolCode: this.schoolCode,
                userWorkStates: []
            };
            var date = new Date();
            date.setMonth(this.month, 1);
            param.date = formatDate(date.getTime(), "yyyy-MM-dd")
            var monthDay = [];
            for (var i = 1; i <= this.selectMonths[this.month].dayLen; i++) {
                monthDay.push(i);
            }
            this.personList.forEach(e => {
                var p = {
                    userId: e.userId,
                    states: e.states,
                    days: monthDay
                }
                param.userWorkStates.push(p)
            })
            api.saveGuarduserpan(param).then(res => {
                if (res.resultCode == 1) {
                    this.$notify({
                        type: 'success',
                        message: '添加成功！',
                        title: '成功'
                    })
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage,
                        title: '错误'
                    })
                }
            })
        },
        async handlePlan () {
            await this.getPersonListPage();
            this.hideSchedule = false;
            this.queryPagination.pageIndex = 1;
            this.getPlanListByMonth();
        },
        filterNode (value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        async loadNode (node, resolve) {
            if (node.level === 0) {
                return resolve(this.treeData);
            } else if (node.level === 1) {
                var arr = await this.getTeacherList(node.data.code)
                node.data.children = arr;
                resolve(arr)
            } else {
                return resolve([])
            }
        },
        // 根据部门获取老师列表
        async getTeacherList (code) {
            var data = {
                schoolCode: this.schoolCode,
                userId: this.userId,
                departCode: code
            }
            var res = await api.getDepartmentTeacherList(data)
            var dataList = res.value;
            dataList = dataList || [];
            var arr = [];
            dataList.forEach(e => {
                arr.push({
                    leaf: true,
                    name: e.name,
                    mobile: e.tel1,
                    sex: e.sex,
                    userId: e.teacherId,
                    userName: e.name
                })
            })
            return arr;
        },
        // 选人
        handleCheckChange (data, treeNode) {
            console.log(data, treeNode);
            var { checkedNodes } = treeNode;
            var res = []
            checkedNodes.forEach(e => {
                if (!e.leaf) {
                    if (!e.children && typeof (e.children) != "undefined" && e.children != 0) {
                        this.getTeacherList(e.code).then(arr => {
                            res.push(...arr);
                            var node = this.$refs.tree.getNode(e.code);
                            node.data.children = arr;
                            console.log(node, 450)
                        })
                    } else {
                        res.push(...e.children);
                    }
                } else {
                    var leaf = res.find(p => p.userId == e.userId);
                    if (!leaf) {
                        res.push(e);
                    }
                }
            })
            this.tags = res;
            console.log(res, 451);
        },
        // 取消选人
        handleCancelPerson (per) {
            var res = this.$refs.tree.getCheckedNodes(true);
            res = res.filter(e => e.userId != per.userId);
            // 取消树选择
            this.$refs.tree.setCheckedNodes(res)
            // 取消表格选择
            this.tags = this.tags.filter(e => e.userId != per.userId);
        },
        // 保存人
        async savePerson () {
            var success = true;
            for (var p of this.tags) {
                var { name, userId, userName, sex, mobile } = p;
                var schoolCode = this.schoolCode;
                var res = await api.addGuarduser({ name, userId, userName, sex, mobile, schoolCode });
                if (res.resultCode == 1) {
                    continue;
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage,
                        title: '错误'
                    })
                    break;
                }
            }
            if (success) {
                this.dialogVisible = false;
                this.$notify({
                    type: 'success',
                    message: '添加成功！',
                    title: '成功'
                })
                this.getListPage(1)
            }
        },
        // 选择表格每页数量
        handleSizeChange (val) {
            this.queryPagination.pageSize = val;
            this.getListPage();
        },
        // 选择第几页
        handleCurrentChange (val) {
            this.queryPagination.pageIndex = val;
            this.getListPage();
        },
    }
}
</script>

<style lang="scss" scoped>
.safetyWarning {
    height: auto;

    .m_GenTableBox {
        min-height: 600px;

        .el-table {
            padding-top: 20px;
        }

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

                & + .personnelItem {
                    margin-left: 30px;
                }

                .count {
                    font-size: 24px;
                    line-height: 30px;
                    padding-top: 10px;
                }
            }

            .btnContainer {
                margin-left: 30px;
            }
        }

        .m_GenLeft {
            height: 100%;
        }

        .scheduleTable {
            width: 100%;
            text-align: center;

            .minW {
                min-width: 20px;
                table-layout: fixed;
                word-break: break-all;
            }

            .inputArea {
                width: 100%;
                height: 100%;
            }

            .lineTd {
                width: 80px;
                background: #fff
                    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=)
                    no-repeat 100% center;
            }
        }

        &.bottom {
            height: auto;
            min-height: 0;
        }

        .midBtns {
            text-align: center;
            margin-top: 10px;
        }
    }
}

.tipText {
    color: #666;
    font-size: 14px;
}
.addPersonBox {
    padding: 20px;
    height: auto;
    box-sizing: border-box;
    .filter-tree {
        overflow: auto;
        height: 450px;
        margin-top: 20px;
        background: #f2f2f2;
        border-radius: 10px;
        padding: 10px 0;
    }
    .selectedBox {
        .label {
            font-size: 14px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
        }
        .selected {
            margin-top: 20px;
            height: 150px;
            overflow: auto;
            .tag {
                margin: 5px;
            }
        }
    }
}
.bottom {
    text-align: center;
}
.line {
    width: 100%;
    height: 1px;
    margin: 20px 0;
    background-color: #dcdfe6;
}
</style>
