<template>
    <div class="page-container video-monitor">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container">
                <!-- <el-button type="primary" size="small" @click="resetList"
                    >重 置</el-button
                > -->
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft m_GenLeftTree">
                    <div class="school" @click="resetList">
                        {{ schoolName }}
                    </div>
                    <el-tree
                        accordion
                        :data="treeList"
                        :props="defaultProps"
                        :highlight-current="true"
                        @node-click="areaClick"
                    ></el-tree>
                </div>
                <div class="m_GenRight">
                    <div class="w100per">
                        <div
                            v-for="(item, index) in videoList"
                            :key="index"
                            class="imgItem"
                        >
                            <div class="image-container">
                                <img
                                    :src="palyImg"
                                    @click="playVideo(item.code)"
                                />
                            </div>
                            <span class="imgName">{{ item.address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <VideoPlayback
                :visible.sync="videoDialog"
                :code="deviceCode"
                v-on:closeDialog="closeVideoDialog"
            ></VideoPlayback>
        </div>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import playBtn from '@/assets/img/playBtn.png';
import VideoPlayback from './videoPlayback.vue';
import Hls from 'hls.js';

export default {
    components: {
        VideoPlayback
    },
    data () {
        return {
            url: 'http://video.lnxall.com/hls/FJ7BOMY7.m3u8',
            schoolCode: localStorage.schoolCode,    // 学校代码
            schoolName: localStorage.schoolName,    // 学校名称
            palyImg: playBtn,
            videoList: [],    // 视频列表
            treeList: [],     // 位置列表
            selectArea: '',   // 选择的位置
            videoDialog: false,
            deviceCode: '',  // 视频播放对应设备号
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'code'
            },
            pickerOptions: {      // 日期选择今天之后的不可选择
                disabledDate (time) {
                    return time.getTime() > Date.now() - 8.64e6;    //如果没有后面的-8.64e6就是不可以选择今天的
                }
            },
        }
    },
    watch: {},
    mounted () {
        this.getVideo();
        this.getTreeList();
    },
    methods: {
        // 获取学校信息
        getTreeList () {
            api.getDeviceArea({ schoolCode: this.schoolCode }).then(res => {
                var tree = res.value ? res.value : [];
                this.treeList = tree;
            });
        },
        // 获取视频列表
        getVideo () {
            var transferObj = {};
            transferObj.schoolCode = this.schoolCode;
            if (this.selectArea !== '') {
                transferObj.area = this.selectArea;
            }
            api.getVideoList(transferObj).then(res => {
                var videoList = res.value ? res.value : [];
                this.videoList = videoList;
            });
        },
        // 区域选择
        areaClick (data) {
            this.selectArea = data.name;
            this.getVideo();
        },
        // 重置视频列表
        resetList () {
            this.selectArea = '';
            this.getVideo();
        },
        // 打开播放视频
        playVideo (code) {
            this.videoDialog = true;
            this.deviceCode = code;
        },
        // 关闭播放视频
        closeVideoDialog: function (childValue) {
            this.videoDialog = childValue;
        },
    }
}
</script>
<style lang='scss' scoped>
.typeTabs {
    width: 100%;
}
.m_GenRight {
    overflow: hidden;
}
.echartContent {
    width: 100%;
    background: #f2f2f2;
    border-radius: 15px;
    padding: 15px;
}
</style>

<style lang="scss">
.video-monitor {
    .videoPlay {
        width: 300px;
        margin-top: 20px;
        border: 1px solid #333;
    }
    .filter-container {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 15px 25px;

        .filtersBtn {
            margin-right: 25px;
        }
    }

    .m_GenTableBox {
        padding: 10px 20px;
        display: inline-block;

        .m_GenLeft {
            width: 260px;
            min-height: 400px;
            border: none;
            padding: 20px 0;

            .school {
                font-size: 18px;
                margin: 0 20px;
                padding: 10px 0 10px 20px;
            }
            .school:hover {
                background: #e0e0e0;
            }
            .school:focus {
                color: #168dff;
            }
        }

        .m_GenLeftTree {
            margin: 20px 20px 20px 0;
            background: #f2f2f2;
            border-radius: 10px;
            float: left;

            .el-tree {
                margin: 0 20px;

                .is-current {
                    color: #168dff;
                }
            }

            .el-tree-node__content {
                background: #f2f2f2;
            }

            .el-tree-node__content:hover {
                background: #e0e0e0;
            }
        }

        .m_GenRight {
            height: 500px;

            .imgItem {
                float: left;
                padding: 0 40px 20px 0;
                height: 160px;

                .image-container {
                    position: relative;
                    width: 200px;
                    height: 112px;
                    display: block;
                    margin-bottom: 8px;
                    background-image: url("../../../assets/img/school.jpg");

                    img {
                        position: absolute;
                        top: 70px;
                        left: 158px;
                    }
                }

                .imgName {
                    color: #333;
                    font-size: 14px;
                    font-weight: 400;
                }
            }

            .el-pagination {
                display: grid;
            }
        }
    }
}
</style>