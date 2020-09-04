<template>
    <div class="app-container safety-warning">
        <div class="u_TableMain flexMain paddingBotClear">
            <div class="filter-container">
                <div class="filters-wapper">
                    <div class="conditionBox">
                        <span class="filterTit">日期</span>
                        <el-date-picker
                            size="small"
                            v-model="valDate"
                            type="daterange"
                            range-separator=""
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                    </div>
                    <div class="conditionBox">
                        <span class="filterTit">预警类型</span>
                        <el-select
                            v-model="valType"
                            size="small"
                            @change="getList(1)"
                            class="w200"
                            clearable
                        >
                            <el-option
                                v-for="item in securityList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="conditionBox">
                        <el-button type="primary">查询</el-button>
                        <el-button>重置</el-button>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox">
                <el-button type="primary mt10" @click="warnSetDrawer"
                    >预警设置</el-button
                >
                <el-button type="mt10">预警大数据</el-button>
                <el-alert
                    class="tipsAlert"
                    :closable="false"
                    title="注：1、行为预警来源于摄像监控设备分析；2、人员预警来源于访客和人脸监控；3、传感预警来源于消防等相应设备；4、事件预警来源于摄像监控设备；"
                    type="info"
                ></el-alert>
                <div class="m_GenLeft fl">
                    <div class="legend">
                        <div class="labelItem">
                            <span></span>
                            行为预警：35% 已处理：12 未处理：5
                        </div>
                        <div class="labelItem">
                            <span></span>
                            人员预警：35% 已处理：12 未处理：5
                        </div>
                        <div class="labelItem">
                            <span></span>
                            传感预警：35% 已处理：12 未处理：5
                        </div>
                        <div class="labelItem">
                            <span></span>
                            事件预警：35% 已处理：12 未处理：5
                        </div>
                    </div>
                    <div class="chartBox">
                        <div id="chartsObj_SECURITY"></div>
                    </div>
                    <ul class="sInfo">
                        <li v-for="(item, index) in securityList" :key="index">
                            {{ item.name + "：" + item.valdata }}
                        </li>
                    </ul>
                </div>
                <div class="m_GenRight">
                    <div class="beforeTable">
                        <el-button type="primary mgAll10" size="small"
                            >导出</el-button
                        >
                        <div class="showNum">
                            <div class="showItem">
                                总人数：
                                <span>{{ securityWarn.allNum }}</span>
                                次
                            </div>
                            <div class="showItem">
                                已录人数：
                                <span>{{ securityWarn.recordedNum }}</span>
                                次
                            </div>
                            <div class="showItem">
                                未录人数：
                                <span>{{ securityWarn.unrecordNum }}</span>
                                次
                            </div>
                        </div>
                    </div>
                    <el-table class="tableBorder" :data="tableData">
                        <el-table-column label="序号" width="50" type="index">
                        </el-table-column>
                        <el-table-column
                            label="预警设备"
                            width="150"
                            prop="name"
                        >
                        </el-table-column>
                        <el-table-column label="预警来源" width="100" prop="ly">
                        </el-table-column>
                        <el-table-column label="区域" width="100" prop="qy">
                        </el-table-column>
                        <el-table-column label="位置" width="100" prop="wz">
                        </el-table-column>
                        <el-table-column
                            label="预警类型"
                            width="80"
                            prop="yjlx"
                        >
                        </el-table-column>
                        <el-table-column
                            label="预警时间"
                            width="150"
                            prop="yjsj"
                        >
                        </el-table-column>
                        <el-table-column label="处理状态" prop="clzt">
                        </el-table-column>
                        <el-table-column label="处理人" prop="clr">
                        </el-table-column>
                        <el-table-column
                            label="处理时间"
                            width="150"
                            prop="clsj"
                        >
                        </el-table-column>
                        <el-table-column label="操作" width="100" fixed="right">
                            <el-button type="primary" size="mini"
                                >修改</el-button
                            >
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <el-drawer
            title="我是标题"
            class="drawer-message"
            :visible.sync="drawerVisible"
        >
            <span>我来啦!</span>
        </el-drawer>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data () {
        return {
            valDate: "",
            valType: "",             // 预警类型   
            jurisdictionType: "",
            drawerVisible: false,   // 预警设置
            securityWarn: {
                allNum: 875,
                recordedNum: 526,
                unrecordNum: 286,
            },
            securityChartsData: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    show: false,
                    left: 0,
                    data: ['行为预警', '人员预警', '传感预警', '事件预警'],
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '31%'],
                        label: {
                            position: 'inner',
                            fontSize: 14,
                            padding: [-50, 0, 0, 0]
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 300, name: '总\n300' },
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '61%'],
                        label: {
                            position: 'inner'
                        },
                        data: [
                            { value: 50, name: '行为预警\n50' },
                            { value: 100, name: '人员预警\n100' },
                            { value: 50, name: '传感预警\n50' },
                            { value: 100, name: '事件预警\n100' },
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['60%', '90%'],
                        label: {
                            position: 'inner'
                        },
                        data: [
                            { value: 15, name: '已处理\n15' },
                            { value: 35, name: '未处理\n35' },
                            { value: 50, name: '已处理\n50' },
                            { value: 50, name: '未处理\n50' },
                            { value: 15, name: '已处理\n15' },
                            { value: 35, name: '未处理\n35' },
                            { value: 50, name: '已处理\n50' },
                            { value: 50, name: '未处理\n50' }
                        ]
                    }
                ]
            },
            securityList: [                  //预警类型
                { name: "行为预警", id: 1, valist: ["打架斗殴", "人员拥挤"] },
                { name: "人员预警", id: 2, valist: ["陌生人", "黑名单", "非法人员", "健康预警"] },
                { name: "传感预警", id: 3, valist: ["烟感检测", "燃气检测", "压力检测", "PM2.5"] },
                { name: "事件预警", id: 4, valist: ["非法入侵", "重点区域", "消防通道占用", "周边区域"] },

            ],
            tableData: [
                { name: '海康DS-IPC-E22H', ly: '监控摄像头', qy: '教学楼', wz: '一楼左侧', yjlx: '周边预警', yjsj: '2020-6-3 11：38', clzt: '已处理', clr: "张三", clsj: "2020-6-3 11：38" },
                { name: '海康DS-IPC-E22H', ly: '监控摄像头', qy: '教学楼', wz: '一楼左侧', yjlx: '周边预警', yjsj: '2020-6-3 11：38', clzt: '已处理', clr: "张三", clsj: "2020-6-3 11：38" },
                { name: '海康DS-IPC-E22H', ly: '监控摄像头', qy: '教学楼', wz: '一楼左侧', yjlx: '周边预警', yjsj: '2020-6-3 11：38', clzt: '已处理', clr: "张三", clsj: "2020-6-3 11：38" },
            ],
            // securityList:[                  //预警类型
            //     {name:"行为预警",id:1,valist:[{name:"打架斗殴",id:"1"},{name:"人员拥挤",id:"2"}]},
            //     {name:"人员预警",id:2,valist:[{name:"陌生人",id:"1"},{name:"黑名单",id:"2"},{name:"非法人员",id:"3"},{name:"健康预警",id:"4"}]},
            //     {name:"传感预警",id:3,valist:[{name:"烟感检测",id:"1"},{name:"燃气检测",id:"2"},{name:"压力检测",id:"3"},{name:"PM2.5",id:"4"}]},
            //     {name:"事件预警",id:4,valist:[{name:"非法入侵",id:"1"},{name:"重点区域",id:"2"},{name:"消防通道占用",id:"3"},{name:"周边区域",id:"4"}]},

            // ]
        }
    },
    mounted () {
        let securityCharts = echarts.init(document.getElementById('chartsObj_SECURITY'));
        securityCharts.setOption(this.securityChartsData);
        this.getInit()
    },
    methods: {
        getInit () {
            this.securityList.forEach(item => {
                this.$set(item, "valdata", item.valist.join("，"))
            })
        },
        getCharts () {
            var data = [
                { value: 50, name: '行为预警', handled: 15, unhandled: 35 },
                { value: 100, name: '人员预警', handled: 50, unhandled: 50 },
                { value: 50, name: '传感预警', handled: 15, unhandled: 35 },
                { value: 100, name: '事件预警', handled: 50, unhandled: 50 }
            ]
            this.securityChartsData = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 0,
                    data: ['行为预警', '人员预警', '传感预警', '事件预警'],
                    formatter: function (name) {
                        var total = 0;
                        var target, handled, unhandled;
                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                target = data[i].value;
                                handled = data[i].handled
                                unhandled = data[i].unhandled
                            }
                        }
                        var arr = [
                            name + '：' + ((target / total) * 100).toFixed(0) + '% 已处理：' + handled + ' 未处理：' + unhandled
                        ]
                        return arr.join('\n')
                    },
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '31%'],
                        label: {
                            position: 'inner',
                            fontSize: 14,
                            padding: [-50, 0, 0, 0]
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 300, name: '总\n300' },
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '61%'],
                        label: {
                            position: 'inner'
                        },
                        data: [
                            { value: 50, name: '行为预警' },
                            { value: 100, name: '人员预警' },
                            { value: 50, name: '传感预警' },
                            { value: 100, name: '事件预警' },
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['60%', '90%'],
                        label: {
                            position: 'inner'
                        },
                        data: [
                            { value: 15, name: '已处理\n15' },
                            { value: 35, name: '未处理\n35' },
                            { value: 50, name: '已处理\n50' },
                            { value: 50, name: '未处理\n50' },
                            { value: 15, name: '已处理\n15' },
                            { value: 35, name: '未处理\n35' },
                            { value: 50, name: '已处理\n50' },
                            { value: 50, name: '未处理\n50' }
                        ]
                    }
                ]
            }

            let securityCharts = echarts.init(document.getElementById('chartsObj'));
            securityCharts.setOption(this.securityChartsData);
        },
        getList () { },
        // 点击“预警设置”按钮显示drawer
        warnSetDrawer () {
            this.drawerVisible = true;
        },
    }
}
</script>

