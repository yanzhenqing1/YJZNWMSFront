<template>
	<view class="u-p-t-10">
		<u-form class="u-m-30" label-width="120">
			<u-form-item label="拣货单:"><u-tag :text="model.code" /></u-form-item>
			<u-form-item label="货架号:"><u-tag :text="model.remark" /></u-form-item>
			<u-form-item label="条码:"><u-tag :text="model.id" /></u-form-item>
		</u-form>
		<u-cell-group>
			<u-cell-item icon="bag" v-for="(o, i) in model.logs" :key="i" :title="o.boxNum" :arrow="false">
				<u-badge slot="right-icon" type="error" :count="o.quantity" :absolute="false"></u-badge>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="40"></u-gap>
		<view class="btn-line"><u-button type="primary" :disabled="disabled" style="width: 50%;" @click="goTo">下一步</u-button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			disabled: false,
			id: '',
			numList: [
				{
					name: '下单'
				},
				{
					name: '出库'
				},
				{
					name: '运输'
				},
				{
					name: '签收'
				},
				{
					name: '下单'
				},
				{
					name: '出库'
				},
				{
					name: '运输'
				},
				{
					name: '签收'
				}
			],
			model: []
		};
	},
	onShow() {},
	onLoad(option) {
		this.id = option.id;
		this.request({
			url: 'OrderPick/calculate',
			data: {
				code: this.id
			},
			success: res => {
				this.model = res.data;
				if (res.code != 200) {
					this.disabled = true;
					this.$u.toast(res.msg);
				} else if (res.data.logs == null || res.data.logs.length == 0) {
					uni.navigateBack({
						delta: 2
					});
				}
			}
		});
	},
	methods: {
		goTo() {
			this.request({
				url: 'OrderPick/picking',
				method: 'POST',
				data: this.model,
				success: res => {
					if (res.code == 200) {
						if (res.data.logs == null) {
							uni.navigateBack({
								delta: 2
							});
						} else {
							this.model = res.data;
						}
					} else {
						this.disabled = true;
						this.$u.toast(res.msg);
					}
				}
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
