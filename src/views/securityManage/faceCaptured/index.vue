<template>
    <div class="page-container face-captured">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">日期：</span>
                        <el-date-picker
                            v-model="filters.day"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">人员类型：</span>
                        <el-select
                            v-model="filters.type"
                            size="small"
                            clearable
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
                        <span class="filterTit">位置：</span>
                        <el-select
                            v-model="filters.passplace"
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
                <div class="m_GenCenter u-flex_row">
                    <el-card
                        class="cardItem"
                        :class="
                            item.type === '0'
                                ? 'strangerList'
                                : item.type === '1'
                                ? 'whiteList'
                                : 'blackList'
                        "
                        shadow="hover"
                        v-for="(item, index) in tableData"
                        :key="index"
                    >
                        <div class="imgAddBtn">
                            <img
                                :src="item.face"
                                class="image"
                                :onerror="photoError"
                                @load="ResizePhotoImg"
                                @click="enlargeImg(item.face)"
                            />
                            <el-button
                                class="confirmBtn"
                                @click="faceConfirmDialog(item)"
                                >{{ item.imgBtnName }}</el-button
                            >
                        </div>
                        <div class="labelWhite" v-if="item.type === '1'">
                            白名单
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="labelBlack" v-if="item.type === '2'">
                            黑名单
                            <span>{{ item.name }}</span>
                        </div>
                        <div
                            class="cardInfo"
                            :class="item.type !== '0' ? 'areaMove' : ''"
                        >
                            <div class="infoItem">
                                经过时间： <span>{{ item.passtime }}</span>
                            </div>
                            <div class="infoItem">
                                人员类型：<span>{{ item.typeName }}</span>
                            </div>
                            <div class="infoItem">
                                经过地点：<span>{{ item.passplace }}</span>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
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

        <div>
            <EnlargeImage
                :visible.sync="enlargeVisible"
                :imgUrl="faceImage"
                type="face"
                v-on:closeImg="closeImg"
            ></EnlargeImage>
        </div>
        <div>
            <ConfirmDialog
                :visible.sync="dialogVisible"
                :info="personInfo"
                v-on:closeDialog="closeDialog"
            ></ConfirmDialog>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import * as api from "@/api/index.js";
import ConfirmDialog from "./personConfirm";
import EnlargeImage from "@/component/enlargeImage";
import { ResizePhotoImg } from "@/utils/utils.js";

