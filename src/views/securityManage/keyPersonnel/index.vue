<template>
    <div class="page-container key-personnel">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="searchBox u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">车牌号：</span>
                        <el-input
                            size="small"
                            class="w150"
                            v-model="searchForm.num"
                        ></el-input>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">姓名：</span>
                        <el-input
                            size="small"
                            class="w150"
                            v-model="searchForm.name"
                        ></el-input>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">身份证号：</span>
                        <el-input
                            size="small"
                            class="w150"
                            v-model="searchForm.idcard"
                        ></el-input>
                    </div>
                </div>
                <div class="searchBtn">
                    <el-button size="small" type="primary" @click="getList"
                        >查询</el-button
                    >
                    <el-button size="small" type="primary" @click="clickReset"
                        >重置</el-button
                    >
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_col">
                <div class="u-flex_row">
                    <el-radio-group
                        class="u-flex"
                        size="small"
                        v-model="jurisdictionType"
                        @change="changeType"
                    >
                        <el-radio-button :label="1">白名单</el-radio-button>
                        <el-radio-button :label="2">黑名单</el-radio-button>
                    </el-radio-group>
                    <el-button size="small" type="primary" @click="clickEdit()"
                        >新增</el-button
                    >
                </div>
                <div class="m_GenCenter u-flex cusMiniScroll">
                    <div class="minusMargin u-flex_row">
                        <el-card
                            class="cardItem"
                            shadow="hover"
                            v-for="(item, index) in tableData"
                            :key="index"
                        >
                            <div class="imgAddBtn">
                                <img
                                    :src="item.face"
                                    :onerror="photoError"
                                    class="image"
                                    @load="ResizePhotoImg"
                                />
                            </div>
                            <div class="cardInfo">
                                <div class="infoItem">
                                    姓名：
                                    <span>{{
                                        item.name ? item.name : ""
                                    }}</span>
                                </div>
                                <div class="infoItem">
                                    身份证号：<span>{{
                                        item.idCard ? item.idCard : ""
                                    }}</span>
                                </div>
                                <div class="infoItem">
                                    车牌号：<span>{{
                                        item.num ? item.num : ""
                                    }}</span>
                                </div>
                            </div>
                            <div class="btnBox">
                                <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="clickEdit(item)"
                                    circle
                                ></el-button>
                                <el-button
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="clickDelete(item, index)"
                                    circle
                                ></el-button>
                            </div>
                        </el-card>
                    </div>
                    <div
                        class="empty"
                        v-if="!tableData || tableData.length < 1"
                    >
                        暂无数据
                    </div>
                </div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :total="totalCount"
                    layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </div>

        <!-- 预警处理弹框 -->
        <el-dialog
            :title="curEdit ? '编辑' : '新增'"
            :visible.sync="dialogVisible"
            @close="handleClose"
        >
            <el-form
                auto-complete="on"
                label-position="right"
                label-width="100px"
                label-suffix="："
                ref="editForm"
                :model="editForm"
                size="mini"
            >
                <el-form-item label="关联">
                    <el-radio-group v-model="editForm.linked">
                        <el-radio label="0">人脸抓拍</el-radio>
                        <el-radio label="2">车辆抓拍</el-radio>
                        <el-radio label="1">智能访客</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="存入">
                    <el-radio-group v-model="editForm.type">
                        <el-radio label="1">白名单</el-radio>
                        <el-radio label="2">黑名单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="姓名"
                    prop="name"
                    :rules="[
                        {
                            required: editForm.linked == 2 ? false : true,
                            message: '请输入姓名',
                            trigger: 'blur',
                        },
                    ]"
                >
                    <el-input class="w200" v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="身份证号"
                    prop="idCard"
                    :rules="[
                        {
                            required: editForm.linked == 1 ? true : false,
                            message: '请输入身份证号',
                            trigger: 'blur',
                        },
                    ]"
                >
                    <el-input class="w200" v-model="editForm.idCard"></el-input>
                </el-form-item>
                <el-form-item
                    label="车牌号"
                    prop="num"
                    :rules="[
                        {
                            required: editForm.linked == 2 ? true : false,
                            message: '请输入车牌号',
                            trigger: 'blur',
                        },
                    ]"
                >
                    <el-input class="w200" v-model="editForm.num"></el-input>
                </el-form-item>
                <el-form-item
                    label="照片"
                    prop="face"
                    :rules="[
                        {
                            required: editForm.linked == 0 ? true : false,
                            message: '请上传图片',
                        },
                    ]"
                >
                    <el-upload
                        class="uploadBox"
                        ref="upload"
                        :action="upload_url"
                        :show-file-list="false"
                        :http-request="uploadSectionFile"
                    >
                        <img v-if="editForm.face" :src="editForm.face" />
                        <i v-else class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="rule u-flex_row">
                <div class="title">注意事项：</div>
                <ul class="u-flex">
                    <li>
                        1）上传二寸左右的证件照，且将照片请在上传前自行压缩至100KB以内，图片太大将可能导致不能正常识别；
                    </li>
                    <li>2）图片需要是JPG格式；</li>
                    <li>
                        3）本功能支持浏览器有：360浏览器、谷歌浏览器、IE11等主流浏览器；
                    </li>
                    <li>
                        4）照片需要保证纯背景色证件照，人脸居中不能模糊台暗和溢出边界；
                    </li>
                    <li>5）图片内容以人脸为主；</li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSure">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import { ResizePhotoImg } from "@/utils/utils.js";
