<template>
	<view>
		<!-- 解决 fixed 定位后塌陷的问题 -->
		<view class="qs-page-header-placeholder" style="height: 20px;"></view>
		<!-- 页面主体 -->
		<view class="news-detail">
			<!-- #ifdef MP -->
			<nav-bar></nav-bar>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<u-gap height="40"></u-gap>
			<!-- #endif -->
			<view class="detail-title">{{model.title}}</view>
			<view class="detail-extra">
				<text>{{model.createdOn}}</text>
			</view>
			<view class="detail-content">
				<view v-html="model.content"></view>
			</view>

			<u-loadmore status="nomore" color="#999999"></u-loadmore>
			<u-gap height="120"></u-gap>
		</view>

		<view class="qs-page-footer">
			<view class="u-flex my-page-footer">
				<view class="footer-action" @click="goBack"><u-icon name="arrow-left" size="36"></u-icon></view>
				<view class="u-flex-1"><u-search placeholder="说两句..." :show-action="false"></u-search></view>
				<view class="footer-action" @click="tip"><u-icon name="arrow-upward" size="36"></u-icon></view>
				<view class="footer-action" @click="tip"><u-icon name="star" size="36"></u-icon></view>
				<view class="footer-action" @click="tip"><u-icon name="zhuanfa" size="36"></u-icon></view>
				<view class="footer-action" @click="tip"><u-icon name="more-dot-fill" size="36"></u-icon></view>
			</view>
		</view>
		<!-- 解决 fixed 定位后塌陷的问题 -->
		<view class="qs-page-footer-placeholder"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model:{}
		};
	},
	onLoad(option) {
			this.request({
				url: 'BaseInfo/detail',
				api: 1,
				data: {
					id: option.id
				},
				success: res => {
					this.model = res.data
				}
			});
	},
	methods: {
		// 提示
		tip() {
			return this.$u.toast('暂未开通');
		},
		// 返回
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss">
.my-page-footer {
	height: 48px;
	background-color: $uni-bg-color-grey;
	padding: 0 10rpx;

	.footer-action {
		padding: 0 20rpx;
	}
}
/* -- 底部 -- */
.qs-page-footer {
	width: 100%;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 991;
}
/* -- fixed 占位 -- */
.qs-page-header-placeholder,
.qs-page-footer-placeholder {
	width: 100%;
}
.news-detail {
	background-color: #ffffff;

	.detail-title {
		border-left: 10rpx solid #d81e06;
		padding: 0 30rpx;
		font-size: $uni-font-size-title;
		font-weight: bold;
		color: $uni-color-title;
		line-height: 1.5;
	}

	.detail-extra {
		padding: 20rpx 30rpx;
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}

	.detail-content {
		padding: 30rpx 30rpx;
		font-size: $uni-font-size-paragraph;
		color: $uni-color-paragraph;
		line-height: 2;
	}
}
</style>
