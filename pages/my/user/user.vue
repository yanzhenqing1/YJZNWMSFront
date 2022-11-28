<template>
	<qs-page>
		<view class="user-box">
			<u-gap height="20"></u-gap>

			<u-cell-group :border="list.border">
				<u-cell-item title="头像" :center="true" :border-bottom="list.borderBottom">
					<u-avatar :src="list.model.userFace" mode="circle"></u-avatar>
				</u-cell-item>
				<u-cell-item title="用户名" :value="list.model.userName" :arrow="false" :border-bottom="list.borderBottom"></u-cell-item>
				<u-cell-item title="真实姓名" :value="list.model.realName" :border-bottom="list.borderBottom"></u-cell-item>
			</u-cell-group>
			
			<u-gap height="20"></u-gap>
			
			<u-cell-group :border="list.border">
				<u-cell-item title="性别" :value="list.model.sex" :border-bottom="list.borderBottom"></u-cell-item>
				<u-cell-item title="手机号" :value="list.model.phone" :border-bottom="list.borderBottom"></u-cell-item>
				<u-cell-item title="邮箱" :value="list.model.email" :border-bottom="list.borderBottom"></u-cell-item>
			</u-cell-group>
		</view>

		<u-gap height="60"></u-gap>
	</qs-page>
</template>

<script>
export default {
	data() {
		return {
			list: {
				border: false,
				borderBottom: false,
				model: {
					/* 图像 */
					userFace: '',
					/* 用户名 */
					userName: '',
					/* 真实姓名 */
					realName: '',
					/* 性别 */
					sex: '',
					/* 手机号 */
					phone: '',
					/* 邮箱 */
					email : ''
				}
			}
		};
	},
	onLoad() {
		this.list.model.userFace = this.$website.url+"upload/"+this.vuex_user.userAvatar;
		this.list.model.userName = this.vuex_user.userName;
		this.list.model.realName = this.vuex_user.realName;
		this.list.model.sex = this.vuex_user.sex==0 ? "男":this.vuex_user.realName==1 ? "女":"未知";
		this.list.model.phone = this.vuex_user.userPhone;
		this.list.model.email = this.vuex_user.userEmail;
	}
};
</script>

<style lang="scss" scoped></style>
