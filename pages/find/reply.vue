<template>
	<view class="wrap">
		<view class="all-reply">
			<view class="all-reply-top">发表新消息</view>
			<view class="comment">
				<view class="reply">
					<view class="text"><u-input v-model="model.msg" type="textarea" /></view>
				</view>
				<view class="content" style="padding-top: 10px;text-align: right;"><u-button size="medium" type="primary" plain :loading="loading" @click="submit">提交</u-button></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			commentList: [],
			loading: false,
			model: {
				msg:''
			}
		};
	},
	onLoad() {},
	methods: {
		submit(){
			if (this.model.msg == undefined || this.model.msg == '') {
				this.$u.toast('请输入内容！');
				return;
			}
			this.loading = true;
			this.request({
				url: 'BaseNotice/add',
				api:1,
				method: 'POST',
				data: this.model,
				success: res => {
					if (res.code == 200) {
							uni.navigateBack();
					} else {
						this.loading = false;
						this.$u.toast(res.msg);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 30rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.left {
		display: flex;
		.heart-photo {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.user-info {
			margin-left: 10rpx;
			.name {
				color: #5677fc;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: $u-light-color;
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num {
			font-size: 26rpx;
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
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #5677fc;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		border-bottom: solid 2rpx $u-border-color;
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
</style>
