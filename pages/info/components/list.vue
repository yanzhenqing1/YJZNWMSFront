<template>
	<view class="news-list">
		<view class="u-flex u-col-top list-item" v-for="item in list" :key="item.id"  @click="openPage(item.id)">
<!-- 			<view class="list-item-side">
				<image
					class="news-pic"
					:src="item.imageUrl == '' ? 'http://t9.baidu.com/it/u=583874135,70653437&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg' : item.imageUrl"
					mode="widthFix"
				/>
			</view> -->
			<view class="u-flex-1 list-item-main">
				<view class="news-content">
					<view class="u-line-2 news-title">{{ item.title }}</view>
				</view>
				<view class="u-flex u-row-between news-extra">
					<view>{{ item.createdOn }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			// 数据列表
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		// 打开页面
		openPage(path) {
			this.$u.route({
				url: '/pages/info/detail?id=' + path
			});
		},
		// 提示
		tip() {
			return this.$u.toast('暂未开通');
		}
	}
};
</script>

<style lang="scss" scoped>
.news-list {
	background-color: #fff;

	.list-item {
		padding: 30rpx 30rpx;
		border-bottom: 1rpx solid #F5F5F5;

		.list-item-side {
			width: 160rpx;
			height: 120rpx;
			margin-right: 20rpx;
		}
	}

	.news-pic {
		width: 160rpx;
		height: 120rpx;
	}

	.news-content {
		height: 60rpx;
	}

	.news-title {
		font-size: 30rpx;
	}

	.news-extra {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
}
</style>
