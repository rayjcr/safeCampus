import Vue from "vue";
import Router from "vue-router";

import Layout from "@/views/layout/Layout";
import AppMain from "@/views/layout/AppMain";
const _import = require("./_import_" + process.env.NODE_ENV);

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export const constantRouterMap = [
  {
    path: "/login",
    name: "登录系统",
    component: _import("login")
  },
  {
    path: "/",
    component: Layout,
    redirect: "/safeCampus",
    name: "工作台",
    hidden: true,
    children: [
      {
        path: "safeCampus",
        component: _import("workBench/index")
      }
    ]
  },
];

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: "/basicManage",
    component: Layout,
    name: "基础管理",
    children: [
      {
        path: "studentManage",
        name: "班级管理",
        component: AppMain,
        parent: "basicManage",
        children: [
          {
            path: "address",
            component: _import("basicManage/addressList"),
            name: "学生信息",
            meta: {
              code: "student"
            }
          },
          {
            path: "featureCollect",
            component: _import("basicManage/featureCollect"),
            name: "人脸采集表",
            meta: {
              code: "student"
            }
          },
          {
            path: "RFIDCollect",
            component: _import("basicManage/RFIDCollect"),
            name: "卡号采集表",
            meta: {
              code: "student"
            }
          }
        ]
      },
      {
        path: "teacherManage",
        name: "教师管理",
        component: AppMain,
        parent: "basicManage",
        children: [
          {
            path: "address",
            component: _import("basicManage/addressList"),
            name: "教师信息",
            meta: {
              code: "teacher"
            }
          },
          {
            path: "featureCollect",
            component: _import("basicManage/featureCollect"),
            name: "人脸采集",
            meta: {
              code: "teacher"
            }
          },
          {
            path: "RFIDCollect",
            component: _import("basicManage/RFIDCollect"),
            name: "卡号采集表",
            meta: {
              code: "teacher"
            }
          }
        ]
      },
      {
        path: "deviceManage",
        component: _import("basicManage/deviceManage/index"),
        name: "设备管理"
      },
      {
        path: "warningReceiver",
        component: _import("basicManage/warningReceiver"),
        name: "预警接收人员"
      }
    ]
  },
  {
    path: "/safetyManage",
    component: Layout,
    name: "安防管理",
    children: [
      {
        path: "safetyWarning",
        component: _import("safetyManage/safetyWarning"),
        name: "安防预警"
      },
      {
        path: "record",
        component: _import("safetyManage/record"),
        name: "预警消息记录"
      },
      {
        path: "civilDefense",
        component: _import("safetyManage/civilDefense"),
        name: "人防管理"
      }
    ]
  },
  {
    path: "/securityManage",
    component: Layout,
    name: "安全管理",
    children: [
      {
        path: "attendSys",
        name: "考勤管理",
        component: AppMain,
        parent: "securityManage",
        children: [
          {
            path: "attendteach",
            component: _import("securityManage/attendSys/index"),
            name: "教师考勤",
            meta: {
              code: "teacher"
            }
          },
          {
            path: "attendstu",
            component: _import("securityManage/attendSys/index"),
            name: "学生考勤",
            meta: {
              code: "student"
            }
          }
        ]
      },
      {
        path: "smartVisitor",
        name: "智能访客",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/smartVisitor/index")
      },
      {
        path: "realTimeMonitor",
        name: "视频监控系统",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/videoMonitor/index")
        //   children: [
        //     {
        //       path: "realTimeMonitor",
        //       component: _import("securityManage/videoMonitor/realTimeMonitor"),
        //       name: "实时监控"
        //     }
        //   ]
      },
      {
        path: "faceCaptureSys",
        name: "人脸抓拍系统",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/faceCaptured/index")
      },
      {
        path: "carCaptureSys",
        name: "车辆抓拍系统",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/carCaptured/index")
      },
      {
        path: "keyPersonSys",
        name: "重点人员管理",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/keyPersonnel/index")
      },
      {
        path: "carManagement",
        name: "车辆管理",
        component: AppMain,
        parent: "securityManage",
        component: _import("securityManage/carManagement/index")
      },
      {
        path: "checkTemperature",
        name: "体温检测",
        component: AppMain,
        parent: "securityManage",
        children: [
          {
            path: "temperature",
            component: _import("securityManage/checkTemperature/index"),
            name: "学生体温",
            meta: {
              code: "student"
            }
          },
          {
            path: "featureCollect",
            component: _import("securityManage/checkTemperature/index"),
            name: "教师体温",
            meta: {
              code: "teacher"
            }
          }
        ]
      },
      {
        path: "patrollingSystem",
        name: "巡更系统",
        component: AppMain,
        parent: "securityManage",
        children: [
          {
            path: "dailyPatrol",
            component: _import("securityManage/patrollingSystem/dailyPatrol"),
            name: "日常巡更",
          },
          {
            path: "patrolSet",
            component: _import("securityManage/patrollingSystem/patrolSet"),
            name: "巡更设置",
          },
          {
            path: "guardSchedule",
            component: _import("securityManage/patrollingSystem/guardSchedule"),
            name: "保安排班",
          }
        ]
      }
    ]
  },
];
