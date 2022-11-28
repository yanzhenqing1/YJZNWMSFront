<template>
	<qs-page>
		<qs-navbar>
			<view class="u-flex u-m-l-22">
				<u-icon name="search" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
			</view>
			<view class="u-flex u-m-r-22">
				<u-icon name="chat" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
				<u-icon name="scan" size="38" :custom-style="{ padding: '16rpx' }" @click="tip"></u-icon>
			</view>
		</qs-navbar>
		<view class="u-demo-wrap">
			<view class="u-flex user-box" @click="goTo('wms/warehouse')">
				<view class="u-m-r-10">
					<u-icon name="home" color="#2b85e4" size="80"></u-icon>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{warehouse.name}}</view>
					<view class="u-font-14 u-tips-color">{{warehouse.orgName}}</view>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
		</view>
		<u-grid :col="col" :border="border">
			<u-grid-item :index="0" @click="goTo('wms/in/order')">
				<u-badge :count="getSum('WmsInStorDetail')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="list" :size="46"></u-icon>
				<view class="grid-text">添加入库单</view>
			</u-grid-item>
			<u-grid-item :index="0" @click="goTo('wms/in/order')">
				<u-badge :count="getSum('WmsInStorDetail')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="list" :size="46"></u-icon>
				<view class="grid-text">入库上架</view>
			</u-grid-item>
		<!-- 	<u-grid-item :index="1" @click="goTo('wms/pick/order')">
				<u-badge :count="getSum('OrderPick')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="shopping-cart" :size="46"></u-icon>
				<view class="grid-text">拣货</view>
			</u-grid-item> -->
			<u-grid-item :index="2" @click="goTo('wms/out/order')">
				<u-badge :count="getSum('WmsOutStorDetail')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="list-dot" :size="46"></u-icon>
				<view class="grid-text">出库下架</view>
			</u-grid-item>
			<!-- <u-grid-item :index="3" @click="goTo('wms/check/order')">
				<u-badge :count="getSum('WmsCheck')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="checkmark-circle" :size="46"></u-icon>
				<view class="grid-text">盘点</view>
			</u-grid-item>
			<u-grid-item :index="4" @click="goTo('wms/move/down')">
				<u-badge :count="getSum('WmsMove')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="arrow-down" :size="46"></u-icon>
				<view class="grid-text">移库下架</view>
			</u-grid-item>
			<u-grid-item :index="5" @click="goTo('wms/move/up')">
				<u-badge :count="getSum('WmsMoveDetail')" :offset="[20,30]"></u-badge>
				<u-icon color="#19be6b" name="arrow-up" :size="46"></u-icon>
				<view class="grid-text">移库上架</view>
			</u-grid-item>
			<u-grid-item :index="6">
				<u-icon color="#19be6b" name="arrow-left-double" :size="46"></u-icon>
				<view class="grid-text">收货</view>
			</u-grid-item> -->
			<u-grid-item :index="7">
				<u-icon color="#19be6b" name="order" :size="46"></u-icon>
				<view class="grid-text">库存查询</view>
			</u-grid-item>
			<!-- <u-grid-item :index="8">
				<u-icon color="#19be6b" name="arrow-right-double" :size="46"></u-icon>
				<view class="grid-text">发货</view>
			</u-grid-item> -->
		</u-grid>
	</qs-page>
</template>

<script>
	export default {
		data() {
			return {
				warehouse: {
					name: '',
					orgName: ''
				},
				border: true,
				col: 3,
				count: [{
					title: 'WmsInStorDetail',
					count: 0
				},{
					title: 'WmsOutStorDetail',
					count: 0
				},{
					title: 'OrderPick',
					count: 0
				},{
					title: 'WmsMove',
					count: 0
				},{
					title: 'WmsMoveDetail',
					count: 0
				},{
					title: 'WmsCheck',
					count: 0
				}]
			};
		},
		onShow() {
			if (!this.vuex_user.hasLogin) {
				this.$u.route('/pages/account/login/pwdlogin');
			}
			this.request({
				url: 'BaseUser/warehouse',
				data: {
					key: this.vuex_user.userPhone
				},
				success: res => {
					if (res.data != undefined) {
						this.warehouse = res.data;
						this.$u.vuex('vuex_user.warehouse', res.data.code)
						this.count.forEach(m => {
							this.request({
								url: m.title + '/sum',
								data: {
									code: res.data.code
								},
								success: r => {
									m.count = r.data;
								}
							});
						})
					}
				}
			});
		},
		onLoad() {
		},
		methods: {
			tip() {
				return this.$u.toast('开发中...');
			},
			goTo(url) {
				this.$u.route({
					url: '/pages/' + url
				});
			},
			getSum(url) {
				return this.count.find(m => m.title == url).count;
			}
		}
	};
</script>

<style lang="scss" scoped></style>
