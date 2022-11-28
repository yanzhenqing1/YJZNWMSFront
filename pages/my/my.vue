<template>
	<qs-page>
		<qs-navbar>
			<view class="u-flex u-m-l-22"><u-icon name="setting" size="38" :custom-style="{ padding: '16rpx' }" @click="openPage('my/setting/setting')"></u-icon></view>
			<view class="u-flex u-m-r-22"><u-icon name="chat" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon></view>
		</qs-navbar>
		<view class="my-box">
			<!-- 用户 -->
			<view class="user-panel-box">
				<!-- 未登录 -->
				<view v-if="!vuex_user.hasLogin" class="u-flex" @click="openPage('account/login/pwdlogin')">
					<view class="u-m-r-20"><u-avatar size="120"></u-avatar></view>
					<view class="u-flex-1"><view class="u-font-lg">登录</view></view>
					<view><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view>
				</view>
				<!-- 已登录 -->
				<view v-if="vuex_user.hasLogin" class="u-flex">
					<view class="u-m-r-20">
						<u-avatar :src="list.model.user.userFace" @click="openPage('my/user/user')" icon="red-packet-fill" fontSize="10" mode="circle" size="120"></u-avatar>
					</view>
					<view class="u-flex-1">
						<view class="u-font-lg">{{ vuex_user.realName }}</view>
						<view class="u-m-t-10">
							<u-tag :text="vuex_user.userPhone" mode="plain" type="info" size="mini" class="u-m-r-10" />
						</view>
					</view>
				</view>
			</view>

			<!-- 跟踪 -->
			<view class="trace-panel-box">
				<u-grid :col="4" :border="false" class="card-main">
					<u-grid-item>
						<view class="u-font-xl">{{ list.model.trace.product }}</view>
						<view class="u-font-xs u-m-t-10">我的上架</view>
					</u-grid-item>
					<u-grid-item>
						<view class="u-font-xl">{{ list.model.trace.brand }}</view>
						<view class="u-font-xs u-m-t-10">我的拣货</view>
					</u-grid-item>
					<u-grid-item>
						<view class="u-font-xl">{{ list.model.trace.activity }}</view>
						<view class="u-font-xs u-m-t-10">我的移库</view>
					</u-grid-item>
					<u-grid-item>
						<view class="u-font-xl">{{ list.model.trace.history }}</view>
						<view class="u-font-xs u-m-t-10">浏览记录</view>
					</u-grid-item>
				</u-grid>
			</view>

			<u-gap height="20"></u-gap>

			<!-- 其它 -->
			<view class="other-panel-box">
				<u-cell-group :border="list.border">
					<view class="panel-main">
						<u-cell-item
							:title="item.title"
							:value="item.value"
							@click="openPage(item.path)"
							:border-bottom="list.borderBottom"
							v-for="(item, index) in cells"
							:key="index"
						></u-cell-item>
					</view>
				</u-cell-group>
			</view>

			<u-gap height="40"></u-gap>

			<view v-if="vuex_user.hasLogin" class="btn-line"><u-button type="primary" style="width: 90%;" @click="logout">退出登录</u-button></view>
		</view>
	</qs-page>
</template>

<script>
export default {
	data() {
		return {
			icon:"man",
			cells: [
				{
					title: '修改密码',
					value: '',
					path: 'account/updatePassword/findPassword'
				},
				{
					title: '帮助与反馈',
					value: '',
					path: ''
				},
				{
					title: '关于',
					value: 'v1.0.0',
					path: ''
				}
			],
			list: {
				border: false,
				borderBottom: false,
				model: {
					user: {
						/* 图像 */
						userFace: '',
						/* 昵称 */
						nickName: '',
						/* 标签 */
						userTag: ['钻石会员']
					},
					trace: {
						/* 商品关注 */
						product: '0',
						/* 品牌关注 */
						brand: '0',
						/* 活动关注 */
						activity: '0',
						/* 浏览记录 */
						history: '0'
					}
				}
			}
		};
	},
	methods: {
		logout() {
			this.$u.vuex('vuex_user.hasLogin', false);
			this.$u.vuex('vuex_user.userAvatar', '');
			this.$u.vuex('vuex_user.userName', '');
			this.$u.vuex('vuex_user.realName', '');
			this.$u.vuex('vuex_user.sex', '');
			this.$u.vuex('vuex_user.userPhone','');
			this.$u.vuex('vuex_user.userEmail','');
			this.$u.vuex('vuex_user.warehouse', '');
			this.$u.vuex('vuex_token', '');
			this.$u.toast('退出成功');
			uni.navigateBack();
		},
		openPage(path) {
			uni.navigateTo({
				url: '/pages/' + path
			});
		},
		tip() {
			return this.$u.toast('暂未开通');
		}
	},
	onShow(){
		if (!this.vuex_user.hasLogin) {
			this.$u.route({
				url:'/pages/account/login/pwdlogin'
			})
		}
	},
	onLoad() {
		this.list.model.user.userFace=this.$website.url+"upload/"+this.vuex_user.userAvatar
		console.log("头像："+this.vuex_user.userAvatar)
		//#ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, inf => {
			this.cells[2].value = inf.version;
		});
		//#endif
	}
};
</script>

<style lang="scss" scoped>
.my-box {
	.user-panel-box {
		background-color: #ffffff;
		padding: 40rpx 32rpx 0 32rpx;
	}

	.user-card-box {
		margin: 0 12rpx;
		padding: 20rpx 20rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
	}

	.trace-panel-box {
		background-color: #ffffff;
		padding: 0 10rpx 10rpx 10rpx;
	}

	.trace-card-box {
		margin: 0 12rpx;
		padding: 10rpx 10rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
	}

	.panel-box {
		background-color: #ffffff;

		.panel-header {
			padding: 30rpx 32rpx 20rpx 32rpx;
			border-bottom: 1rpx solid $qs-border-color-light;
		}

		.panel-main {
			padding: 10rpx 0;
		}
	}

	.card-box {
		padding: 10rpx 0;
		background-color: #ffffff;

		.all-order {
			position: relative;
			.cut-off-line {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: 0rpx;
				width: 30rpx;
				height: 160rpx;
			}
		}
	}

	.other-panel-box {
		.panel-main {
			padding: 10rpx 0;
		}
	}

	.other-card-box {
		margin: 0 12rpx;
		padding: 10rpx 0;
		border-radius: 16rpx;
		background-color: #ffffff;
	}
}
</style>