export default {
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            userId: localStorage.userId,
            searchForm: {
                num: "",          //车牌号
                name: "",
                idcard: ""
            },
            jurisdictionType: 1,               //1白名单   2黑名单
            tableData: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dialogVisible: false,
            curEdit: null,                   //当前编辑的对象
            editForm: {},
            photoError: 'this.src="' + require('@/assets/img/personError.png') + '"',
            ResizePhotoImg: ResizePhotoImg,
            upload_url: "",
        };
    },
    mounted () {
        this.getList()
    },
    methods: {
        async getList () {
            var data = {
                ...this.searchForm,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                schoolCode: this.schoolCode,
                type: this.jurisdictionType
            }
            var res = await api.getUserLimitTablePage(data)
            if (!res.value) return false
            this.pageIndex = res.value.currentPage
            this.totalCount = res.value.totalCount
            this.tableData = res.value.dataList ? res.value.dataList : []
        },
        // 编辑
        async clickEdit (item) {
            this.curEdit = null
            this.dialogVisible = true
            if (item) {
                var res = await api.getUserLimitTableInfo({ Id: item.id })
                this.curEdit = res.value ? res.value : null
            }
            this.editForm = this.curEdit ? this.curEdit : {
                linked: "0",
                type: "1"
            }
        },
        clickSure () {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.editForm.idcard = this.editForm.idCard
                    var data = {
                        ...this.editForm,
                        isattention: 1,                 //是否重点关注 0 否 1是
                        schoolCode: this.schoolCode,
                        userId: this.userId
                    }
                    var curApi = this.curEdit ? api.updateUserLimitTable : api.addUserLimitTable
                    if (this.curEdit) data.id = this.curEdit.id
                    curApi(data).then(res => {
                        if (res.resultCode == 1) {
                            this.handleClose()
                            this.getList()
                        }
                        else this.$message.error(res.resultMessage);
                    })
                }
            })
        },
        // 重置form验证
        resetForm () {
            this.$refs.editForm.resetFields();
        },
        // 删除
        async clickDelete (item, index) {
            var data = {
                Id: item.id
            }
            var res = await api.deleteUserLimitTable(data)
            console.log("========", res);
            if (res.resultCode == 1) {
                this.tableData.splice(index, 1)
                this.$notify({ type: 'success', message: '删除成功', title: '成功' })
            }
            else this.$notify({ type: 'error', message: res.resultMessage, title: '失败' })
        },
        uploadSectionFile (params) {
            var file = params.file,
                fileType = file.type;
            var isJPG = file.type === 'image/jpeg';
            var isLt2M = file.size / 1024 < 100;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                return;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 100KB!');
                return;
            }
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload = () => {
                    var width = image.width;
                    var height = image.height;
                    if (width != 413 || height != 626) {
                        this.$message.error('请上传 二寸 大小的图片');
                        return;
                    }
                };
                image.src = data;
            };
            reader.readAsDataURL(file);
            this.uploadFile(file);
        },
        async uploadFile (file) {
            var formData = new FormData();
            formData.append("school", this.schoolCode);
            formData.append("userId", localStorage.getItem("userId"));
            formData.append("cmd", "file");
            formData.append("fileLengthList", file);
            var res = await api.UploadFile(formData)
            if (res.ResultCode == 1) {
                var fileUrl = res.Value && res.Value.length > 0 ? res.Value[0] : ''
                this.$set(this.editForm, "face", fileUrl)
            } else {
                this.$notify({ type: 'error', message: '上传失败，请重试！', time: 1000 })
            }
        },
        // 切换tab
        changeType () {
            this.pageIndex = 1
            this.getList()
        },
        // 重置
        clickReset () {
            this.searchForm = {
                curNum: "",          //车牌号
                name: "",
                idcard: ""
            }
            this.getList()
        },
        handleClose () {
            this.curEdit = null
            this.dialogVisible = false
        },
        handleSizeChange (val) {
            this.pageSize = val;
            this.getList();
        },
        handleCurrentChange (val) {
            this.pageIndex = val;
            this.getList();
        },
    }
};
</script>

<style lang="scss" scoped>
.key-personnel .m_GenTableBox {
    padding-top: 20px;
    .m_GenCenter {
        margin-top: 5px;
    }
    .minusMargin {
        margin: 0 -20px;
        flex-wrap: wrap;
    }
    .cardItem {
        width: 220px;
        margin: 0 20px 20px;
        position: relative;
        /deep/ .el-card__body {
            padding: 10px;
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
        }
        .cardInfo {
            color: #333;
            font-size: 12px;
            padding: 5px 0;
            .infoItem {
                display: block;
                padding: 3px 0;
                span {
                    color: #808080;
                }
            }
        }
        .btnBox {
            text-align: center;
        }
    }
}
/deep/ .el-dialog__body {
    padding-top: 0;
}
/deep/ .el-form-item {
}
.rule {
    padding-top: 10px;
    .title {
        width: 100px;
        text-align: right;
        padding-right: 12px;
    }
    ul li {
        padding-bottom: 5px;
    }
}
</style>
