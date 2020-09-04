import fetch from "@/utils/fetch";

export function login(data) {
  return fetch({
    url: "/pa/auth/login",
    method: "post",
    params: data
  });
}
export function loginTicket(data) {
  return fetch({
    url: "/pa/auth/ticket",
    method: "post",
    params: data
  });
}
export function loginOut(token) {
  return fetch({
    url: "/pa/auth/loginOut",
    method: "post",
    params: { token }
  });
}

// 查询菜单
export function getMenus(token) {
  return fetch({
    url: "/pa/menu/list",
    method: "get",
    params: { token }
  });
}
export function getInfo(token) {
  return fetch({
    url: "/api/admin/user/front/info",
    method: "get",
    params: { token }
  });
}

// 获取设备管理列表
export function getDeviceManage(data) {
  return fetch({
    url: "/pa/mathine/getMathineList",
    method: "get",
    params: data
  });
}
// 修改设备管理
export function editDeviceManage(data) {
  return fetch({
    url: "/pa/mathine/updateMathine",
    method: "get",
    params: data
  });
}
// 获取设备管理详情
export function detailDeviceManage(data) {
  return fetch({
    url: "/pa/mathineprocess/listPage",
    method: "get",
    params: data
  });
}
// 待处理设备管理
export function processDeviceManage(data) {
  return fetch({
    url: "/pa/mathineprocess/addlog",
    method: "post",
    params: data
  });
}
// 获取设备类型
export function getDeviceType(data) {
  return fetch({
    url: "/pa/mathine/getMathineTypeList",
    method: "get",
    params: data
  });
}
// 获取设备区域
export function getDeviceArea(data) {
  return fetch({
    url: "/pa/mathine/getAreaList",
    method: "get",
    params: data
  });
}
// 获取设备位置
export function getDeviceAddress(data) {
  return fetch({
    url: "/pa/mathine/getAddressList",
    method: "get",
    params: data
  });
}

// 获取教师信息列表
export function getDepartmentTeacherList(data) {
  return fetch({
    url: "/pa/teacher/getDepartmentTeacherList",
    method: "get",
    params: data
  });
}
export function getTeacherList(data) {
  return fetch({
    url: "/pa/teacher/getTeacherList",
    method: "get",
    params: data
  });
}

// 部门信息
export function getTeacherDepartment(data) {
  return fetch({
    url: "/pa/department/getDepartmentList",
    method: "get",
    params: data
  });
}
// 获取教师部门树
export function getDepartmentTreeList(data) {
  return fetch({
    url: "/pa/department/getDepartmentTreeList",
    method: "get",
    params: data
  });
}

/**********   卡片采集   **********/
// 获取卡片学生采集列表
export function getRFIDStudentList(data) {
  return fetch({
    url: "/pa/rfid/studentCollectPage",
    method: "get",
    params: data
  });
}
// 获取卡片学生采集--图表年级采集数据
export function getRFIDStudentGrade(data) {
  return fetch({
    url: "/pa/rfid/studentCollectStatisticsByGrade",
    method: "get",
    params: data
  });
}
// 获取卡片学生采集--图表班级采集数据
export function getRFIDStudentClass(data) {
  return fetch({
    url: "/pa/rfid/studentCollectStatisticsByClass",
    method: "get",
    params: data
  });
}
// 获取卡片学生采集--采集数量
export function getRFIDStudentNum(data) {
  return fetch({
    url: "/pa/rfid/studentCollectStatistics",
    method: "get",
    params: data
  });
}
// 获取卡片学生采集--导出页面
export function exportRFIDStudent(data) {
  return fetch({
    url: "/pa/rfid/studentCollectExport",
    method: "get",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    params: data
  });
}

// 获取卡片教师采集列表
export function getRFIDTeacherList(data) {
  return fetch({
    url: "/pa/rfid/teacherCollectPage",
    method: "get",
    params: data
  });
}
// 获取卡片教师采集--图表部门数据
export function getRFIDTeacherDepartment(data) {
  return fetch({
    url: "/pa/rfid/teacherCollectStatisticsByDepartment",
    method: "get",
    params: data
  });
}
// 获取卡片教师采集--采集数量
export function getRFIDTeacherNum(data) {
  return fetch({
    url: "/pa/rfid/teacherCollectStatistics",
    method: "get",
    params: data
  });
}
// 获取卡片教师采集--导出页面
export function exportRFIDTeacher(data) {
  return fetch({
    url: "/pa/rfid/teacherCollectExport",
    method: "get",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    params: data
  });
}

