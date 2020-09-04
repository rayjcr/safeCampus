<template>
    <div class="recheck">
        <el-dialog
            :title="title"
            width="450px"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
        >
            <div>
                <el-form :model="form" ref="form" label-width="95px">
                    <el-form-item label="姓名：" prop="userName">
                        <el-input
                            size="small"
                            v-model="form.userName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="部门："
                        prop="deptName"
                        v-if="type === '1'"
                    >
                        <el-input
                            size="small"
                            v-model="form.deptName"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="班级："
                        prop="className"
                        v-if="type === '2'"
                    >
                        <el-input
                            size="small"
                            v-model="form.className"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="体温：" prop="temperature">
                        <el-input
                            size="small"
                            v-model="form.temperature"
                            oninput="value=value.replace(/[^\d^\.]/g,'')"
                        ></el-input>
                        <span style="margin-left: 8px;">℃</span>
                    </el-form-item>
                    <el-form-item label="安置地点：" prop="site">
                        <el-select
                            size="small"
                            v-model="form.quarantineId"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="(item, index) in isolatedList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="说明：" prop="instruction">
                        <el-input
                            type="textarea"
                            rows="3"
                            :maxlength="400"
                            show-word-limit
                            v-model="form.remark"
                            placeholder="请输入内容"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";;

export default {
    name: 'face-confirm',
    props: {
        visible: Boolean,
        info: Object,
        type: String,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            userId: localStorage.userId,    // 用户Id
            dialogVisible: false,   // 编辑的弹窗
            title: '',
            charType: '',
            form: {
                userName: '',
                class: '',
                deptName: '',
                className: '',
                temperature: '',
                quarantineId: '',
                remark: '',
            },
            isolatedList: []
        }
    },
    watch: {
        visible (newVal) {
            this.dialogVisible = newVal;
            this.getIsolated();
        },
        type (newVal) {
            this.charType = newVal;
            if (this.charType === '1') {
                this.title = '教师复检跟踪';
            } else {
                this.title = '学生复检跟踪';
            }
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
        // 获取隔离点
        getIsolated () {
            var data = {
                schoolCode: this.schoolCode,
                createUserId: this.userId
            }
            api.getIsolatedPoint(data).then(res => {
                var isolated = res ? res.value : [];
                isolated.map(item => {
                    this.isolatedList.push({
                        value: item.id,
                        label: item.name,
                    })
                })
            })
        },
        // 提交
        submit () {
            var data = {
                checkDaySettingId: this.form.checkDaySettingId,
                createUserId: this.userId,
                schoolCode: this.schoolCode,
                temperature: this.form.temperature,
                remark: this.form.remark ? this.form.remark : '',
                quarantineId: this.form.quarantineId ? this.form.quarantineId : '',
                temperatureFrom: 1,
                userid: this.form.userid,
            }
            this.$refs.form.validate((valid) => {
                data.checkTeacherId = this.form.id;
                data.dept = this.form.deptCode;
                if (this.charType === '1') {
                    api.getTemTeacherRecheck(data).then(res => {
                        if (res.resultCode === 1) {
                            this.$message({
                                message: '保存成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message.error('保存失败!');
                            return false;
                        }
                    });
                } else if (this.charType === '2') {
                    api.getTemStudentRecheck(this.form).then(res => {
                        if (this.form) {
                            this.$message({
                                message: '保存成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message.error('保存失败!');
                            return false;
                        }
                    });
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
.recheck {
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
        padding: 10px 20px 20px;

        .el-radio__label {
            font-size: 16px;
        }

        .el-form-item__label {
            font-size: 16px;
        }

        .el-input {
            width: 200px;
        }

        .el-textarea {
            width: 300px;

            .el-input__count {
                bottom: 5px;
                right: 24px;
                height: 13px;
                line-height: 1;
            }
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