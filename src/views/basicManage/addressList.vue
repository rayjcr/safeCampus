<template>
    <div class="page-container">
        <div class="u_cardMain u-flex_col">
            <div class="filter-container u-flex_row">
                <div class="u-flex">
                    <el-input size="small" class="w200" v-model="searchName" placeholder="搜索名称" clearable></el-input>
                    <el-button size="small" class="ml10" type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
                </div>
                <div>
                    <router-link :to="'/basicManage/' + goRouter + '/featureCollect'">
                        <el-button size="small" type="primary">人脸采集表</el-button>
                    </router-link>
                    <router-link :to="'/basicManage/' + goRouter + '/RFIDCollect'">
                        <el-button size="small" type="primary">卡号采集表</el-button>
                    </router-link>
                </div>
            </div>
            <div class="m_GenTableBox u-flex u-flex_row">
                <div class="m_GenLeft m_GenLeft_tree u-flex_col">
                    <div class="classTypeListBox u-flex cusMiniScroll">
                        <el-tree
                            ref="departTree"
                            node-key="code"
                            accordion
                            :highlight-current="true"
                            :data="departmentList"
                            :props="defaultProps"
                            @node-click="handleNodeClick"
                        ></el-tree>
                    </div>
                </div>
                <div class="m_GenRight u-flex">
                    <el-table :data="tableData" height="560">
                        <el-table-column label="序号" type="index" width="55"></el-table-column>
                        <el-table-column v-for="(item,index) in colList" :key="index" :label="item.label" :prop="item.prop" :width="item.width" :formatter="item.formatter"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="handleEdit(scope.$index, scope.row)" type="text" size="small">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="pageSize"
                        layout="sizes, prev, pager, next, jumper"
                        :total="pageTotal"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <el-drawer
            class="drawer-message"
            :visible.sync="drawerVisible"
            :withHeader="false"
        >
            <el-form
                class="u-flex"
                disabled
                label-position="left"
                :model="form"
                label-width="70px"
            >
                <div class="visiteBox u-flex_row">
                    <el-image :src="form.avatar" fit="cover"></el-image>
                    <div class="u-flex">
                        <el-form-item>
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" class="sex">
                            <el-select v-model="form.sex">
                                <el-option label="男" value="1"></el-option>
                                <el-option label="女" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div v-if="jurisdictionType == 1">
                    <el-form-item label="工号">
                        <el-input v-model="form.gh"></el-input>
                    </el-form-item>
                    <el-form-item label="部门">
                        <el-cascader
                            v-model="form.departCode"
                            :options="departmentList"
                            :props="defaultProps"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="职称">
                        <!-- <el-select v-model="form.position" placeholder="请选择职称">
                            <el-option v-for="item in position" :key="item.value" :value="item.value"></el-option>
                        </el-select> -->
                    </el-form-item>
                    <el-form-item label="角色">
                        <span>班主任</span>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="form.tel1"></el-input>
                    </el-form-item>
                    <el-form-item label="考勤卡号">
                        <el-input v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item label="人脸照片">
                        <el-image :src="form.photo" fit="cover"></el-image>
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item label="年级">
                        <el-input v-model="form.className"></el-input>
                    </el-form-item>
                    <el-form-item label="学号">
                        <el-input v-model="form.studentId"></el-input>
                    </el-form-item>
                    <el-form-item label="学籍号">
                        <el-input v-model="form.studentId"></el-input>
                    </el-form-item>
                    <el-form-item label="是否住校">
                        <el-select v-model="form.tongXiao">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="考勤卡号">
                        <el-input v-model="form.icCard1"></el-input>
                    </el-form-item>
                    <el-form-item label="人脸照片">
                        <el-image :src="form.photo" fit="cover"></el-image>
                    </el-form-item>
                </div>
            </el-form>
            <!-- <div class="footer-btn">
                <el-button @click="closeEditMessage">取 消</el-button>
                <el-button type="primary">保 存</el-button>
            </div> -->
        </el-drawer>
    </div>
</template>

