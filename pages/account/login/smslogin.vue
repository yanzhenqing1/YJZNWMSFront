<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="form-item" label="手机号" prop="mobile" :label-position="form.labelPosition">
					<u-input v-model="model.mobile" placeholder="请输入手机号" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="短信验证码" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" placeholder="请输入验证码" type="number" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
				</u-form-item>
			</u-form>
		
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		
			<u-gap height="40"></u-gap>
		
			<u-button type="primary" @click="submit">登 录</u-button>
		
			<u-gap height="40"></u-gap>
		
			<view class="u-flex">
				<view class="u-flex-1 u-text-left" @click="openPage('login/pwdlogin')" :style="{color:'#3578f5'}">密码登录</view>
				<view class="u-flex-1 u-text-center" @click="openPage('register/mobileregister')" :style="{color:'#3578f5'}">注册</view>
				<view class="u-flex-1 u-text-right" @click="openPage('updatePassword/findPassword')" :style="{color:'#3578f5'}">忘记密码</view>
			</view>
		</view>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
export default {
	data() {
		return {
			title: '短信验证码登录',
			desc: '',
			codeTips: '',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 手机号 */
				mobile: '13859979963',
				/* 验证码 */
				verifyCode: '',
				/* yyzm */
				creatCode:'-',
			},
			rules: {
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
						trigger: ['change','blur']
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
				// if(this.$data.model.verifyCode === this.$data.model.creatCode){
					if(true){
					uni.showLoading({
						title: '登录中......',
						mask: true
					});
					uni.request({
						url: this.$website.url + 'userApp/smslogin',
						data: {
							phone: this.model.mobile,
							// password: this.model.password,
							// type:'APP'
						},
						success: res => {
							uni.hideLoading();
							if (res.data.code == 200) {
								this.getRongyToken(res.data.data)
							} else {
								//显示登录失败信息
								uni.showToast({
									title: "用户名或密码错误",
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
		//获取用户信息
		async getRongyToken(re) { 
			console.log("token:"+re)
			uni.request({
				url: this.$website.url + 'userApp/userInfo',
				data: {
					tok: re,
					type:'APP'
				},
				success: res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						console.log(res.data.data.user_name+"：登陆成功")
						this.$u.vuex('vuex_user.hasLogin', true)

						this.$u.vuex('vuex_user.userAvatar', res.data.data.avatar);
						this.$u.vuex('vuex_user.userName', res.data.data.login_name);
						this.$u.vuex('vuex_user.realName', res.data.data.user_name);
						this.$u.vuex('vuex_user.sex', res.data.data.sex);
						this.$u.vuex('vuex_user.userPhone',res.data.data.phonenumber);
						this.$u.vuex('vuex_user.userEmail',res.data.data.email);
						this.$u.vuex('vuex_token', re)
						//跳转到首页
						uni.switchTab({
							url:'/pages/index/index'
						})
						//显示登录成功
						uni.showToast({
							title: '登录成功',
							icon: "none"
						});
					} else {
						//显示登录失败信息
						uni.showToast({title: "接口异常",icon: "none"});
					}
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
