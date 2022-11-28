<template>
	<u-cell-group>
		<u-cell-item @click="upt(item.code)" v-for="(item, index) in list" :key="index" icon="home" :title="item.name" :label="item.orgName" :arrow="false"></u-cell-item>
	</u-cell-group>
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
	},
	onLoad() {
		this.request({
			url: 'BaseUser/pages',
			data: {
				limit: 0,
				key: this.vuex_user.userPhone,
				type: 2
			},
			success: res => {
				this.list = res.data;
			}
		});
	},
	methods: {
		goTo(id) {
			uni.navigateTo({
				url: 'detail?id='+id
			});
		},
		upt(code) {
			this.request({
				url: 'BaseUser/uptWarehouse',
				data: {
					key: this.vuex_user.userPhone,
					where: code
				},
				success: res => {
					uni.navigateBack();
				}
			});
		}
	}
};
</script>


<style>
</style>
