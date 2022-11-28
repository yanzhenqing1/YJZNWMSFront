<template>
	<view class="u-p-t-10">
		<u-empty v-if="!list.length" text="无数据" mode="page"></u-empty>
		<u-cell-group>
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item :title="item.code" :label="item.createdOn" :value="item.remark" @click="goTo(item.code)"></u-cell-item>
				<u-line></u-line>
			</view>
		</u-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {},
			list: []
		};
	},
	onShow(){
		this.request({
			url: 'WmsOutStorage/getpages',
			data: {
				limit: 0,
				status: 1,
				where: this.vuex_user.warehouse
			},
			success: res => {
				this.list = res.data;
			}
		});
	},
	onLoad() {
	},
	methods: {
		goTo(id) {
			uni.navigateTo({
				url: 'detail?id='+id
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
