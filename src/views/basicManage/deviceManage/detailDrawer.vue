<template>
    <div class="detail-drawer">
        <el-drawer
            title="详情"
            :visible.sync="drawerVisible"
            :before-close="closeDetailDrawer"
        >
            <div class="container">
                <el-card
                    v-for="(item, index) in detail"
                    :key="index"
                    class="detailCard"
                >
                    <div slot="header" class="clearfix">
                        <img :src="ellipse" />
                        <span>检查时间：</span>
                        <span>{{ item.doDate }}</span>
                    </div>
                    <div>
                        <div class="detailItem">
                            <span>处理人：</span>
                            <span>{{ item.userName }}</span>
                        </div>
                        <div class="detailItem" >
                            <span>处理内容：</span>
                            <span>{{ item.remark }}</span>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="footer-btn">
                <el-button @click="closeDetailDrawer">关 闭</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import ellipseIcon from '@/assets/img/ellipse.png';

export default {
    props: {
        visible: Boolean,
        code: String,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,  // 学校代码
            drawerVisible: false,   // 抽屉状态
            ellipse: ellipseIcon,
            mathineCode: '',
            detail: []
        }
    },
    watch: {
        code (newVal) {
            this.mathineCode = newVal;
        },
        visible (newVal) {
            this.drawerVisible = newVal;
            this.getDetail();
        }
    },
    mounted () {
    },
    created () { },
    methods: {
        // 日期格式化
        formatDate (dateTime) {
            let year = dateTime.getFullYear();
            let month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
            let day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
            let hour = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
            let minute = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
            let second = dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds();
            let setDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return setDate.toString()
        },
        // 获取详情
        getDetail () {
            var data = {
                schoolCode: this.schoolCode,
                mathineCode: this.mathineCode,
                p: 1,
                ps: 5,
            };
            api.detailDeviceManage(data).then(res => {
                this.detail = res.value ? res.value.dataList : [];
            })
        },
        // drawer关闭
        closeDetailDrawer () {
            this.drawerVisible = false;
            this.$emit("closeDetailDrawer", this.drawerVisible);
        },
    },
}
</script>

<style lang="scss">
.detail-drawer {
    .container {
        position: relative;
        height: 750px;
        overflow: auto;

        .detailCard {
            width: 80%;
            border: 1px solid #e6e6e6;
            margin: 0 auto 20px;
            border-radius: 10px;

            .el-card__header {
                background: #f2f2f2;

                .clearfix {
                    display: inline-block;
                    justify-content: start;
                    align-self: center;

                    img {
                        vertical-align: middle;
                        margin-right: 6px;
                        position: relative;
                        top: -1px;
                    }
                }
            }

            .el-card__body {
                padding: 10px 26px;
            }

            .detailItem {
                padding-bottom: 10px;
            }
        }
    }
    
    .footer-btn {
        text-align: center;
        padding: 20px 0;
    }
}
</style>