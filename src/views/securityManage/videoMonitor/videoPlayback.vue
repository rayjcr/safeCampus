<template>
    <div class="dialog-form video-playback">
        <el-dialog
            title="监控播放"
            width="524px"
            :visible.sync="dialogVisible"
            :before-close="closeDialog"
        >
            <div>
                <video id="video" class="videoPlay"></video>
                <el-button
                    @click="launchFullscreen"
                    icon="el-icon-full-screen"
                    circle
                ></el-button>
            </div>
            <transition name="fade">
                <loading v-if="isLoading"></loading>
            </transition>
        </el-dialog>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import Hls from 'hls.js';
import Loading from './loading';


export default {
    components: {
        Loading
    },
    props: {
        visible: Boolean,
        code: String,
    },
    data () {
        return {
            schoolCode: localStorage.schoolCode,    // 学校代码
            dialogVisible: false,
            deviceCode: '',
            url: '',
            hls: '',
            isLoading: false,
        }
    },
    watch: {
        code: {
            handler (newVal, oldVal) {
                this.deviceCode = newVal;
            },
        },
        visible (newVal) {
            this.dialogVisible = newVal;
            if(this.dialogVisible === true) {
                this.getVideo();                
            }
        },
        url (newVal) {
            let that = this;
            that.isLoading = true;
            var video = document.getElementById('video');
            if (Hls.isSupported()) {
                //url为空则销毁hls
                if (!newVal) {
                    this.hlsExample.destroy();
                    return;
                }

                var hls = new Hls();
                hls.loadSource(newVal);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_LOADED, function () {
                    console.log("正在加载清单");
                });
                hls.on(Hls.Events.INIT_PTS_FOUND, function () {
                    console.log("开始播放");
                });
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    console.log("开始加载");
                    video.play();
                });
                hls.on(Hls.Events.BUFFER_APPENDED, function () {
                    that.isLoading = false;
                    console.log("缓冲完成");
                });

                hls.on(Hls.Events.ERROR, function (event, data) {
                    //网络错误进行重新加载
                    if (data.type == Hls.ErrorTypes.NETWORK_ERROR && newVal == that.url) {
                        console.log(11111);
                        hls.loadSource(newVal);
                    }
                    //网络较慢，需要缓冲
                    if (data.details == Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                        console.log('正在缓冲');
                    }
                });
                this.hlsExample = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                console.log("url为空");
                //url为空则停止播放
                if (!newVal) {
                    video.stop();
                    return;
                }

                video.src = newVal;
                video.addEventListener('loadedmetadata', function () {
                    video.play();
                });
            }
        }
    },
    mounted () { },
    methods: {
        // 获取实时视频
        getVideo () {
            api.getVideoPlayback({
                schoolCode: this.schoolCode,
                deviceCode: this.deviceCode
            }).then(res => {
                this.url = res.value;
            });
        },
        launchFullscreen () {
            var element = document.getElementById('video');
            //此方法不可以在異步任務中執行，否則火狐無法全屏
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.oRequestFullscreen) {
                element.oRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            } else {
                var docHtml = document.documentElement;
                var docBody = document.body;
                var videobox = document.getElementById('video');
                var cssText = 'width:100%;height:100%;overflow:hidden;';
                docHtml.style.cssText = cssText;
                docBody.style.cssText = cssText;
                videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
                document.IsFullScreen = true;
            }
        },
        // 弹窗关闭
        closeDialog () {
            this.dialogVisible = false;
            console.log("关闭前=",this.url);
            this.url = null;
            console.log("关闭前=",this.url);
            this.$emit("closeDialog", this.dialogVisible);
        },
    },
}
</script>

<style lang="scss">
.video-playback {
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
        border-radius: 8px;
        width: 524px;
        height: 325px;
        padding: 10px 20px 30px;
        position: relative;

        .el-button {
            border: none;
            float: right;
            position: relative;
            bottom: 50px;
            background-color: transparent;
            i {
                font-size: 30px;
                color: #fff;
            }
        }

        .el-button:hover {
            background-color: transparent;
        }
    }

    .videoPlay {
        width: 100%;
        margin-top: 10px;
        border: 1px solid #f2f2f2;
        border-radius: 4px;
    }

    .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;

        i {
            width: 50px;
            height: 50px;
        }
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
}
</style>