/**********   智能访客   **********/
// 获取智能访客列表
export function getSmartVisitorList(data) {
  return fetch({
    url: "/pa/visit/visitLeavePageQuery",
    method: "get",
    params: data
  });
}

// 获取智能访客--不同访客人数
export function getDifferentVisitor(data) {
  return fetch({
    url: "/pa/visit/visitLeaveCountStatistics",
    method: "get",
    params: data
  });
}
// 获取智能访客--图表--来访人数展示
export function getVisitorTypeNum(data) {
  return fetch({
    url: "/pa/visit/visitStatusCountByTypeDayStatistics",
    method: "get",
    params: data
  });
}
// 智能访客--导出按钮
export function getVisitorExport(data) {
  return fetch({
    url: "/pa/visit/visitExport",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    method: "get",
    params: data
  });
}
// 智能访客--访客确认
export function putVisitorConfirm(data) {
  return fetch({
    url: "/pa/visit/confirm",
    method: "put",
    data
  });
}
// 智能访客--访客离开
export function putVisitorLeave(id, data) {
  return fetch({
    url: `/pa/visit/leave/${id}`,
    method: "put",
    data
  });
}

// 获取人脸抓拍卡片列表
export function getFaceSnapList(data) {
  return fetch({
    url: "/pa/userarrestlog/getUserArrestLogPage",
    method: "post",
    data
  });
}
// 人脸抓拍--新增黑白名单
export function addFaceList(data) {
  return fetch({
    url: "/pa/userarrestlog/checkToUserLimitTable",
    method: "get",
    params: data
  });
}

// 获取车辆抓拍卡片列表
export function getCarSnapList(data) {
  return fetch({
    url: "/pa/cararrestlog/getCarArrestLogPage",
    method: "post",
    data
  });
}
// 车辆抓拍--新增黑白名单
export function addCarList(data) {
  return fetch({
    url: "/pa/cararrestlog/checkToUserLimitTable",
    method: "get",
    params: data
  });
}

/**********  视频监控    **********/
// 获取视频列表
export function getVideoList(data) {
  return fetch({
    url: "/pa/monitor/live",
    method: "get",
    params: data
  });
}
// 获取实时画面
export function getVideoPlayback(data) {
  return fetch({
    url: "/pa/monitor/livePlay",
    method: "get",
    params: data
  });
}

/**********  车辆管理    **********/
// 获取车辆管理列表
export function getCarManageList(data) {
  return fetch({
    url: "/pa/cararrestlog/carInAndOutRecordPageByDay",
    method: "get",
    params: data
  });
}
// 导出车辆管理列表
export function exportCarManageList(data) {
  return fetch({
    url: "/pa/cararrestlog/carInAndOutRecordByDayExport",
    method: "get",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    params: data
  });
}
// 获取车辆管理图表
export function getCarManageEcharts(data) {
  return fetch({
    url: "/pa/cararrestlog/carArrestLogCountStatistics",
    method: "get",
    params: data
  });
}
// 获取滞留车辆数量
export function getStrandedCarNum(data) {
  return fetch({
    url: "/pa/vehicle/totalOccupyParkingPlace",
    method: "get",
    params: data
  });
}
// 修改滞留车辆数量
export function editStrandedCarNum(data) {
  return fetch({
    url: "/pa/vehicle/totalOccupyParkingPlace",
    method: "put",
    params: data
  });
}
// 获取预警设置
export function getParkingLot(data) {
  return fetch({
    url: "/pa/vehicle/parkingAreaWarning",
    method: "get",
    params: data
  });
}
// 修改预警设置
export function editParkingLot(data) {
  return fetch({
    url: "/pa/vehicle/parkingAreaWarning",
    method: "put",
    data
  });
}

/**********  体温监测    **********/
// 获取检查项目
export function getTemCheckList(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckDaySetting",
    method: "post",
    params: data
  });
}
// 获取隔离点
export function getIsolatedPoint(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckQuarantine",
    method: "post",
    params: data
  });
}
// 获取学生体温监测--分页列表
export function getTemStudentList(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckStudentPage",
    method: "post",
    data
  });
}
// 获取学生体温监测--导出
export function exportTemStudent(data) {
  return fetch({
    url: "/pa/helthcheck/exportHelthCheckStudentTemperature",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    method: "post",
    params: data
  });
}
// 获取学生体温监测--图表统计
export function getTemStudentCharts(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckStudentTemperatureStatistics",
    method: "post",
    params: data
  });
}
// 获取学生体温监测--复检
export function getTemStudentRecheck(data) {
  return fetch({
    url: "/pa/helthcheck/addHelthCheckStudentReviewe",
    method: "post",
    data
  });
}
// 获取学生体温监测--详情
export function getTemStudentDetail(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckStudentRevieweList",
    method: "post",
    params: data
  });
}

