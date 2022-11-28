<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="form-item" label="姓名" prop="user" :label-position="form.labelPosition">
					<u-input v-model="model.user" placeholder="请输入手机号/邮箱/用户名" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="密码" prop="password" :label-position="form.labelPosition">
					<u-input v-model="model.password" placeholder="请输入登录密码" type="password" />
				</u-form-item>
			</u-form>

			<u-gap height="40"></u-gap>

			<u-button type="primary" @click="submit">登 录</u-button>
			
			<u-gap height="40"></u-gap>
		
			<view class="u-flex">
				<view class="u-flex-1 u-text-left" @click="openPage('login/smslogin')" :style="{color:'#3578f5'}">短信验证码登录</view>
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
			title: '账号密码登录',
			desc: '',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 账号 */
				user: '',
				/* 密码 */
				password: ''
			},
			rules: {
				user: [
					{
						required: true,
						message: '请输入手机号/邮箱/用户名',
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
				]
			}
		};
	},
	created() {},
	methods: {
		openPage(path) {
			uni.navigateTo({
				url: '/pages/account/' + path
			});
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					uni.showLoading({
						title: '登录中......',
						mask: true
					});
					uni.request({
						url: this.$website.url + 'userApp/pwdlogin',
						data: {
							ppe: this.model.user,
							pwd: this.model.password,
							type:'pwdlogin'
						},
						success: res => {
							uni.hideLoading();
							if (res.data.code == 200) {
								this.getRongyToken(res.data.data)
							} else {
								this.$u.toast('用户名或密码不正确');
							}
						}
					});
				} else {
					console.log('验证失败');
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
