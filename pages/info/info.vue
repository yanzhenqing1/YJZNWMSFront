<template>
	<view>
		<qs-navbar>
			<view class="u-flex u-m-l-22"><u-icon name="search" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon></view>
			<view class="u-flex u-m-r-22">
				<u-icon name="chat" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
				<u-icon name="scan" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
			</view>
		</qs-navbar>

		<!-- 页面主体 -->
		<mescroll-item></mescroll-item>
	</view>
</template>

<script>
import MescrollItem from './components/mescroll-item.vue';

export default {
	components: {
		MescrollItem
	},
	data() {
		return {
			height: '400px'
		};
	},
	methods: {
		// 打开页面
		openPage(path) {
			this.$u.route({
				url: '/pages/' + path
			});
		},
		// 提示
		tip() {
			return this.$u.toast('暂未开通');
		},
		// 标签栏
		tabsChange(i) {
			this.tabs.current = i;
		},
		// 轮播
		swiperChange(e) {
			this.tabs.current = e.detail.current;
		}
	},
	onLoad() {
		// 需要固定swiper的高度
		this.height = uni.getSystemInfoSync().windowHeight + 'px';
	}
};
</script>

<style lang="scss" scoped></style>
