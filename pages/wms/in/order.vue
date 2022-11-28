<template>
	<view class="u-p-t-10">
		<u-empty v-if="!list.length" text="无数据" mode="page"></u-empty>
		<u-cell-group>
			<view v-for="(item, index) in list" :key="index">
				<u-cell-item :title="'供应商:'+item.supplier_name" :label="'商品名:'+item.shop_goods_name" :value="'计划数量:'+item.plan_number+'('+item.goods_unit_desc+')'" @click="goTo('/in/detail')">
					
				</u-cell-item>
					
					<view >
						<div>
							<u-tag :text="'商品CODE:'+item.order_code" class="u-m-r-20 u-m-t-20" />
						</div>
						<div>
							<u-tag :text="'创建日期:' + timestampToTime(item.create_time)" class="u-m-r-20 u-m-t-20" />
						</div>
						<div>
							<u-tag :text="'计划数量:' + item.plan_number" class="u-m-r-20 u-m-t-20" />
						</div>
						<div>
							<u-tag :text="'已入库数量:' + item.warehousing_number" class="u-m-r-20 u-m-t-20" />
						</div>
						<view class="u-demo-wrap u-m-t-20 u-p-t-10"></view>
					</view>
				
					
			</view>
		</u-cell-group>
	</view>
</template>

<script>

export default {
	data() {
		return {
			model: {},
			list: [],
			type: []
		};
	},
	onShow(){
		uni.request({
			url: this.$website.url + 'WMS/getSortedList',
			data: {
				type:'getSortedList'
			},
			success: res => {
				uni.hideLoading();
				if (res.data.code == 200){
					console.log( "code："+res.data.code)
					console.log( "code："+res.data.data)
					this.list = res.data.data;
				} else {
					this.$u.toast('获取服务器数据失败');
				}
			}
		});
	},
	onLoad() {
	
	},
	methods: {
		//日期格式转换
		timestampToTime(timestamp) {
			var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			let Y = date.getFullYear() + '-';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			let D = date.getDate() + ' ';
			let h = date.getHours() + ':';
			let m = date.getMinutes() + ':';
			let s = date.getSeconds();
			return Y + M + D+h+m+s;
		},
		goTo(url) {
			this.$u.route({
				url: '/pages/wms' + url
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
