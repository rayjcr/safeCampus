<template>
    <div class="device-process-dialog">
        <el-dialog
            title="待处理"
            width="27%"
            :visible.sync="dialogVisible"
            :before-close="closeProcessDialog"
        >
            <div>
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="设备标识：">
                        <el-input
                            v-model="form.mathineCode"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="处理时间：">
                        <el-date-picker
                            v-model="form.dodate"
                            type="date"
                            placeholder="请选择日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="处理内容：">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeProcessDialog">取 消</el-button>
                <el-button type="primary" @click="processSubmit"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from '@/api/index.js';

export default {
    name: 'SidebarItem',
    props: {
        visible: Boolean,
        code: String
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,  // 学校代码
            dialogVisible: false,   // 编辑的弹窗
            form: {
                dodate: '',
                remark: '',
                mathineCode: '',
            },
            pickerOptions: {      // 日期选择今天之后的不可选择
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
        }
    },
    watch: {
        visible (newVal) {
            this.dialogVisible = newVal;
        },
        code (newVal) {
            this.form.mathineCode = newVal;
        },
    },
    mounted () { },
    methods: {
        // 提交待处理
        processSubmit () {
            var data = {
                schoolCode: this.schoolCode,
                dodate: this.formatDate(this.form.dodate),
                mathineCode: this.form.mathineCode,
                remark: this.form.remark,
            }
            api.processDeviceManage(data).then(res => {
                if (res.resultCode === 1) {
                    this.$message({
                        message: '设备更新成功!',
                        type: 'success'
                    });
                } else {
                    this.$message.error('设备更新失败!');
                    return false;
                }
                this.closeEditDialog();
            });
        },
        // 日期格式化
        formatDate (getDate) {
            if (getDate !== '') {
                let year = getDate.getFullYear();
                let month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
                var day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();
                var setDate = year + "-" + month + "-" + day;
                return setDate
            } else {
                return ''
            }
        },
        // 弹窗关闭
        closeProcessDialog () {
            this.dialogVisible = false;
            this.$emit("closeProcessDialog", this.dialogVisible);
        },
    },
}
</script>

<style lang="scss">
.device-process-dialog {
    display: inline-block;

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
        padding: 20px 0 20px 50px;

        .el-input {
            width: 250px;
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