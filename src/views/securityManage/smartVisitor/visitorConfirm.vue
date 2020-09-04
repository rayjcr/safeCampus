<template>
    <div class="dialog-form visitor-Confirm">
        <el-dialog
            title="访客确认"
            width="30%"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
        >
            <div>
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="访客类型：">
                        <el-input
                            v-model="form.typeName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="访客人：">
                        <el-input
                            v-model="form.name"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号：">
                        <el-input
                            v-model="form.cardId"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="访客原因：">
                        <el-input
                            v-model="form.reasonName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="被访客人：">
                        <el-input
                            v-model="form.who"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="被访地点：">
                        <el-input v-model="form.area"></el-input>
                    </el-form-item>
                    <el-form-item label="被访时间：">
                        <el-date-picker
                            v-model="form.day"
                            type="datetime"
                            placeholder="请选择日期时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmVisit(2)">拒绝访客</el-button>
                <el-button type="primary" @click="confirmVisit(1)"
                    >同意访客</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { putVisitorConfirm } from '@/api/index.js';

export default {
    props: {
        visible: Boolean,
        info: Object,
    },
    data () {
        return {
            dialogVisible: false,   // 编辑的弹窗
            isDisabled: true,    // 是否可编辑D
            form: {},
            updataMessage: {},   // 更新的数据
            visitStatus: [      // 访问许可状态
                {
                    value: 0,
                    label: '未审核',
                },
                {
                    value: 1,
                    label: '同意入校'
                },
                {
                    value: 2,
                    label: '不同意入校'
                },
            ],
        }
    },
    watch: {
        visible (newVal) {
            this.dialogVisible = newVal;
        },
    },
    mounted () { },
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
        // 访问确认
        confirmVisit (leave) {
            this.dialogVisible = true;
            var confirmObj = {};
            confirmObj.id = this.info.id;
            confirmObj.leave = leave;
            if (this.form.area) {
                confirmObj.remark = this.form.area;
            }
            if (this.form.day) {
                confirmObj.day = this.formatDate(this.form.day);
            }
            putVisitorConfirm(confirmObj).then(res => {
                if (res.resultCode === 1) {
                    this.$message({
                        message: '访问确认!',
                        type: 'success'
                    });
                } else {
                    this.$message.error('确认失败!');
                    return false;
                }
                this.closeDialog();
            });
        },
        // 弹窗关闭
        closeDialog () {
            this.dialogVisible = false;
            this.$emit("closeDialog", this.dialogVisible);
        },
    },
}
</script>

<style lang="scss">
.visitor-Confirm {
    .el-dialog {
        border-radius: 8px;
    }

    .el-dialog__header {
        .el-dialog__title {
            line-height: 24px;
            font-size: 20px;
            color: #333;
            font-weight: 500;
        }
    }

    .el-dialog__body {
        padding: 20px 10px 20px 20px;

        .el-input {
            width: 300px;
        }

        .el-date-editor {
            .el-range-separator {
                width: 8%;
                color: #333;
            }
        }
    }

    .el-dialog__footer {
        padding: 0 20px 40px;
        text-align: center;

        .el-button {
            width: 96px;
            height: 36px;
            line-height: 1;
            padding: 5px;
        }
    }
}
</style>