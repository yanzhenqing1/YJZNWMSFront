import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

// vuex
import store from '@/store'

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)

// 将store放入Vue对象创建中
const app = new Vue({
	store,
	...App
})

app.$mount()
// 配置后端服务器连接
Vue.prototype.$website = {
	// 本地
	// url: 'http://localhost:9099/api/',
	//内网穿透
	url: 'http://localhost:9099/',
	// url: 'http://www.jooand.com:9005/api/'
	// url2: 'http://www.jooand.com:9006/api/'
}

Vue.prototype.request = function(params) {
	/*默认值*/
	params.showLoading = params.showLoading == undefined ? true : params.showLoading;
	params.method = params.method == undefined ? "GET" : params.method;
	params.api = params.api == undefined ? "" : params.api;
	params.header = params.header == undefined ? {
		'X-Requested-With': 'XMLHttpRequest',
		"Authorization": 'Bearer ' + this.vuex_token
	} : params.header;
	if (params.contentType){
		params.header['content-type'] = params.contentType
	}
	/**/
	if (params.showLoading) {
		uni.showLoading({
			mask: true,
			title: (params.showLoadingTitle ? params.showLoadingTitle : "加载中...")
		});
	}
	let url = this.$website.url2 + params.url;
	if (params.api == "1"){
		url = this.$website.url + params.url;
	}
	uni.request({
		url: url,
		data: params.data,
		header: params.header,
		method: params.method,
		success: (res) => {
			params.success(res.data);
		},
		complete: () => {
			if (params.showLoading) {
				uni.hideLoading();
			}
		}
	});
}