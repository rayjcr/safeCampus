<template>
    <div class="temperature-detail">
        <el-drawer
            :title="title"
            :visible.sync="drawerVisible"
            :before-close="closeDrawer"
        >
            <div class="container">
                <!-- <div class="lineSpace"></div> -->
                <el-card
                    v-for="(item, index) in 3"
                    :key="index"
                    class="detailCard"
                >
                    <div slot="header" class="clearfix">
                        <img :src="ellipse" />
                        <span>检查时间：</span>
                        <span>2020-08-06 14:30:00</span>
                    </div>
                    <div>
                        <div class="detailItem">
                            <span>姓名：</span>
                            <span>{{ detail.userName }}</span>
                        </div>
                        <div class="detailItem" v-if="charType === '1'">
                            <span>部门：</span>
                            <span>{{ detail.deptName }}</span>
                        </div>
                        <div class="detailItem" v-if="charType === '2'">
                            <span>班级：</span>
                            <span>{{ detail.className }}</span>
                        </div>
                        <div class="detailItem">
                            <span>体温：</span>
                            <span>{{ detail.temperature }}</span>
                        </div>
                        <div class="detailItem">
                            <span>安置地点：</span>
                            <span>{{ detail.quarantineName }}</span>
                        </div>
                        <div class="detailItem">
                            <span>说明：</span>
                            <span>{{ detail.remark }}</span>
                        </div>
                        <div class="detailItem">
                            <span>复检人：</span>
                            <span>{{ detail.createUserName }}</span>
                        </div>
                        <div class="detailItem">
                            <span>复检时间：</span>
                            <span>{{ detail.updateDate }}</span>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="footer-btn">
                <el-button>关 闭</el-button>
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
        id: Number,
        userId: String,
        type: String
    },
    data () {
        return {
            drawerVisible: false,   // 抽屉状态
            ellipse: ellipseIcon,
            detail: {},
            title: '',
            charType: '',  // 人物类型
            checkId: '',
            userid: '',
        }
    },
    watch: {
        visible (newVal) {
            this.drawerVisible = newVal;
        },
        id (newVal) {
            this.CheckId = newVal.toString();
        },
        userId (newVal) {
            this.UserId = newVal;
        },
        type (newVal) {
            this.charType = newVal;
            if (this.charType === '1') {
                this.title = '教师复检详情';
            } else {
                this.title = '学生复检详情';
            }
            this.getDetail();
        },
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
            var obj = {};
            obj.schoolCode = localStorage.schoolCode;
            if (this.charType === '1') {
                obj.teachercheckId = this.CheckId;
                obj.userId = this.UserId;
                api.getTemTeacherDetail(obj).then(res => {
                    this.detail = res.value ? res.value : {};
                });
            } else if (this.charType === '2') {
                api.getTemStudentDetail(obj).then(res => {
                    this.detail = res.value ? res.value : {};
                });
            }
        },
        // drawer关闭
        closeDrawer () {
            this.drawerVisible = false;
            this.$emit("closeDrawer", this.drawerVisible);
        },
    },
}
</script>

<style lang="scss">
.temperature-detail {
    .container {
        position: relative;

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

        .lineSpace {
            position: relative;
            height: 20px;
            border-right: 1px solid #ccc;
        }
    }

    // .detailContainer {
    //     position: absolute;
    //     display: inline-block;

    //     .detailItem {
    //         display: flex;
    //         justify-items: start;
    //         align-self: center;
    //     }
    // }
}
</style>