// 获取教师体温监测--分页列表
export function getTemTeacherList(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckTeacherPage",
    method: "post",
    data
  });
}
// 获取教师体温监测--导出
export function exportTemTeacher(data) {
  return fetch({
    url: "/pa/helthcheck/exportHelthCheckTeacherTemperature",
    responseType: "arraybuffer", // 下载导出,返回一个流形式的文件
    method: "post",
    params: data
  });
}
// 获取教师体温监测--图表统计
export function getTemTeacherCharts(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckTeacherTemperatureStatistics",
    method: "post",
    params: data
  });
}
// 获取教师体温监测--复检
export function getTemTeacherRecheck(data) {
  return fetch({
    url: "/pa/helthcheck/addHelthCheckTeacherReviewe",
    method: "post",
    data
  });
}
// 获取教师体温监测--详情
export function getTemTeacherDetail(data) {
    return fetch({
    url: "/pa/helthcheck/getHelthCheckTeacherRevieweList",
    method: "post",
    params: data
    });
}


/**********   巡更系统   **********/
// 获取日常巡更列表
export function getDailyPatrolList(data) {
    return fetch({
        url: "/pa/patrol/getPatrolDayList",
        method: "post",
        params: data
    });
}
// 获取日常巡更报表
export function getDailyPatrolReport(data) {
    return fetch({
        url: "/pa/patrol/getPatrolDayStatistics",
        method: "get",      
        params: data
    });
}
// 导出日常巡更列表
export function exportDailyPatrolList(data) {
    return fetch({
        url: "/pa/patrol/downpatroldaytasklist",
        method: "get",      
        responseType: "arraybuffer",
        params: data
    });
}
// 添加巡更设备绑定
export function getPatrolDevice(data) {
    return fetch({
        url: "/pa/patrol/addPatrolDevice",
        method: "post",
        params: data
    });
}
// 添加巡更信息
export function getPatrolTask(data) {
    return fetch({
        url: "/pa/patrol/addpatroltask",
        method: "post",
        params: data
    });
}

/*****************学校相关信息*******************/

export function getXuenian(data) {
  return fetch({
    url: "/pa/xuenian/getXuenian",
    method: "get",
    params: data
  });
}
// 获取年级列表
export function getGradeList(data) {
  return fetch({
    url: "/pa/grade/getGradeList",
    method: "get",
    params: data
  });
}
export function getGradeClassList(data) {
  return fetch({
    url: "/pa/grade/getGradeClassList",
    method: "get",
    params: data
  });
}
// 获取班级列表,根据用户权限
export function getClassList_auth(data) {
  return fetch({
    url: "/pa/xclass/getClassList",
    method: "get",
    params: data
  });
}
// 查询班级信息列表
export function getClassList(data) {
  return fetch({
    url: "/pa/xclass/list",
    method: "get",
    params: data
  });
}
// 获取学生信息列表
export function getStudentList(data) {
  return fetch({
    url: "/pa/student/getStudentList",
    method: "get",
    params: data
  });
}
// 获取班级学生信息列表
export function getClassStudentList(data) {
  return fetch({
    url: "/pa/classuser/getClassStudentList",
    method: "get",
    params: data
  });
}
// 获取部门列表
export function getDepartmentList(data) {
  return fetch({
    url: "/pa/department/getDepartmentList",
    method: "get",
    params: data
  });
}
// 获取学校的预警项目
export function getWarngSchoolList(data) {
  return fetch({
    url: "/pa/warnschool/getWarngList",
    method: "get",
    params: data
  });
}
// 获取用户的预警项目
export function getWarngUserList(data) {
  return fetch({
    url: "/pa/warnuser/getWarngList",
    method: "get",
    params: data
  });
}
// 设置用户预警项目
export function setWarningUserCategorys(data) {
  return fetch({
    url: "/pa/warnuser/setWarningCategorys",
    method: "get",
    params: data
  });
}

