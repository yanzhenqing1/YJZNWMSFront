<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="form-item" label="姓名" prop="TRUEName" :label-position="form.labelPosition">
					<u-input v-model="model.TRUEName" placeholder="您的真实姓名" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="登录账号" prop="loginName" :label-position="form.labelPosition">
					<u-input v-model="model.loginName" placeholder="您的登录账号" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="手机号" prop="mobile" :label-position="form.labelPosition">
					<u-input v-model="model.mobile" placeholder="您的常用手机号" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="短信验证码" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" placeholder="请输入验证码" type="number" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
				</u-form-item>
				<u-form-item class="form-item" label="密码" prop="password" :label-position="form.labelPosition">
					<u-input v-model="model.password" placeholder="6-20位的数字和字母" type="password" />
				</u-form-item>
				<u-form-item class="form-item" label="确认密码" prop="confirmPassword" :label-position="form.labelPosition">
					<u-input v-model="model.confirmPassword" placeholder="请再次输入密码" type="password" />
				</u-form-item>
			</u-form>

			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>

			<u-gap height="40"></u-gap>

			<u-button type="primary" @click="submit">立即提交</u-button>

			<u-gap height="40"></u-gap>

			<view class="u-flex u-row-between">
				<!-- <view @click="openPage('register/email-register')">邮箱注册</view> -->
				<view @click="openPage('login/login')" :style="{color:'#3578f5'}">登录</view>
			</view>
		</view>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
export default {
	data() {
		return {
			title: '手机号注册',
			desc: '',
			codeTips: '',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 真实姓名 */
				TRUEName: '',
				/* 登录账号名 */
				loginName: '',
				/* 手机号 */
				mobile: '',
				/* 验证码 */
				verifyCode: '',
				/* yyzm */
				creatCode: '-',
				/* 密码 */
				password: '',
				/* 确认密码 */
				confirmPassword: ''
			},
			rules: {
				TRUEName: [
					{
						required: true,
						message: '请输入真实姓名 例如:张三',
						trigger: ['change', 'blur']
					},
					{
						min: 2,
						max: 4,
						message: '真实姓名长度在2到4个字符',
						trigger: ['change', 'blur']
					},
					{
						pattern: /^[\u4e00-\u9fa5]{2,4}$/g,
						transform(value) {
							return String(value);
						},
						message: '真实姓名必须为汉字',
						trigger: ['change', 'blur']
					}
				],
				loginName: [
					{
						required: true,
						message: '请输入登录名 例如:zss',
						trigger: ['change', 'blur']
					},
					{
						min: 3,
						max: 15,
						message: '登录名长度在3到15个字符',
						trigger: ['change', 'blur']
					},
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						transform(value) {
							return String(value);
						},
						message: '登录名为字母或数字',
						trigger: ['change', 'blur']
					}
				],
				mobile: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号格式不正确',
						trigger: ['change', 'blur']
					}
				],
				verifyCode: [
					{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur']
					},
					{
						type: 'number',
						message: '验证码只能为数字',
						trigger: ['change', 'blur']
					},
					{
						len: 6,
						message: '验证码长度为6位数字',
						trigger: ['change', 'blur']
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur']
					},
					{
						min: 6,
						max: 20,
						message: '密码长度在6到20个字符',
						trigger: ['change', 'blur']
					},
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						transform(value) {
							return String(value);
						},
						message: '密码为字母或数字',
						trigger: ['change', 'blur']
					}
				],
				confirmPassword: [
					{
						required: true,
						message: '请再次输入密码',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return value === this.model.password;
						},
						message: '两次输入的密码不相等',
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	methods: {
		openPage(path) {
			this.$u.route({
				url: '/pages/account/' + path
			});
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				//这里判断验证码是否正确
				if(this.$data.model.verifyCode === this.$data.model.creatCode){
					// if(true){
					uni.showLoading({
						title: '注册中......',
						mask: true
					});
					uni.request({
						url: this.$website.url + 'userApp/register',
						data: {
							TRUEName: this.model.TRUEName,
							loginName: this.model.loginName,
							phone: this.model.mobile,
							password: this.model.password,
							type:'APP'
						},
						success: res => {
							uni.hideLoading();
							if (res.data.code == 200) {
								console.log("注册结果："+res.data.data)
								if (res.data.data == -1) {
									//显示注册失败信息
									uni.showToast({
										title: "用户名已被占用",
										icon: "none"
									});
								}else if(res.data.data == -2){
									//显示注册失败信息
									uni.showToast({
										title: "手机号已被占用",
										icon: "none"
									});
								}else if(res.data.data == 0){
									//显示注册失败信息
									uni.showToast({
										title: "注册失败，未知原因",
										icon: "none"
									});
								}else if(res.data.data == 1){
									//跳转到登录页
									uni.navigateTo({
										url:'/pages/account/login/pwdlogin'
									})
									//显示登录成功
									uni.showToast({
										title: '注册成功',
										icon: "none"
									});
								}
							} else {
								//显示注册失败信息
								uni.showToast({
									title: "注册失败未知原因",
									icon: "none"
								});
							}
						}
					});
				}else{
					uni.showToast({
						title: '验证码不正确',
						icon: "none"
					});
					return false;
				}
			});
		},
		codeChange(text) {
			this.codeTips = text;
		},
		// 获取验证码
		getCode() {
			let _this = this;
			//验证手机号格式
			if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.model.mobile))) {
				uni.showToast({
					title: '请填写正确手机号码',
					icon: "none"
				});
				return false;
			}
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
				//调用云端函数生成验证码
				uniCloud.callFunction({
					name:'creatCode'
				}).then(res=>{
					_this.model.creatCode = res.result;
					let time = 1000 * 60 * 5;
					//设置5分钟倒计时
					// setTimeout(function(){
					// 	_this.model.creatCode= '';
					// },time)
					//发送验证码
					uniCloud.callFunction({
						name:'sendSms',
						data:{
							phone:_this.model.mobile,
							data:{
								name:"奕聚智能",
								code:_this.model.creatCode,
								action:'登录',
								expMinute:'5',
							}
						}
					}).then(res =>{
						console.log('sucess',res);
					}).catch(msg =>{
						console.error(msg);
					})	
				})
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style lang="scss" scoped>
.account-form-box {
	padding: 0 32rpx;
}
</style>
