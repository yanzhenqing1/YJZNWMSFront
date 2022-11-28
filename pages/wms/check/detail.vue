<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<u-form :model="model" ref="uForm" style="width: 100%;">
				<u-form-item left-icon="grid" label-width="120" label="货架:">
					<input :focus="focus1" :placeholder="model.localCode" v-model="localCode" @change="changLocal" type="text" />
					<u-icon slot="right" name="scan" @tap="scanCode(1)"></u-icon>
				</u-form-item>
				<u-form-item left-icon="list-dot" label-width="120" label="条码:">
					<input :focus="focus2" :placeholder="model.barCode" v-model="barCode" type="text" />
					<u-icon slot="right" name="scan" @tap="scanCode(2)"></u-icon>
				</u-form-item>
			</u-form>
		</view>
		<view class="u-demo-wrap u-m-t-20 u-p-t-10">
			<u-tag :text="'款号:' + product.matnr" class="u-m-r-20 u-m-t-20" />
			<u-tag :text="'款名:' + product.name" class="u-m-r-20 u-m-t-20" />
			<u-tag :text="'颜色:' + product.colorName" class="u-m-r-20 u-m-t-20" />
			<u-tag :text="'尺寸:' + product.size" class="u-m-r-20 u-m-t-20" />
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item
					v-for="(item, index) in list"
					:key="index"
					icon="list-dot"
					:title="item.barCode"
					:label="item.localCode"
					:value="item.quantity + ' : ' + item.checkQty"
					:arrow="false"
				></u-cell-item>
			</u-cell-group>
		</view>
		<u-gap height="20"></u-gap>
		<view class="btn-line"><u-button type="primary" style="width: 90%;" @click="submit">提交信息</u-button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			focus1: true,
			focus2: false,
			localCode: '',
			barCode: '',
			product: {
				matnr: '',
				name: '',
				colorName: '',
				size: '',
				lengthSize: ''
			},
			model: {
				code: '',
				localCode: '',
				barCode: ''
			},
			list: []
		};
	},
	onLoad(option) {
		this.model.code = option.id;
	},
	onShow() {
		this.initData();
	},
	watch: {
		barCode(val) {
			if (val.endsWith('#') || val.length == 13) {
				this.bindConfirm();
			}
		}
	},
	methods: {
		initData() {
			this.request({
				url: 'WmsCheck/detail',
				data: {
					id: this.model.code
				},
				success: res => {
					let dt = res.data;
					this.model.id = dt.id
					this.model.updatedOn = dt.updatedOn
					this.list = dt.details;
				}
			});
		},
		scanCode(typ) {
			var st=new Array()
			st[0]="barCode"
			st[1]="qrCode"
			uni.scanCode({
				scanType: st,
				success: res => {
					if (typ == 1) {
						this.model.localCode = res.result;
					} else {
						this.barCode = res.result;
					}
				}
			});
		},
		submit() {
			uni.showModal({
				title: '确认提交！',
				success: res => {
					if (res.confirm) {
						this.model.status = 2
						this.model.details = this.list
						this.request({
							url: 'WmsCheck/edit',
							method: 'POST',
							data: this.model,
							success: res => {
								if (res.code == 200) {
										uni.navigateBack();
								} else {
									this.$u.toast(res.msg);
								}
							}
						});
					}
				}
			});
		},
		bindConfirm() {
			this.model.barCode = this.barCode.replace('#', '');
			if (this.model.barCode == undefined || this.model.barCode == '') {
				return;
			}
			if (this.model.localCode == undefined || this.model.localCode == '') {
				this.$u.toast('请先扫描库位');
				return;
			}
			this.$nextTick(() => {
				this.barCode = '';
			});
			this.model.quantity = 1;
			if (this.model.barCode.length > 0) {
				this.request({
					url: 'BaseProduct/detail',
					data: {
						id: this.model.barCode
					},
					success: res => {
						this.product = res.data;
					}
				});
			}
			let isExist = false;
			this.list.forEach(m => {
				if (!isExist && m.barCode == this.model.barCode && m.localCode == this.model.localCode) {
					if (m.checkQty == undefined) {
						m.checkQty = 0;
					}
					m.checkQty++;
					isExist = true;
				}
			});
			if (!isExist) {
				this.request({
					url: 'WmsInventory/getQuantity',
					data: {
						storeCode: this.vuex_user.warehouse,
						localCode: this.model.localCode,
						barCode: this.model.barCode
					},
					success: res => {
						this.list.unshift({
							barCode: this.model.barCode,
							localCode: this.model.localCode,
							quantity: res.data.quantity,
							updatedOn: res.data.updatedOn,
							checkQty: 1
						});
					}
				});
			}
		},
		changLocal() {
			this.model.localCode = this.localCode;
			this.$nextTick(() => {
				this.localCode = '';
			});
			this.focus1 = false;
			this.focus2 = true;
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
