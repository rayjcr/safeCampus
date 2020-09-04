<template>
    <div class="page-container u-flex_row index-container">
        <div class="perBox">
            <!-- 学校信息、巡更 -->
            <apatrol-part></apatrol-part>
            <!-- 设备联网 -->
            <equipment-part></equipment-part>
        </div>
        <div class="perBox">
            <!-- 考勤管理 -->
            <attend-chart></attend-chart>
            <!---车辆管理--->
            <car-chart></car-chart>
        </div>
        <div class="perBox">
            <!-- 智能访客 -->
            <visit-chart></visit-chart>
            <!-- 体温检测 -->
            <health-part></health-part>
            <!-- 安防预警 -->
            <safety-cart></safety-cart>
        </div>

        <Recheck :visible.sync="temperature"
            :info="recheckInfo"
            :type="characterType"
            v-on:closeDialog="closeDialog"
        ></Recheck>


    </div>
</template>

<script>
import * as baseApi from "@/api/baseApi.js";
import * as api from "@/api/index.js";
import * as benchApi from "@/api/workBench.js";
import * as securityApi from "@/api/securityApi.js";
import echarts from 'echarts';
import formatDate from '@/utils/formatDate';
import Recheck from '../securityManage/checkTemperature/recheck';
import {AttendChart,ApatrolPart,EquipmentPart,CarChart,VisitChart,HealthPart,SafetyCart} from "./parts/index"
export default {
    components:{
        Recheck,
        AttendChart,ApatrolPart,EquipmentPart,CarChart,VisitChart,HealthPart,SafetyCart
    },
    data () {
        
        return {
            schoolCode: localStorage.getItem("schoolCode"),
            userId: localStorage.getItem("userId"),
            today: '',                  //当前日期  yyyy-mm-dd
        
            lateIcon: '../../../../src/assets/img/nav_images/late.png',  // 迟到的图标
            seriousLateIcon: '../../../../src/assets/img/nav_images/seriousLate.png',   // 严重迟到的图标
            
            temperature:false,          // 首页体温设置弹层
            recheckInfo:{},             // 复检信息
            characterType:'1',           // 人物类型：1：老师，2：学生
        }
    },
    mounted () {
        
    },
    created(){
        var new_date = new Date()
        this.today = formatDate(new_date.getTime(), "yyyy-MM-dd");
        // 测试数据
        this.today = '2020-04-10';
    },
    methods: {
        /**
         * 绘制图表
         * randomNum()为添加一个0-10的随机数，因无数据测试使用,正式场景删除
         */
        judgeCharts(res,chartsObj){
            if(res.resultCode != 1) return false
            // 返回的数据类型是否是数组格式
            if(res.value instanceof Array){
                var statistics = res.value && res.value.length > 0 ? res.value : []
                if (statistics.length < 1) {
                    chartsObj.showLoading({
                        text: '暂无数据',
                        color: '#ffffff',
                        textColor: '#8a8e91',
                        maskColor: 'rgba(255, 255, 255, 0.8)',
                    })
                    return false
                }
            }
            return true
        },
        getChartsInit(chartsObj,chartData){
            // 设置并绘制图表
            chartsObj.hideLoading()
            chartsObj.setOption(chartData);
            window.onresize = function () {
                chartsObj.resize();
            }
        },
        closeDialog(){
            this.temperature = false;
        },
        openHandle(layerName,item){
            this[layerName] = true;
            if(layerName=='temperature'){
                // 如果有班级名称就是学生返回 1 否则为教职工返回 2
                this.characterType = item.className?'1':'2'
                this.recheckInfo = item;
            }
        },
        randomNum(num){
            let baseNum = num||10
            return parseInt(Math.random()*baseNum);
        },
        
    }
}
</script>

