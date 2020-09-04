<template>
    <div class="page-container device-manage">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">设备类型：</span>
                        <el-select
                            v-model="filters.mathineType"
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
                    <div class="conditionBox">
                        <span class="filterTit">区域：</span>
                        <el-select
                            v-model="filters.area"
                            size="small"
                            clearable
                            placeholder="请选择区域"
                        >
                            <el-option
                                v-for="(item, index) in areaList"
                                :key="index"
                                :label="item.label"
                                :value="item.label"
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
                            placeholder="请选择位置"
                        >
                            <el-option
                                v-for="(item, index) in addressList"
                                :key="index"
                                :label="item.label"
                                :value="item.label"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">网络状态：</span>
                        <el-select
                            v-model="filters.onlineState"
                            size="small"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in onlineList"
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
                <el-alert
                    class="tipsAlert"
                    title="注：本模块操作前，请先设置【学校设备分布】的区域和位置"
                    type="warning"
                ></el-alert>
                <el-table height="500" :data="tableData">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="序号" width="80" type="index">
                    </el-table-column>
                    <el-table-column
                        label="设备序列号"
                        width="150"
                        prop="deviceSerial"
                    >
                    </el-table-column>
                    <el-table-column label="设备标识" width="150" prop="code">
                    </el-table-column>
                    <el-table-column
                        label="设备类型"
                        min-width="150"
                        prop="typeName"
                    >
                    </el-table-column>
                    <el-table-column label="区域" width="150" prop="area">
                    </el-table-column>
                    <el-table-column label="位置" width="150" prop="address">
                    </el-table-column>
                    <el-table-column
                        label="设备安装日期"
                        width="150"
                        prop="installDate"
                    >
                    </el-table-column>
                    <el-table-column
                        label="网络状态"
                        width="100"
                        prop="online"
                        :formatter="stateFormat"
                    >
                    </el-table-column>
                    <el-table-column
                        label="最近在线时间"
                        min-width="150"
                        prop="lastOnlineDate"
                    >
                    </el-table-column>
                    <el-table-column label="待处理" width="100">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="success"
                                plain
                                v-if="scope.row.online === false"
                                @click="openProcessDialog(scope.row.code)"
                                >待处理</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="openEditDialog(scope.row)"
                                >编辑</el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                @click="openDetailDrawer(scope.row.code)"
                                >详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div>
            <EditDialog
                :visible.sync="editDialogVisible"
                :info="deviceInfo"
                v-on:closeEditDialog="closeEditDialog"
            ></EditDialog>
        </div>
        <div>
            <ProcessDialog
                :visible.sync="processDialogVisible"
                :code="mathineCode"
                v-on:closeProcessDialog="closeProcessDialog"
            ></ProcessDialog>
        </div>
        <div>
            <DetailDrawer
                :visible.sync="detailDrawerVisible"
                :code="mathineCode"
                v-on:closeDetailDrawer="closeDetailDrawer"
            ></DetailDrawer>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import * as api from "@/api/index.js";
import EditDialog from "./editDialog";
import ProcessDialog from './processDialog';
import DetailDrawer from './detailDrawer'

export default {
    components: {
        EditDialog,
        ProcessDialog,
        DetailDrawer
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            editDialogVisible: false,    // 编辑弹窗
            deviceInfo: {},   // 编辑设备
            processDialogVisible: false,    // 编辑弹窗
            detailDrawerVisible: false,   // 详情drawer
            mathineCode: '',   // 设备Id
            filters: {
                mathineType: "", // 设备类型
                area: "", // 区域
                address: "", // 位置
                onlineState: "" // 网络状态
            },
            typeList: [],   // 设备类型
            areaList: [],   // 设备区域
            addressList: [],   // 设备位置
            onlineList: [    // 设备状态
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: 0,
                    label: "断开"
                },
                {
                    value: 1,
                    label: "连接"
                }
            ],
            tableData: []   // 列表数据
        };
    },
    mounted () {
        this.getList();
        this.getDeviceTypeList();
        this.getDeviceAreaList();
        this.getDeviceAddressList();
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
            var newFilters = _.cloneDeep(this.filters)
            var filtersObj = this.dealObjectValue(newFilters);
            filtersObj.schoolCode = this.schoolCode;
            api.getDeviceManage(filtersObj).then(res => {
                let table = res.value;
                this.tableData = table;
            });
        },
        // 重置Filters
        resetFilters () {
            this.filters = {
                mathineType: "",
                area: "",
                address: "",
                onlineState: ""
            },
                this.getList();
        },
        // 获取设备类型
        getDeviceTypeList () {
            api.getDeviceType({ schoolCode: this.schoolCode }).then(res => {
                let typeList = [];
                res.value.map(item => {
                    typeList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                typeList.unshift({ value: null, label: '全部' });
                this.typeList = typeList;
            });
        },
        // 获取设备区域
        getDeviceAreaList () {
            api.getDeviceArea({ schoolCode: this.schoolCode }).then(res => {
                let areaList = [];
                res.value.map(item => {
                    areaList.push({
                        label: item.name,
                    })
                    return item
                })
                areaList.unshift({ value: null, label: '全部' });
                this.areaList = areaList;
            });
        },
        // 获取设备位置
        getDeviceAddressList () {
            api.getDeviceAddress({ schoolCode: this.schoolCode }).then(res => {
                let addressList = [];
                res.value.map(item => {
                    addressList.push({
                        label: item.name,
                    })
                    return item
                })
                addressList.unshift({ value: null, label: '全部' });
                this.addressList = addressList;
            });
        },
        // 状态样式
        stateFormat (row) {
            if (row.online === true) {
                return <span>连接</span>
            } else {
                return <span class="red">断开</span>
            }
        },
        // 打开修改设备弹窗
        openEditDialog (info) {
            this.editDialogVisible = true;
            this.deviceInfo = info;
        },
        // 关闭修改弹窗
        closeEditDialog: function (childValue) {
            this.editDialogVisible = childValue;
            this.getList();
        },
        // 打开待处理弹窗
        openProcessDialog (code) {
            this.processDialogVisible = true;
            this.mathineCode = code;
        },
        // 关闭待处理弹窗
        closeProcessDialog: function (childValue) {
            this.processDialogVisible = childValue;
            this.getList();
        },
        // 打开详情drawer
        openDetailDrawer (code) {
            this.detailDrawerVisible = true;
            this.mathineCode = code;
        },
        // 关闭详情drawer
        closeDetailDrawer: function (childValue) {
            this.detailDrawerVisible = childValue;
        }
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
.device-manage {
    .filter-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
