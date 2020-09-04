<template>
    <div class="box_h300">
        <div class="boxTit"><h3>设备联网</h3></div>
        <el-carousel indicator-position="none" :autoplay="false" :interval="4000" type="card" height="100px">
            <el-carousel-item v-for="(item, index) in equipmentType" :key="index">
                <div class="carouselTit">
                    <span>{{ item.eqName }} :</span>
                    <span>{{ item.eqValue }}</span>
                </div>
                <div class="carouseChart">
                    <el-progress class="circle" type="circle" :width="60" :percentage="randomNum(100)"></el-progress>
                    <div class="smLegend">
                        <div class="legend online">在线</div>
                        <div class="legend offline">不在线</div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>

        <el-table class="miniTable" height="130" :data="equipmentList">
            <el-table-column :show-overflow-tooltip="true" label="设备名称">
                <template slot-scope="scope">
                    {{scope.row.typeName||'考勤设备'}}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="安装位置">
                <template slot-scope="scope">
                    {{getEquipmentArea(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="70">
                <template slot-scope="scope">
                    <span class="eqState" :class="{'online':scope.row.online}">{{scope.row.online?'在线':'离线'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                    <span v-if='!scope.row.online' class="open" @click="openHandle('equipment',scope.row)">待处理</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import * as api from "@/api/index.js";
export default {
    name:"Equipment", 
    data () {
        return {
            equipmentType: [
                {
                    eqName: "普通摄像头",
                    eqValue: this.randomNum(40),
                },
                {
                    eqName: "人脸抓拍机",
                    eqValue: this.randomNum(),
                },
                {
                    eqName: "卫星摄像头",
                    eqValue: this.randomNum(),
                },
            ],
            equipmentList:[],
        }
    },
    created(){
        this.getEquipmentList()
    },
    methods:{
        /**
         * 获取设备联网区域接口
         * 1.getEquipmentList 获取设备管理列表
         * 2.getEquipmentArea 获取设备的具体位置
         */
        async getEquipmentList(){
            var data = {
                schoolCode: this.$parent.schoolCode
            }
            let res = await api.getDeviceManage(data)
            this.equipmentList = res.value;
        },
        getEquipmentArea(item){
            if(item.address){
                if(item.area){
                    return item.address + "-" + item.area
                }else{
                    return item.address
                }
            }else{
                return "未知位置"
            }
        },
        randomNum(){
            return this.$parent.randomNum()
        },
        openHandle(layerName,item){
            return this.$parent.openHandle(layerName,item)
        }
    }
}
</script>