<style lang='scss' scoped>
.chartBox {
    width: 100%;
    height: 350px;
    float: left;
    margin-top: 10px;
    > div {
        width: 350px;
        height: 100%;
        margin: 0 auto;
        position: relative;
    }
}
.m_GenLeft {
    width: 40%;
    padding-right: 20px;
    min-width: 400px;
    min-height: 550px;
    border-right: 1px solid #e2e2e2;
}
.m_GenRight {
    overflow: hidden;
}
.legend {
    font-size: 14px;
    color: #000;
    line-height: 24px;
    .labelItem {
        height: 24px;
        span {
            float: left;
            margin: 1px 10px 0 0;
            width: 30px;
            height: 22px;
        }
        &:nth-child(1) span {
            background: rgb(47, 69, 84);
        }
        &:nth-child(2) span {
            background: rgb(97, 160, 168);
        }
        &:nth-child(3) span {
            background: rgb(212, 130, 101);
        }
        &:nth-child(4) span {
            background: rgb(159, 218, 191);
        }
    }
}
.sInfo {
    color: #101010;
    font-size: 14px;
    line-height: 20px;
}
.dialog_body .tipsAlert {
    margin: 0;
    background: none;
    padding: 0;
}
.box-card {
    border: 1px solid #bbb;
    &.first {
        border-bottom: 0;
    }
    .title {
        width: 60px;
        text-align: center;
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
    }
    .flexBox {
        padding: 5px;
        span {
            display: inline-block;
            width: 80px;
            height: 36px;
            background: #f3f47e;
            text-align: center;
            line-height: 36px;
            margin: 0 5px;
        }
    }
    .opcBox {
        display: flex;
        align-items: center; /* 垂直居中 */
        justify-content: center;
        font-size: 20px;
        i {
            margin-right: 10px;
            color: rgb(64, 158, 255);
        }
    }
}
</style>