export default {
    components: {
        EnlargeImage,
        ConfirmDialog,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            tableData: [],
            faceImage: '',
            photoError: 'this.src="' + require('@/assets/img/personError.png') + '"',
            ResizePhotoImg: ResizePhotoImg,
            enlargeVisible: false,   // 图片放大
            dialogVisible: false,    // 确认弹窗
            personInfo: {},   // 人员信息
            filters: {
                day: [],     // 日期时间
                passplace: '',   // 位置
                num: '',   // 车牌号
            },
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            typeList: [    // 人员类型
                {
                    value: null,
                    label: '全部',
                },
                {
                    value: '0',
                    label: '陌生人',
                },
                {
                    value: '1',
                    label: '白名单',
                },
                {
                    value: '2',
                    label: '黑名单',
                },
            ],
            addressList: [],   // 位置
            queryPagination: {   // 翻页
                pageIndex: 1,
                pageSize: 10,
                countTotal: 1,
            },
            pickerOptions: {      // 日期选择今天之后的不可选择
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
        };
    },
    mounted () {
        this.getList();
        this.getAddress();
    },
    methods: {
        // 过滤传参
        dealObjectValue (obj) {
            for (var key in obj) {
                if (obj[key] == null || obj[key] == undefined || obj[key] === "") {
                    delete obj[key]
                }
            }
            obj.begintime = obj.day[0];
            obj.endtime = obj.day[1];
            delete obj.day;
            return obj;
        },
        // 日期格式化
        formatDate (getDate) {
            if (getDate) {
                let year = getDate.getFullYear();
                let month = getDate.getMonth() + 1;
                var day = getDate.getDate();
                var setDate = year + "-" + month + "-" + day;
                return setDate
            }
        },
        // 获取卡片列表
        getList () {
            let newFilters = _.cloneDeep(this.filters)
            let filtersObj = this.dealObjectValue(newFilters);
            filtersObj.begintime = this.formatDate(filtersObj.begintime);
            filtersObj.endtime = this.formatDate(filtersObj.endtime);
            filtersObj.schoolCode = this.schoolCode;
            filtersObj.pageIndex = this.queryPagination.pageIndex;
            filtersObj.pageSize = this.queryPagination.pageSize;
            api.getFaceSnapList(filtersObj).then(res => {
                this.queryPagination.countTotal = res.value.totalCount;
                this.tableData = res.value.dataList;
                this.tableData.map(item => {
                    // 人员类型判断
                    this.typeList.map(child => {
                        if (item.type === child.value) {
                            item.typeName = child.label;
                        }
                    })
                    if (item.type !== '0') {
                        item.imgBtnName = '修改人员';
                    } else if (item.type === '0') {
                        item.imgBtnName = '保存人员';
                    }
                    return item
                })
            })
        },
        // 获取位置
        getAddress () {
            api.getDeviceAddress({ schoolCode: this.schoolCode }).then(res => {
                let addressList = [];
                res.value.map(item => {
                    addressList.push({
                        value: item.code,
                        label: item.name,
                    })
                    return item
                })
                addressList.unshift({ value: null, label: '全部' });
                this.addressList = addressList;
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
        // 图片放大 
        enlargeImg (face) {
            this.faceImage = face;
            this.enlargeVisible = true;
        },
        // 打开人脸确认弹窗
        faceConfirmDialog (info) {
            this.dialogVisible = true;
            this.personInfo = info;
        },
        // 接受子组件的传值
        closeImg: function (childValue) {
            this.enlargeVisible = childValue;
        },
        closeDialog: function (childValue) {
            this.dialogVisible = childValue;
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
};
</script>

<style lang="scss" scoped>
.face-captured {
    .filter-container {
        padding: 15px;
        position: relative;
    }
    .filters-wapper {
        flex-wrap: wrap;
        align-items: center;
    }

    .tipsAlert {
        margin: 20px 0 10px 0;
    }

    .m_GenTableBox {
        .m_GenCenter {
            padding-top: 20px;
            margin: 0 -20px;
            flex-wrap: wrap;
        }
        /deep/ .el-card {
            border-radius: 10px;
        }
        .cardItem {
            width: 220px;
            height: 240px;
            margin: 0 20px 20px;
            position: relative;
            /deep/ .el-card__body {
                padding: 10px;
            }
            .labelWhite {
                position: absolute;
                top: 0;
                left: 0;
                min-width: 60px;
                height: 40px;
                border-radius: 8px 0 8px 0;
                background-color: #00cd86;
                font-size: 10px;
                text-align: center;
                padding: 3px 5px 5px;
                color: #fff;

                span {
                    display: block;
                }
            }
            .areaMove {
                position: relative;
            }
            .labelBlack {
                position: absolute;
                top: 0;
                left: 0;
                min-width: 60px;
                height: 40px;
                border-radius: 8px 0 8px 0;
                background-color: #ff5e33;
                font-size: 10px;
                text-align: center;
                padding: 3px 5px 5px;
                color: #fff;
                span {
                    display: block;
                }
            }

            .imgAddBtn {
                position: relative;
                width: 200px;
                height: 150px;
                display: block;
                border-radius: 10px;
                overflow: hidden;

                .image {
                    position: absolute;
                }
                .confirmBtn {
                    padding: 4px 8px;
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    width: 72px;
                    height: 26px;
                    background: rgba(0, 0, 0, 0.4);
                    opacity: 0.7;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #fff;
                    border: 2px solid #fff;
                }
            }

            .cardInfo {
                padding-top: 5px;
                color: #333;
                font-size: 12px;
                .infoItem {
                    display: block;
                    padding: 3px 0;

                    span {
                        color: #808080;
                    }
                }
            }
        }

        .strangerList {
            border: 1px solid #dcdfe6;
        }

        .whiteList {
            border: 2px solid #00cd86;
        }

        .blackList {
            border: 2px solid #ff5e33;
        }
    }

    .el-pagination {
        text-align: center;
    }
}
</style>
