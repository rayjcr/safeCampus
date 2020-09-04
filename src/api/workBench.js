import fetch from "@/utils/fetch";

// 获取首页学生体温监测--图表统计
export function getIndexHelthCheckStudentTemperatureStatistics(data) {
  return fetch({
    url: "/pa/helthcheck/getIndexHelthCheckStudentTemperatureStatistics",
    method: "post",
    params: data
  });
}

// 获取首页教师体温监测--图表统计
export function getIndexHelthCheckTeacherTemperatureStatistics(data) {
  return fetch({
    url: "/pa/helthcheck/getHelthCheckTeacherTemperatureStatistics",
    method: "post",
    params: data
  });
}

// 获取巡更统计信息
export function getPatrolDayStatistics(data) {
  return fetch({
    url: "/pa/patrol/getPatrolDayStatistics",
    method: "get",
    params: data
  });
}






