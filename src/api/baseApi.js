import fetch from "@/utils/fetch";
/*********************基础信息api***************************/ 
// 获取学校信息
export function getSchool(data) {
    return fetch({
        url: "/pa/school/getSchool",
        method: "get",
        params:data
    });
}
// 获取学校学生,老师,安防人员数量
export function getSchoolUserCount(data) {
    return fetch({
        url: "/pa/schoolbase/userCount", 
        method: "get",
        params:data
    });
}









