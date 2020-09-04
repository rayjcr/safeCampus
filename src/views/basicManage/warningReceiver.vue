<template>
    <div class="page-container">
        <div class="u_cardMain u-flex_col">
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft m_GenLeft_tree u-flex_col">
                    <div class="classTypeListBox u-flex cusMiniScroll">
                        <!-- <el-tree ref="departTree" node-key="code" show-checkbox accordion
                            :highlight-current="true" :props="defaultProps" lazy :load="loadNode"
                            @node-click="handleNodeClick" @check="handleCurrentCheck"></el-tree> -->
                        <el-tree ref="departTree" node-key="code" accordion
                            :highlight-current="true" :props="defaultProps" lazy :load="loadNode"
                            @node-click="handleNodeClick" @check="handleCurrentCheck"></el-tree>
                    </div>
                </div>
                <div class="m_GenRight u-flex_col u-flex">
                    <div class="title">{{curDepart.name}}</div>
                    <el-alert class="tipsAlert" title="注：固定“预警接收人员： 1、预警消息接收人； 2、预警处理操作人；3、迟到率/早退率预警，默认通知班主任；4、体温异常预警，默认通知班主任”；" type="warning"></el-alert>
                    <div class="u-flex">
                        <div class="u-checkAllbox" v-for="(categroy, index) in categoryList" :key="index">
                            <el-checkbox class="title" :indeterminate="categroy.isIndeterminate" v-model="categroy.checkAll" @change="handleCheckAllChange($event,index)">{{categroy.name}}</el-checkbox>
                            <el-checkbox-group class="checkCard" v-model="checkedModel[index]" @change="handleCheckedChange($event,index)">
                                <el-checkbox v-for="(item,itemInd) in categroy.children" :label="item.id" :key="itemInd">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="m_GenBottom">
                        <el-button size="small" type="primary" @click="clickSure">确认</el-button>
                        <el-button size="small" type="primary" @click="clickCancel">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/index';
export default {
    data () {
        return {
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            departmentList:[],
            departCode:[],
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'code',
                isLeaf: 'leaf'
            },
            curDepart:{},
            defaultExpandKeys:[],
            checkedModel:[],
            categoryList:[],
            resolve:[],
            isLoad: false,
            initCheckedModel:[],                //获取的初始化
        }
    },  
    created () {
        this.getList()
    },
    mounted () { 
    },
    methods:{
        async getDepartmentTreeList(resolve){
            var data = {
                schoolCode: this.schoolCode
            }
            var res = await api.getDepartmentTreeList(data);  
            var val = res.value?res.value:[]
            // this.defaultExpandKeys = []
            // this.defaultExpandKeys.push(val[0].code)
            resolve(val)
        },
        loadNode(node, resolve){
            if (node.level === 0) {
                this.getDepartmentTreeList(resolve)
            }
            if(node.level >= 1){
                var treeData = node.data
                if(!treeData.children||treeData.children.length<1){  
                    this.getDepartmentTeacherList(node.data,resolve)
                }   
                else{
                    resolve(treeData.children)

                }
                
            }
        },
        async getDepartmentTeacherList(treeData,resolve){
            var data = {
                schoolCode: this.schoolCode,
                departCode: treeData.code
            }
            var res = await api.getDepartmentTeacherList(data);  
            var val = res.value?res.value:[]
            val.forEach(item => {
                item.leaf = true
                item.code = item.teacherId
            })
            treeData.children = val
            // if(treeData.code == this.defaultExpandKeys[0]){
            //     this.$refs.departTree.setCheckedKeys([val[0].code]);
            // }
            if(this.isLoad){
                this.$nextTick(() => {
                    this.$refs.departTree.setChecked(treeData.code,true,true)
                })
            }
            this.isLoad = false
            resolve(val)
        },
        async getList(){
            var data = {
                schoolCode: this.schoolCode
            }
            var res = await api.getWarngSchoolList(data);  
            var val = res.value?res.value:[]
            this.categoryList = val
            this.categoryList.forEach(item => {
                this.checkedModel.push([])
                this.$set(item,'checkAll',false)
                this.$set(item,'isIndeterminate',false)
            })
        },
        async handleNodeClick(item){
            if(item.teacherId){
                var data = {
                    schoolCode: this.schoolCode,
                    userId: item.teacherId
                }
                var res = await api.getWarngUserList(data);  
                var val = res.value?res.value:[]
                this.checkedModel = []

                var selList = []
                val.forEach(valItem => {
                    let flag = selList.find(a => a.warnParentCode === valItem.warnParentCode)
                    if (!flag) {
                        selList.push({
                            warnParentCode: valItem.warnParentCode,
                            children: [valItem.warnCode]
                        })
                    } else {
                        flag.children.push(valItem.warnCode)
                    }
                })
                
                this.categoryList.forEach((valItem,index) => {
                    this.checkedModel.push([])
                    valItem.checkAll = false
                    valItem.isIndeterminate = false
                    let flag = selList.find(a => a.warnParentCode === valItem.id)
                    if(flag){
                        this.checkedModel[index] = flag.children
                        this.handleCheckedChange(flag.children,index)
                    }
                        
                })
                this.initCheckedModel = _.clone(this.checkedModel)
                this.curDepart = item
            }
        },
        handleCurrentCheck(data){
            if((data.children && data.children.length<1)){
                var curNode = this.$refs.departTree.store.nodesMap[data.code]           //获取当前选中的节点node
                this.isLoad = true
                curNode.loadData()          //懒加载
            }
        },
        getCheckedNode(data){
            // console.log(data,"getCheckedNode")

        },
        handleCheckAllChange(val,index){
            this.checkedModel[index] = val ? this.categoryList[index].children.map(({id}) => id) : [];
            this.categoryList[index].isIndeterminate = false;
        },
        handleCheckedChange(value,index){
            let checkedCount = value.length;
            this.categoryList[index].checkAll = checkedCount === this.categoryList[index].children.length;
            this.categoryList[index].isIndeterminate = checkedCount > 0 && checkedCount < this.categoryList[index].children.length;
        },
        async clickSure(){
            // var curDepartAll = this.$refs.departTree.getCheckedKeys()
            // var curDepart = this.$refs.departTree.getCheckedKeys({leafOnly:false})
            if(JSON.stringify(this.curDepart) == '{}'){
                this.$notify({title:"提示",message:"请选择预警接收人员",type:"error"});
                return false
            }
            var warnCodeList = [].concat(...this.checkedModel)              //多维数组转一维数组
            var data = {
                schoolCode: this.schoolCode,
                userId: this.curDepart.teacherId,
                warnCode:warnCodeList.join("|"),
            }
            var res = await api.setWarningUserCategorys(data);  
            this.$notify({title:"成功",message:"设置成功",type:"success"});
            this.initCheckedModel = _.clone(this.checkedModel)
        },
        clickCancel(){
            this.checkedModel = this.initCheckedModel
        },
    }
}
</script>