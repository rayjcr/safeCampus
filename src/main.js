// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router,{asyncRouterMap,constantRouterMap} from './router'
import store from './store';
import lodash from 'lodash';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animated from 'animate.css' // npm install animate.css --save安装，在引入
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import './assets/scss/style.scss'
import { getToken } from './utils/auth';


Vue.use(animated)
Vue.use(ElementUI);
Vue.use(lodash);
const whiteList = ['/login'];// 不重定向白名单

router.beforeEach((to, from, next) => {
	NProgress.start(); // 开启Progress
	if (getToken()) { // 判断是否有token
		if (to.path === '/login') {
			next({ path: '/' });
		} else {
			if(store.getters.permissionMenus === undefined){
				store.dispatch('GetMenus').then(info => { 
					var addr = constantRouterMap.concat(asyncRouterMap)
					router.addRoutes(addr) // 动态添加可访问路由表
           			next({ ...to }); // hack方法 确保addRoutes已完成
				}).catch(() => {
					store.dispatch('FedLogOut').then(() => {
						next({ path: '/login' });
					})
				})
			}else
				store.dispatch('setMetaCode',to.meta.code)
				next();
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
			next()
		} else {
			next('/login'); // 否则全部重定向到登录页
			NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
		}
	}
});
router.afterEach(() => {
	NProgress.done(); // 结束Progress
});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
