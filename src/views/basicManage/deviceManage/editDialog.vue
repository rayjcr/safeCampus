<template>
    <div class="dvice-edit-dialog">
        <el-dialog
            title="编辑"
            width="27%"
            :visible.sync="dialogVisible"
            :before-close="closeEditDialog"
        >
            <div>
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="设备序列号：">
                        <el-input
                            v-model="form.deviceSerial"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="设备名称：">
                        <el-input
                            v-model="form.code"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型：">
                        <el-input
                            v-model="form.typeName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="设备区域：">
                        <el-select
                            v-model="form.area"
                            clearable
                            :disabled="true"
                        >
                            <el-option
                                v-for="item in option"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备位置：">
                        <el-select
                            v-model="form.address"
                            clearable
                            :disabled="true"
                        >
                            <el-option
                                v-for="item in option"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备安装日期：">
                        <el-date-picker
                            v-model="form.installDate"
                            type="date"
                            placeholder="请选择日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="updateMachine"
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
        info: Object,
    },
    data () {
        return {
            dialogVisible: false,   // 编辑的弹窗
            title: '',   // 弹窗标题
            isDisabled: true,    // 是否可编辑D
            form: {},
            updataMessage: {},   // 更新的数据
            option: [
                {
                    value: 1,
                    label: '全部',
                },
                {
                    value: 2,
                    label: '教学楼',
                },
                {
                    value: 3,
                    label: '行政楼',
                }
            ],
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
        info: {
            handler (newVal, oldVal) {
                this.form = newVal;
            },
            deep: true,
            immediate: true,
        },
    },
    mounted () { },
    methods: {
        // 更新设备信息
        updateMachine () {
            this.updataMessage.schoolCode = localStorage.schoolCode;
            this.updataMessage.mathineCode = this.form.code;
            this.updataMessage.installDate = this.formatDate(this.form.installDate);
            api.editDeviceManage(this.updataMessage).then(res => {
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
            let year = getDate.getFullYear();
            let month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
            var day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();
            var setDate = year + "-" + month + "-" + day;
            return setDate
        },
        // 弹窗关闭
        closeEditDialog () {
            this.dialogVisible = false;
            this.$emit("closeEditDialog", this.dialogVisible);
        },
    },
}
</script>

<style lang="scss">
.dvice-edit-dialog {
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