<script>
import * as api from '@/api/index';
export default {
    data () {
        return {
            jurisdictionType: '1',              //教师1  学生2
            schoolCode: window.localStorage.getItem("schoolCode"),
            userId: window.localStorage.getItem("userId"),
            goRouter: '',
            searchName: '',
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'code'
            },
            departmentList: [],
            tableData: [],
            colList: [],
            pageIndex: 1,               //页码
            pageSize: 10,
            pageTotal: 1,
            multipleSelection: [],
            drawerVisible: false,  // 教师信息编辑
            form: {},
            departCode: [],
            departCodeObj: {},
        }
    },
    created () {
        this.jurisdictionType = this.$route.meta.code == "teacher" ? '1' : '2'
        if (this.jurisdictionType == '1') {
            this.goRouter = 'teacherManage'
            this.colList = [
                { label: '教师姓名', prop: 'name' },
                { label: '性别', prop: 'sex', width: "55", formatter: this.stateFormat },
                { label: '部门', prop: 'departName' },
                { label: '职务', prop: 'zhiwuName' },
                { label: '手机号', prop: 'tel1' },
                { label: '卡号', prop: 'icCard1' },
            ]
        } else {
            this.goRouter = 'studentManage'
            this.colList = [
                {label:'学生姓名',prop:'name'},
                {label:'班级',prop:'className'},
                {label:'班号',prop:'classCode'},
                {label:'性别',prop:'sex', width:"55", formatter:this.stateFormat},
                {label:'是否住校',prop:'tongXiao', width:"85",formatter:this.tongXiaoFormat},
                {label:'考勤卡号',prop:'icCard1'},
            ]
        }
    },
    mounted () {
        this.getTreeList()
        this.getList()
    },
    methods: {
        // 获取部门列表
        async getTreeList () {
            var data = {
                schoolCode: this.schoolCode
            }
            if (this.jurisdictionType == '1') {
                var res = await api.getTeacherDepartment(data)
                var value = res.value ? res.value : []
            } else {
                var res = await api.getGradeClassList(data)
                var value = res.value ? res.value : []
                value.forEach(item => {
                    item.children = item.classList
                })
            }
            this.departmentList = value
        },
        // 获取信息列表
        async getList (code) {
            if (!code) {
                this.$refs.departTree.setCurrentKey(null);
                this.pageIndex = 1
            }
            var data = {
                schoolCode: this.schoolCode,
                name: this.searchName,
                userId: this.userId,
                p: this.pageIndex,
                ps: this.pageSize
            }
            if (this.jurisdictionType == '1') {
                data.departCode = code
                var res = await api.getTeacherList(data)
            } else {
                data.gradeCode = code ? code.grade : ''
                data.classCode = code ? code.class : ''
                var res = await api.getStudentList(data)
            }
            var valData = res.value
            if (!valData) return false;
            this.pageIndex = valData.currentPage
            this.pageTotal = valData.totalCount
            this.tableData = valData.dataList ? valData.dataList : []
        },
        // 性别
        stateFormat (row, column) {
            if (row.sex == 1) {
                return '男'
            } else {
                return '女'
            }
        },
        // 是否住校
        tongXiaoFormat (row, column) {
            return row.tongXiao == '1' ? '是' : '否'
        },
        handleNodeClick (data) {
            this.pageIndex = 1
            this.searchName = ""
            if (this.jurisdictionType == '1') {
                this.departCode = []
                this.loopChild(data)
                this.getList(this.departCode.join("|"))
            } else {
                if (data.children) {
                    var classList = data.children.map(({ code }) => code)
                    var code = {
                        grade: data.code,
                        class: classList.join("|")
                    }
                } else {
                    var code = {
                        grade: data.gradeCode,
                        class: data.code
                    }
                }
                this.departCodeObj = code
                this.getList(code)
            }
        },
        loopChild (data) {
            var code = []
            this.departCode.push(data.code)
            if (data.children) {
                data.children.forEach(item => {
                    if (item.children) this.loopChild(item)
                    else this.departCode.push(item.code)
                })
                return true
            }
            return true
        },
        handleSizeChange (val) {
            this.pageSize = val
            var code = this.jurisdictionType == '1' ? this.departCode.join("|") : this.departCodeObj
            this.getList(code)
        },
        handleCurrentChange (val) {
            this.pageIndex = val
            var code = this.jurisdictionType == '1' ? this.departCode.join("|") : this.departCodeObj
            this.getList(code)

        },
        // 编辑老师信息
        handleEdit (index,row) {
            this.drawerVisible = true;
            this.form = row
            
        },
        closeEditMessage () {
            this.drawerVisible = false;
        },
    }
}
</script>