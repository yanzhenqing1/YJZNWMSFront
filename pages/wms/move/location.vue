<template>
	<view class="u-p-t-10">
		<u-empty v-if="!list.length" text="无数据" mode="page"></u-empty>
		<u-cell-group>
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item icon="list" :title="item.localCode" :value="item.toQty" @click="goTo(item.localCode)"></u-cell-item>
				<u-line></u-line>
			</view>
		</u-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {
			code:'',
			list: []
		};
	},
	onShow(){
	},
	onLoad(option) {
		this.code = option.id
		this.request({
			url: 'WmsMoveDetail/location',
			data: {
				code: option.id
			},
			success: res => {
				this.list = res.data;
			}
		});
	},
	methods: {
		goTo(id) {
			uni.navigateTo({
				url: 'downDetail?id='+this.code+'&l='+id
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}
.user-box {
	background-color: #fff;
}
</style>
