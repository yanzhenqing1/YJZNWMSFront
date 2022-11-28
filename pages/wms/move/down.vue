<template>
	<view class="u-p-t-10">
		<u-empty v-if="!list.length" text="无数据" mode="page"></u-empty>
		<u-cell-group>
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item :title="item.code" :label="item.remark" @click="goTo(item.code)">
					<u-tag :text="getTyp(item.type)" :type="getCss(item.type)" />
				</u-cell-item>
				<u-line></u-line>
			</view>
		</u-cell-group>
		<template v-if="visible">
			<uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :popMenu="false" @fabClick="add"></uni-fab>
		</template>
	</view>
</template>

<script>
import fab from '@/components/uni-fab/uni-fab.vue';
export default {
	components: {
		fab
	},
	data() {
		return {
			// 按钮显示
			visible: true,
			// 加号样式
			pattern: {
				buttonColor: '#409EFF'
			},
			model: {},
			list: [],
			type: []
		};
	},
	onShow() {
		this.request({
			url: 'WmsMove/getpages',
			data: {
				limit: 0,
				time: '1',
				status: 1,
				where: this.vuex_user.warehouse
			},
			success: res => {
				this.list = res.data;
			}
		});
	},
	onLoad() {
		this.request({
			url: 'code/getCodes',
			api: 1,
			data: {
				typeId: 'CODE201003'
			},
			success: res => {
				this.type = res.data;
			}
		});
	},
	methods: {
		add() {
			uni.navigateTo({
				url: 'downDetail'
			});
		},
		goTo(id) {
			uni.navigateTo({
				url: 'location?id=' + id
			});
		},
		getTyp(id) {
			let typ = this.type.find(m => m.sort == id);
			if (typ != undefined) return typ.name;
		},
		getCss(id) {
			let typ = this.type.find(m => m.sort == id);
			if (typ != undefined) return typ.remark;
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
