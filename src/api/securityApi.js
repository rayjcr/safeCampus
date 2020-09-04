import fetch from "@/utils/fetch";
/*********************安全管理api***************************/ 
// //////////////  老师
// 获取考勤时段列表
export function getTimeperiod_teach(data) {
    return fetch({
        url: "/pa/kqteacher/listTimeperiod",
        method: "get",
        params:data
    });
}
// 获取学校统计信息
export function getStatistics_teach(data) {
    return fetch({
        url: "/pa/kqteacher/statistics",
        method: "get",
        params:data
    });
}
// 获取考勤列表
export function getListPage_teach(data) {
    return fetch({
        url: "/pa/kqteacher/listPage",
        method: "get",
        params:data
    });
}
// 下载Excel
export function downExcel_teach(data) {
    return fetch({
        url: "/pa/kqteacher/downExcel",
        method: "get",
        params:data
    });
}
// //////////////  学生
// 获取考勤时段列表
export function getTimeperiod_stu(data) {
    return fetch({
        url: "/pa/kqstudent/listTimeperiod",
        method: "get",
        params:data
    });
}
// 获取班级统计信息按照年级
export function listClassStatisticsByGrade(data) {
    return fetch({
        url: "/pa/kqstudent/listClassStatisticsByGrade",
        method: "get",
        params:data
    });
}
// 获取年级统计信息按照学校
export function listGradeStatisticsBySchool(data) {
    return fetch({
        url: "/pa/kqstudent/listGradeStatisticsBySchool",
        method: "get",
        params:data
    });
}
// 获取学生考勤列表
export function getListPage_stu(data) {
    return fetch({
        url: "/pa/kqstudent/listPage",
        method: "get",
        params:data
    });
}
// 设置迟到早退预警率
export function setProportion(data) {
    return fetch({
        url: "/pa/kqstudent/setProportion",
        method: "get",
        params:data
    });
}

// 下载Excel
export function downExcel_stu(data) {
    return fetch({
        url: "/pa/kqstudent/downExcel",
        method: "get",
        params:data
    });
}