<style lang="scss">
.safety-warning {
    .filter-container {
        border-bottom: none;
        padding: 15px 15px 0;

        .filters-wapper {
            display: flex;
            justify-self: start;
            align-items: center;
            padding: 5px 8px;

            .conditionBox {
                float: left;
                margin: 5px 0;
                margin-right: 30px;

                .filterTit {
                    font-weight: 400;
                    font-size: 14px;
                    color: #333;
                    margin-right: 10px;
                }
                .el-range-editor--small.el-input__inner {
                    height: 40px;
                    line-height: 1;
                }
                .el-input--small .el-input__inner {
                    height: 40px;
                    line-height: 1;
                }
            }

            .el-button {
                width: 68px;
                height: 32px;
                line-height: 1;
                padding: 0;
            }
        }
    }

    .m_GenTableBox {
        .el-alert {
            padding: 10px 0 20px;
        }
        .el-alert--info.is-light {
            background-color: #fff;
            color: #808080;
        }

        .el-button {
            width: 96px;
            height: 32px;
            line-height: 1;
            padding: 0;
        }

        .m_GenLeft {
            padding: 20px;
            margin: 0 20px 20px 0;
            border: none;
            border-radius: 10px;
            background: #f2f2f2;
        }
    }

    .beforeTable {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 13px;

        .mgAll10 {
            margin: 0;
        }

        .el-button--primary {
            width: 68px;
            height: 32px;
            font-size: 14px;
            background-color: #21cb5a;
            border-color: #21cb5a;
        }

        .showNum {
            height: 40px;
            width: 88%;
            display: flex;
            justify-content: start;
            align-items: center;
            border: 1px solid #bae7ff;
            border-radius: 4px;
            background: #e6f7ff;
            margin: 0 10px 0 30px;

            .showItem {
                padding: 10px;
                font-size: 14px;
                color: #333;
                font-family: Microsoft YaHei;

                span {
                    color: #168dff;
                }
            }
        }
    }

    .tableBorder {
        /deep/ th {
            color: #333;
            font-weight: 400;
            background: #f2f2f2;
        }

        /deep/ td {
            border-bottom: 1px solid #e6e6e6;
        }

        .el-button {
            width: 68px;
            height: 32px;
            font-size: 14px;
        }
    }

    .drawer-message {
        display: inline-block;

        .el-drawer__header {
            padding: 20px;

            span {
                color: #333;
                font-size: 16px;
                font-weight: bold;
                line-height: 24px;
            }

            .el-drawer__close-btn {
                display: none;
            }
        }
    }
}
</style>