<style lang='scss' scoped>
/deep/.index-container {
    min-width: 1200px;
    justify-content: space-between;
    .perBox {
        width: 32.5%;
    }
    .box_h300,
    .box_h200 {
        width: 100%;
        border-radius: 10px;
        background: #fff;
        margin-bottom: 15px;
        padding: 15px 20px 20px;
    }
    .box_h300 {
        height: 307px;
    }
    .box_h200 {
        height: 200px;
    }

    .boxTit {
        width: 100%;
        position: relative;
        line-height: 32px;
        h3 {
            color: #333;
            font-size: 16px;
        }
        .el-select {
            margin: 0 10px;
        }
        .setting {
            font-size: 12px;
            color: #168dff;
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .statisticsInfo {
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e6e6e6;
        justify-content: space-between;
        .statisBox {
            width: 25%;
            text-align: center;
            .tit {
                font-size: 14px;
                height: 32px;
                color: #808080;
                display: block;
                padding: 0 5px;
            }
            .num {
                font-size: 26px;
                color: #333;
                font-weight: bold;
                padding: 10px 0;
            }
        }
    }

    .patrolStatis {
        padding-top: 10px;
        justify-content: space-between;
        .patrolBox {
            width: 32%;
            height: 80px;
            border-radius: 10px;
            font-size: 14px;
            color: #fff;
            text-align: center;
            padding: 10px;
            span {
                clear: both;
                display: block;
                font-size: 26px;
                padding-top: 5px;
            }
            &.bg_1 {
                background: linear-gradient(
                    180deg,
                    rgba(22, 141, 255, 1) 0%,
                    rgba(136, 197, 255, 1) 100%
                );
            }
            &.bg_2 {
                background: linear-gradient(
                    180deg,
                    rgba(41, 220, 158, 1) 0%,
                    rgba(164, 241, 214, 1) 100%
                );
            }
            &.bg_3 {
                background: linear-gradient(
                    180deg,
                    rgba(250, 140, 22, 1) 0%,
                    rgba(255, 204, 149, 1) 100%
                );
            }
        }
    }
    .el-carousel {
        padding: 15px 5px 5px;
        .el-carousel__item {
            background: #fff;
            border-radius: 10px;
            border: 1px solid #e2e2e2;
            padding: 5px 10px;
            box-shadow: 0 0 1px 1px rgba($color: #999, $alpha: 0.2);
            h3 {
                color: #475669;
                font-size: 14px;
                opacity: 0.75;
                line-height: 100px;
            }
            .carouselTit {
                font-size: 14px;
                color: #444;
            }
            .carouseChart {
                width: 100%;
                height: 65px;
                padding-top: 5px;
                .circle {
                    height: 100%;
                    float: left;
                }
                .smLegend {
                    overflow: hidden;
                    padding-left: 30px;
                    .legend {
                        margin: 5px 0;
                        font-size: 12px;
                        color: #808080;
                        position: relative;
                        &.online::after,
                        &.offline::after {
                            content: "\20";
                            position: absolute;
                            top: 8px;
                            left: -10px;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                        }
                        &.online::after {
                            background: #54abff;
                        }
                        &.offline::after {
                            background: #dcdcdc;
                        }
                    }
                }
            }
        }
    }

    .miniTable {
        padding-top: 4px;
        font-size: 12px;
        color: #808080;
        /deep/ td,
        /deep/ th {
            padding: 4px 0;
        }
        /deep/ th {
            color: #333;
            background: #f2f2f2;
        }
        /deep/ td {
            border-bottom: 1px solid #e6e6e6;
        }
        .open{
            color: #168dff;
            cursor: pointer;
        }
    }

    .kqbox {
        width: 100%;
        height: 250px;
    }
    .kqbox200 {
        width: 100%;
        height: 150px;
    }
    .chartsBox {
        width: 100%;
        height: 100%;
    }
    .twTitBox {
        justify-content: space-between;
        padding-bottom: 10px;
    }
    .twCont {
        justify-content: space-between;
        width: 244px;
        .twBox {
            width: 68px;
            height: 53px;
            border-radius: 10px;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            line-height: 20px;
            .addIcon {
                width: 100%;
                height: 100%;
                padding: 6px;
                background-image: url("../../../src/assets/img/temperature.png");
            }

            span {
                display: block;
                font-size: 16px;
            }
            &.bg_1 {
                background-image: linear-gradient(
                    180deg,
                    rgba(22, 141, 255, 1) 0%,
                    rgba(136, 197, 255, 1) 100%
                );
            }
            &.bg_2 {
                background: linear-gradient(
                    180deg,
                    rgba(250, 140, 22, 1) 0%,
                    rgba(255, 204, 149, 1) 100%
                );
            }
            &.bg_3 {
                background: linear-gradient(
                    180deg,
                    rgba(41, 220, 158, 1) 0%,
                    rgba(164, 241, 214, 1) 100%
                );
            }
        }
    }

    .tableData {
        width: 100%;
    }
}
.eqState{
    color: #b2b2b2;
}
.online{
    color: green;
}

</style>
