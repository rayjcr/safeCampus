<template>
    <div class="car-confirm">
        <el-dialog
            title="存入重点车辆管理"
            width="30%"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
        >
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item prop="type">
                        <el-radio-group v-model="ruleForm.type">
                            <el-radio label="1">白名单</el-radio>
                            <el-radio label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="车辆归属："
                        label-width="105px"
                        prop="username"
                    >
                        <el-input
                            size="small"
                            v-model="ruleForm.username"
                        ></el-input>
                    </el-form-item>
                    <span class="tip"
                        >注：白名单为重点关注人员及车辆；黑名单为非法人员及车辆</span
                    >
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="personConfirm"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";;

export default {
    name: 'car-confirm',
    props: {
        visible: Boolean,
        info: Object,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            dialogVisible: false,   // 编辑的弹窗
            ruleForm: {
                type: '1',
                username: '',
            },
            rules: {
                username: [
                    { required: true, message: '车牌号不能为空', trigger: 'blur' },
                ]
            }
        }
    },
    watch: {
        visible: {
            handler (newVal, oldVal) {
                this.dialogVisible = newVal;
            },
            deep: true,
            immediate: true,
        },
        info: {
            handler (newVal, oldVal) {
                if (newVal.userId !== null || newVal.userId !== undefined) {
                    this.ruleForm.userId = newVal.userId;
                }
                this.ruleForm.logId = newVal.id;
                this.ruleForm.schoolCode = this.schoolCode;
            },
            deep: true,
            immediate: true,
        },
    },
    mounted () { },
    methods: {
        // 访问确认
        personConfirm () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    api.addCarList(this.ruleForm).then(res => {
                        if (this.ruleForm) {
                            this.$message({
                                message: '保存成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message.error('保存失败!');
                            return false;
                        }
                        this.dialogVisible = false;
                        this.$emit("closeDialog", this.dialogVisible);
                        this.$refs.ruleForm.resetFields();
                    })
                }
            });
        },
        // 弹窗关闭
        closeDialog () {
            this.dialogVisible = false;
            this.$emit("closeDialog", this.dialogVisible);
            this.$refs.ruleForm.resetFields();
        },
    },
}
</script>

<style lang="scss">
.car-confirm {
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

        .el-dialog__headerbtn {
            top: 22px;
            font-size: 20px;
        }
    }

    .el-dialog__body {
        padding: 25px;
        color: #333;
        padding: 10px 25px 30px;

        .el-radio__label {
            font-size: 16px;
        }

        .el-form-item__label {
            font-size: 16px;
        }

        .el-input {
            width: 200px;
        }

        .tip {
            color: #808080;
        }
    }

    .el-dialog__footer {
        padding: 0 20px 30px;
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