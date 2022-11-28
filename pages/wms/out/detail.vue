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
					:value="item.quantity + ' : ' + item.outQty"
					:arrow="false"
				></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import { nfcinit, nfcclose } from '@/util/rfid';
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
				mainCode: '',
				localCode: '',
				barCode: ''
			},
			list: []
		};
	},
	onLoad(option) {
		this.model.mainCode = option.id;
	},
	onShow() {
		this.initData();
		//#ifdef APP-PLUS
		this.barCode = nfcinit();
		//#endif
	},
	onHide() {
		//#ifdef APP-PLUS
		nfcclose();
		//#endif
	},
	watch: {
		barCode(val) {
			if (val.endsWith("#") || val.length == 13) {
				this.bindConfirm()
			}
		}
	},
	methods: {
		initData() {
			this.request({
				url: 'WmsOutStorage/detail',
				data: {
					id: this.model.mainCode
				},
				success: res => {
					let dt = res.data;
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
		bindConfirm() {
			this.model.barCode = this.barCode.replace("#","");
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
				this.request({
					url: 'WmsOutStorage/putDown',
					method: 'POST',
					data: this.model,
					success: res => {
						if (res.code == 200) {
							if (res.data == '1') {
								uni.navigateBack();
							} else {
								this.initData();
							}
						} else {
							this.$u.toast(res.msg);
						}
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
