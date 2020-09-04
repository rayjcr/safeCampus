<template>
    <div class="page-container guard-schedule">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container  u-flex_row">
                <div class="filters-wapper u-flex u-flex_row">
                    <div class="conditionBox">
                        <span class="filterTit">月份：</span>
                        <el-select
                            v-model="month"
                            size="small"
                            @change="getPlanListByMonth"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in selectMonths"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="m_GenTableBox  u-flex u-flex_row">
                <table class="scheduleTable" border="1" cellspacing="0">
                    <tr>
                        <th class="lineTd">
                            <span style="float: left; margin-top: 20px;">姓名</span>
                            <span style="float: right; margin-top: 0px;">日期</span>
                        </th>
                        <td
                            class="minW"
                            v-for="(n, index) in selectMonths[month ? month : 0]
                                .dayLen"
                            :key="index"
                        >
                            {{ n }}
                        </td>
                    </tr>
                    <tr v-for="(person, index) of personList" :key="index">
                        <th>{{ person.userName }}</th>
                        <td
                            class="minW"
                            v-for="(n, index) in selectMonths[month ? month : 0]
                                .dayLen"
                            :key="index"
                        >
                            <select
                                class="inputArea"
                                v-model="person.states[n - 1]"
                            >
                                <option value="2">早</option>
                                <option value="6">晚</option>
                                <option value="1">休</option>
                                <option value="8">全</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="bottom">
                <el-alert
                    title="班次：早（班）/晚（班）/全（班）/休（息）   巡更：A表示负责巡更，B表示不巡更"
                    type="info"
                    :closable="false"
                    description="注:  早班：7:00 - 19:00  晚班：19:00 - 7:00"
                >
                </el-alert>
                <div class="midBtns">
                    <el-button type="primary" size="small" @click="handleSave"
                        >保存</el-button
                    >
                    <el-button size="small" @click="handleCancel"
                        >关闭</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from "@/api/index.js";
import formatDate from '@/utils/formatDate';

export default {
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),  // 学校代码
            month: '',
            personList: [],
            selectMonths: [{
                label: '1月',
                value: 0,
                dayLen: 31,
            }, {
                label: '2月',
                value: 1,
                dayLen: 28,
            }, {
                label: '3月',
                value: 2,
                dayLen: 31,
            }, {
                label: '4月',
                value: 3,
                dayLen: 30,
            }, {
                label: '5月',
                value: 4,
                dayLen: 31,
            }, {
                label: '6月',
                value: 5,
                dayLen: 30,
            }, {
                label: '7月',
                value: 6,
                dayLen: 31,
            }, {
                label: '8月',
                value: 7,
                dayLen: 31,
            }, {
                label: '9月',
                value: 8,
                dayLen: 30,
            }, {
                label: '10月',
                value: 9,
                dayLen: 31,
            }, {
                label: '11月',
                value: 10,
                dayLen: 30,
            }, {
                label: '12月',
                value: 11,
                dayLen: 31,
            }],
        }
    },
    watch: {},
    mounted () {
        this.getPlanListByMonth();
    },
    methods: {
        // 按月获取安排
        getPlanListByMonth () {
        },
        // 保存
        handleSave () {
            var param = {
                date: '',
                schoolCode: this.schoolCode,
                userWorkStates: []
            };
            var date = new Date();
            date.setMonth(this.month, 1);
            param.date = formatDate(date.getTime(), "yyyy-MM-dd")
            var monthDay = [];
            for (var i = 1; i <= this.selectMonths[this.month].dayLen; i++) {
                monthDay.push(i);
            }
            this.personList.forEach(e => {
                var p = {
                    userId: e.userId,
                    states: e.states,
                    days: monthDay
                }
                param.userWorkStates.push(p)
            })
            api.saveGuarduserpan(param).then(res => {
                if (res.resultCode == 1) {
                    this.$notify({
                        type: 'success',
                        message: '添加成功！',
                        title: '成功'
                    })
                } else {
                    this.$notify({
                        type: 'error',
                        message: res.resultMessage,
                        title: '错误'
                    })
                }
            })
        },
        // 取消
        handleCancel () {
            this.$confirm('是否确定要关闭?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.handleBack()
            }).catch(() => {
            });
        },
    }
}
</script>

<style lang="scss">
.guard-schedule {
    .filter-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .m_GenTableBox {
        display: inline-block;
        margin-top: 20px;

        .scheduleTable {
            width: 100%;
            text-align: center;

            .minW {
                min-width: 20px;
                table-layout: fixed;
                word-break: break-all;
            }

            .inputArea {
                width: 100%;
                height: 100%;
            }

            .lineTd {
                width: 80px;
                background: #fff
                    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=)
                    no-repeat 100% center;
            }
        }
    }

    &.bottom {
        height: auto;
        min-height: 0;
    }

    .midBtns {
        text-align: center;
        margin: 20px 0 0;
    }
}
</style>