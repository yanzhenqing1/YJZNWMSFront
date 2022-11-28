<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form  class="list" :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="form-item" label="手机号" prop="mobile" :label-position="form.labelPosition">
					<u-input :disabled="phoneDisabled" v-model="model.mobile" placeholder="请输入手机号码" type="text" />
					<view class="code" @click="getCode" :style="{color:model.mobile?'#3578f5':'#adc9d8'}">
						{{ codeTips }}
					</view>
				</u-form-item>					
				<u-form-item class="form-item" label="验证码" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" placeholder="请输入验证码" type="number" />
				</u-form-item>
				
				<u-form-item class="form-item" label="新密码" prop="password" :label-position="form.labelPosition">
					<u-input v-model="model.password" placeholder="6-20位的数字和字母" type="password" />
				</u-form-item>
			</u-form>
				
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
			
			<u-gap height="40"></u-gap>
			
			<u-button type="primary" @click="submit">提交</u-button>
			
			<u-gap height="40"></u-gap>
		
			
		</view>
		
		<u-gap height="40"></u-gap>
		
	</account-page>
</template>

<script>
	export default {
		data(){
			return{
				title: '忘记/修改密码',
				desc: '',
				codeTips: '',
				phoneDisabled:false,
				form: {
					errorType: ['message'],
					labelPosition: 'top'
				},
				model: {
					/* 手机号 */
					mobile: '',
					/* 密码 */
					password: '',
					/* 验证码 */
					verifyCode: '',
					/* 生成验证码*/
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
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			let tmp = uni.getStorageSync('lifeData');
			if(tmp.vuex_user.userPhone!=""){
				//取出登录存入的手机号
				this.model.mobile=tmp.vuex_user.userPhone
				this.phoneDisabled=true
			}else{
				this.phoneDisabled=false
			}
			console.log("|| "+tmp.vuex_user.userPhone)
			
		},
		methods:{
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
							title: '修改中......',
							mask: true
						});
						uni.request({
							url: this.$website.url + 'userApp/findPassword',
							data: {
								phone: this.model.mobile,
								password: this.model.password,
								type:'APP'
							},
							success: res => {
								uni.hideLoading();
								if (res.data.code == 200) {
									//清空登录数据
									this.$u.vuex('vuex_user.hasLogin', false);
									this.$u.vuex('vuex_user.userAvatar', '');
									this.$u.vuex('vuex_user.userName', '');
									this.$u.vuex('vuex_user.realName', '');
									this.$u.vuex('vuex_user.sex', '');
									this.$u.vuex('vuex_user.userPhone','');
									this.$u.vuex('vuex_user.userEmail','');
									this.$u.vuex('vuex_user.warehouse', '');
									this.$u.vuex('vuex_token', '');
									//跳转到登录页
									uni.navigateTo({
										url:'/pages/account/login/pwdlogin'
									})
									//显示修改成功
									uni.showToast({
										title: '修改成功',
										icon: "none"
									});
								} else {
									//显示登录失败信息
									uni.showToast({
										title: "该手机号用户不存在",
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
	}
</script>

<style lang="scss" scoped>
	.account-form-box {
		padding: 0 32rpx;
		font-size: 34rpx;
	}
</style>