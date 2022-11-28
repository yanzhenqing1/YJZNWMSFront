<template>
	<view>
		<qs-navbar>
			<view class="u-flex u-m-l-22"><u-icon name="search" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon></view>
			<view class="u-flex u-m-r-22">
				<u-icon name="chat" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
				<u-icon name="scan" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
			</view>
		</qs-navbar>
		<view class="comment" v-for="(res, index) in commentList" :key="res.id">
			<view class="left"><u-icon name="account" color="#82848a" size="50"></u-icon></view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.uid }}</view>
					<view class="like">
						<view class="num">{{ res.createdOn }}</view>
					</view>
				</view>
				<view class="reply-box">
					<view class="item">
						<view class="text">{{ res.msg }}</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" @loadmore="loadmore" />
		<template>
			<uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :popMenu="false" @fabClick="toAllReply"></uni-fab>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			page: 1,
			status: 'loadmore',
			commentList: [],
			pattern: {
				buttonColor: '#409EFF'
			}
		};
	},
	onShow() {
		this.page = 1;
		this.request({
			url: 'BaseNotice/pages',
			api: 1,
			success: res => {
				this.commentList = res.data;
			}
		});
	},
	methods: {
		tip() {
			return this.$u.toast('开发中...');
		},
		toAllReply() {
			uni.navigateTo({
				url: 'reply'
			});
		},
		loadmore() {
			this.request({
				url: 'BaseNotice/pages',
				api: 1,
				data: {
					page: ++this.page
				},
				success: res => {
					if (res.data.length == 0) {
						return this.$u.toast('已无更多数据！');
					} else {
						this.commentList = this.commentList.concat(res.data);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30rpx;
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.name {
				color: #5677fc;
			}
			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
				.num {
					margin-right: 4rpx;
					color: #9a9a9a;
				}
			}
			.highlight {
				color: #5677fc;
				.num {
					color: #5677fc;
				}
			}
		}
		.content {
			margin-bottom: 10rpx;
		}
		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			.item {
				padding: 20rpx;
				border-bottom: solid 2rpx $u-border-color;
				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.all-reply {
				padding: 20rpx;
				display: flex;
				color: #5677fc;
				align-items: center;
				.more {
					margin-left: 6rpx;
				}
			}
		}
		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;
			.reply {
				color: #5677fc;
				margin-left: 10rpx;
			}
		}
	}
}
</style>
