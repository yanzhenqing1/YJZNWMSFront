<template>
	<view class="u-p-t-10">
		<u-card v-for="(item, index) in list" :key="index" :title="item.boxNum" :border="false" :sub-title="item.quantity.toString()">
			<u-table slot="body">
				<u-tr v-for="(o, i) in item.details" :key="i">
					<u-td width="60%">{{ o.barCode }}</u-td>
					<u-td>{{ o.quantity }}</u-td>
				</u-tr>
			</u-table>
		</u-card>
		<u-gap height="20"></u-gap>
		<view class="btn-line"><u-button type="primary" style="width: 90%;" @click="goTo">开始拣货</u-button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id :'',
			list: []
		};
	},
	onShow() {},
	onLoad(option) {
		uni.setNavigationBarTitle({
		    title: option.id
		});
		this.id = option.id
		this.request({
			url: 'OrderPick/detail',
			data: {
				id: this.id
			},
			success: res => {
				let dt = res.data;
				this.list = dt.details;
			}
		});
	},
	methods: {
		goTo() {
			uni.navigateTo({
				url: 'pick?id=' + this.id
			});
		}
	}
};
</script>

<style scoped lang="scss">
.u-card-wrap {
	background-color: $u-bg-color;
	padding: 1px;
}

.u-body-item {
	font-size: 32rpx;
	color: #333;
	padding: 20rpx 10rpx;
}

.u-body-item image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	margin-left: 12rpx;
}
</style>
