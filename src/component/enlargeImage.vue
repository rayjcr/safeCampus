<template>
    <div class="enlarge-image">
        <el-dialog
            width="640px"
            :title="titleName"
            :visible.sync="enlargeVisible"
            :before-close="closeDialog"
        >
            <div>
                <img :src="imgUrl" class="image" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { putVisitorConfirm } from '@/api/index.js';

export default {
    name: 'SidebarItem',
    props: {
        visible: Boolean,
        type: String,
        imgUrl: String,
    },
    data () {
        return {
            titleName: '',  // 标题名称
            enlargeVisible: false,   // 编辑的弹窗
        }
    },
    watch: {
        visible: {
            handler (newVal, oldVal) {
                this.enlargeVisible = newVal;
            },
            deep: true,
            immediate: true,
        },
        type: {
            handler (newVal, oldVal) {
                if (newVal === "face") {
                    this.titleName = "人脸抓拍照片";
                } else if (newVal === "car") {
                    this.titleName = "车辆抓拍照片";
                }
            },
            deep: true,
            immediate: true,
        },
    },
    mounted () { },
    methods: {
        // 弹窗关闭
        closeDialog () {
            this.enlargeVisible = false;
            this.$emit("closeImg", this.enlargeVisible);
        },
    },
}
</script>

<style lang="scss">
.enlarge-image {
    display: inline-block;
    text-align: center;
    .el-dialog__header {
        padding: 17px 20px 19px;
        background: #f5f7fa;

        border-radius: 3px;

        .el-dialog__title {
            color: #606266;
            font-weight: 400;
        }
    }
    .el-dialog__body {
        padding: 20px;
        border-radius: 3px;

        .image {
            max-width: 600px;
            max-height: 450px;
            border-radius: 5px;
        }
    }
}
</style>