<template>
    <div class="dialog-form warn-set">
        <el-dialog
            title="预警设置"
            width="385px"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
        >
            <div>
                <el-form ref="form" :model="form" label-width="130px">
                    <el-form-item label="校内总停放车辆数">
                        <el-input v-model="form.totalParkingPlace"></el-input>辆
                    </el-form-item>
                    <el-form-item label="滞留车辆预警提醒">
                        <el-input v-model="form.warning"></el-input>辆
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="editStrandedCar"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";

export default {
    props: {
        visible: Boolean,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            dialogVisible: false,   // 编辑的弹窗
            form: {
                totalParkingPlace: '',
                warning: '',
            },
        }
    },
    watch: {
        visible (newVal) {
            this.dialogVisible = newVal;
            this.getWarnSet();
        },
    },
    mounted () { },
    methods: {
        // 获取预警设置
        getWarnSet () {
            api.getParkingLot({ schoolCode: this.schoolCode }).then(res => {
                this.form = res.value;
            });
        },
        // 修改预警设置
        editStrandedCar () {
            api.editParkingLot({
                schoolCode: this.schoolCode,
                totalParkingPlace: this.form.totalParkingPlace,
                warning: this.form.warning
            }).then(res => {
                if (res.resultCode === 1) {
                    this.$message({
                        message: '修改成功!',
                        type: 'success'
                    });
                } else {
                    this.$message.error('确认失败!');
                    return false;
                }
            });
            this.closeDialog();
        },
        // 弹窗关闭
        closeDialog () {
            this.dialogVisible = false;
            this.$emit("closeWarnSetDialog", false);
        },
    },
}
</script>

<style lang="scss">
.warn-set {
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
        padding: 20px 10px 20px 30px;

        .el-input {
            width: 80px;
            margin-right: 15px;
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