/*****************用户人脸*******************/

// 获取学生人脸信息
export function getStudentFaceList(data) {
  return fetch({
    url: "/pa/relativeface/getStudentFaceList",
    method: "get",
    params: data
  });
}
// 获取学生人脸统计信息
// 获取学生人脸统计信息：返回班级接口
export function getStudentFaceStatisticsTreeClass(data) {
  return fetch({
    url: "/pa/relativeface/getStudentFaceStatisticsTreeClass",
    method: "get",
    params: data
  });
}

// 获取学生人脸统计信息:返回年级结构
export function getStudentFaceStatisticsTreeGrade(data) {
  return fetch({
    url: "/pa/relativeface/getStudentFaceStatisticsTreeGrade",
    method: "get",
    params: data
  });
}
// 获取教师人脸信息
export function getTeacherFaceList(data) {
  return fetch({
    url: "/pa/relativeface/getTeacherFaceList",
    method: "get",
    params: data
  });
}
// 获取教师人脸统计信息
export function getTeacherFaceStatistics(data) {
  return fetch({
    url: "/pa/relativeface/getTeacherFaceStatistics",
    method: "get",
    params: data
  });
}
// 获取消息推送列表
export function listMessagePushed(data) {
  return fetch({
    url: "/pa/safety/message/listMessagePushed",
    method: "get",
    params: data
  });
}
// 获取消息列表
export function safetyListMessages(data) {
  return fetch({
    url: "/pa/safety/message/listMessages",
    method: "get",
    params: data
  });
}
// 获取消息处理统计
export function safetyStaticsList(data) {
  return fetch({
    url: "/pa/safety/message/staticsList",
    method: "get",
    params: data
  });
}
// 获取安防人员列表
export function getGuarduserPage(data) {
  return fetch({
    url: "/pa/guarduser/page",
    method: "get",
    params: data
  });
}
// 获取安防人员统计
export function getGuarduserStatistics(data) {
  return fetch({
    url: "/pa/guarduser/statistics",
    method: "get",
    params: data
  });
}
// 添加安防人员
export function addGuarduser(data) {
  return fetch({
    url: "/pa/guarduser/add",
    method: "get",
    params: data
  });
}
// 删除安防人员
export function removeGuarduser(data) {
  return fetch({
    url: "/pa/guarduser/remove",
    method: "get",
    params: data
  });
}
// 导出安防人员
export function downGuarduser(data) {
  return fetch({
    url: "/pa/guarduser/down",
    method: "get",
    responseType: "arraybuffer",
    params: data
  });
}
// 保存工作安排
export function saveGuarduserpan(data) {
  return fetch({
    url: "/pa/guarduserpan/save",
    method: "post",
    data
  });
}

// 获取安排列表
export function getGuarduserpan(data) {
  return fetch({
    url: "/pa/guarduserpan/listMonth",
    method: "get",
    params: data
  });
}

/*********重点人员管理 **********************/
// 分页获取黑白名单信息
export function getUserLimitTablePage(data) {
  return fetch({
    url: "/pa/userlimit/getUserLimitTablePage",
    method: "post",
    data
  });
}
// 删除黑白名单
export function deleteUserLimitTable(data) {
  return fetch({
    url: "/pa/userlimit/deleteUserLimitTable",
    method: "get",
    params: data
  });
}
// 获取黑白名单信息
export function getUserLimitTableInfo(data) {
  return fetch({
    url: "/pa/userlimit/getUserLimitTableInfo",
    method: "get",
    params: data
  });
}
// 修改黑白名单
export function updateUserLimitTable(data) {
  return fetch({
    url: "/pa/userlimit/updateUserLimitTable",
    method: "post",
    data
  });
}
// 新增黑白名单
export function addUserLimitTable(data) {
  return fetch({
    url: "/pa/userlimit/addUserLimitTable",
    method: "post",
    data
  });
}

// 上传
import { urlFun } from "@/utils/utils";
export function UploadFileV3(data) {
  return fetch({
    url: "http://i.yd-jxt.com/v1/rat/UploadFileV3",
    method: "post",
    headers: {
      headers: "MultPart-Author-Key",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    data: {
      json: urlFun(data)
    }
  });
}
export function UploadFile(data) {
  return fetch({
    url: "http://i.yd-jxt.com/v1/rat/UploadFile",
    method: "post",
    data
  });
}
