import Vue from 'vue'
import Vuex from 'vuex'
import { getToken,removeToken } from '@/utils/auth';
import * as api from '@/api/index';

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        token: getToken(),
        permissionMenus: undefined,
        sidebar:{
            opened: !+window.localStorage.getItem("sidebarStatus"),                //菜单栏是否展开
        },
        sidebarcurMenu:'safeCampus',
        metaCode: '',
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_PERMISSION_MENUS: (state, permissionMenus) => {
            state.permissionMenus = permissionMenus;
        },
        TOGGLE_SIDEBAR: (state,view) => {
            window.localStorage.setItem('sidebarStatus', view.opened?1:0);
            state.sidebar.opened = !view.opened;
        },
        Set_CurMenu:(state,view) => {
            state.sidebarcurMenu = view;
        },
        Set_MetaCode:(state,view) => {
            state.metaCode = view;
        },

    },
    getters:{
        token: state => state.token,
        permissionMenus: state => state.permissionMenus,
        sidebar: state => state.sidebar,
        sidebarcurMenu: state => state.sidebarcurMenu,
        metaCode: state => state.metaCode,
    },
    actions:{
        setToken({commit},data){
            commit('SET_TOKEN', data);
        },
        ToggleSideBar: ({ commit } , view) => {
            commit('TOGGLE_SIDEBAR',view)
        },
        setMetaCode: ({ commit } , view) => {
            commit('Set_MetaCode',view)
        },
        // 获取用户信息
        GetInfo({commit,state}){
            return new Promise((resolve, reject) => {
                api.getInfo(state.token).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
                api.getMenus(state.token).then(response => {
                    
                    commit('SET_PERMISSION_MENUS', response);
                });
            })
        },
        GetMenus({commit,state}){
            return new Promise((resolve, reject) => {
                api.getMenus(state.token).then(response => {
                    commit('SET_PERMISSION_MENUS', response);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            })
        },
        //登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                // commit('SET_ROLES', []);
                // commit('SET_MENUS', undefined);
                // commit('SET_ELEMENTS', undefined);
                commit('SET_PERMISSION_MENUS', undefined);
                removeToken();
                resolve();
            });
        },
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                api.loginOut().then(() => {
                    commit('SET_TOKEN', '');
                    // commit('SET_ROLES', []);
                    // commit('SET_MENUS', undefined);
                    // commit('SET_ELEMENTS', undefined);
                    commit('SET_PERMISSION_MENUS', undefined);
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
    },
})