<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<u-form :model="model" ref="uForm" style="width: 100%;">
				<u-form-item left-icon="grid" label-width="120" label="仓库:">
					<u-select v-model="show" :list="WarehouseList"></u-select>
					<input @click="show = true" type="select" />
					<!-- <u-icon slot="right" name="scan" @tap="scanCode(1)"></u-icon> -->
					
				</u-form-item>
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
		<view >
			<div>
				<u-tag :text="'入库单编号:'" class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'商品订单号:'" class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'商品编码:'" class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'入库类型:'" class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'商品名称:' " class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'供应商:'" class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'计划数量:' " class="u-m-r-20 u-m-t-20" />
			</div>
			<div>
				<u-tag :text="'已入库数量:' " class="u-m-r-20 u-m-t-20" />
			</div>
			<view class="u-demo-wrap u-m-t-20 u-p-t-10"></view>
		</view>
	</view>
</template>

<script>
import { nfcinit, nfcclose } from '@/util/rfid';
export default {
	data() {
		return {
			show: false,
			WarehouseList: [
				
				
			],
			form: {
				name: '',
				intro: '',
				sex:''
			},
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
		// this.model.mainCode = option.id;
	},
	onShow() {
		//查询仓库/库区
		uni.request({
			url: this.$website.url + 'WMS/getWarehouseList',
			data: {
				type:'get'
			},
			success: res => {
				uni.hideLoading();
				if (res.data.code == 200){
					console.log( "code："+res.data.code)
					console.log( "code："+res)
					console.log( "code："+res.data.data[0].warehouse_name)
					res.data.data.forEach(item => {
						this.WarehouseList.push(item.warehouse_name+"/"+item.warehouse_code)
					})
					console.log(this.WarehouseList)
				} else {
					this.$u.toast('获取服务器数据失败');
				}
			}
		});
		
	},
	onHide() {
		// //#ifdef APP-PLUS
		// nfcclose();
		// //#endif
	},
	watch: {
		barCode(val) {
			if (val.endsWith('#') || val.length == 13) {
				this.bindConfirm();
			}
		}
	},
	methods: {
		choiceUser(e){
			console.log("e==>",e)
			this.show=false;
			this.user=e.value[0].name;
		},
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
		initData() {
			this.request({
				url: 'WmsInStorage/detail',
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
					url: 'WmsInStorage/putOn',
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
		},
		nfcinit() {
			this.main = plus.android.runtimeMainActivity();
			var nfchManager = this.main.getSystemService(Context.NFC_SERVICE);
			var nfcAdapter = nfchManager.getDefaultAdapter();
			if (!nfcAdapter.isEnabled()) {
				this.intent = new Intent(Settings.ACTION_NFC_SETTINGS);
				this.main.startActivity(this.intent);
			}
			var intent = new Intent(this.main, this.main.getClass());
			intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			var pendingIntent = PendingIntent.getActivity(this.main, 0, intent, 0);
			var ndef = new IntentFilter('android.nfc.action.TECH_DISCOVERED');
			ndef.addDataType('*/*');
			var intentFiltersArray = [ndef];
			nfcAdapter.enableForegroundDispatch(this.main, pendingIntent, intentFiltersArray, this.techListsArray);
			this.nfcAdapter = nfcAdapter;
		},
		nfcclose() {
			if (this.nfcAdapter) this.nfcAdapter.disableForegroundDispatch(this.main);
			this.nfcAdapter = null;
			clearInterval(this.IntervalId);
		},
		handle_nfc_data() {
			var intent = this.main.getIntent();
			if (intent.getAction() == 'android.nfc.action.TECH_DISCOVERED') {
				//clearInterval(this.IntervalId);
				this.readData(intent);
			}
		},
		readData(intent) {
			var tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
			var techList = tag.getTechList();
			var bisMfc = false;
			for (var i = 0; i < techList.length; i++) {
				if (techList[i].indexOf('MifareClassic') >= 0) {
					bisMfc = true;
					break;
				}
			}
			if (!bisMfc) {
				this.ICERROR = '卡片类型错误!';
				return;
			}
			var mfc = MifareClassic.get(tag);
			if (!mfc) {
				this.ICERROR = '卡片获取错误!';
				return;
			}
			if (!mfc.isConnected()) {
				try {
					invoke(mfc, 'connect');
				} catch (e) {
					this.ICERROR = '卡片连接错误!';
					return;
				}
			}
			try {
				this.ICUID = this.ByteArrayToHexString(tag.getId());
				var cmdBytes = this.HexStringToByteArray(this.keyVal);
				var auth = false;
				if (this.keyType == 'A') {
					auth = invoke(mfc, 'authenticateSectorWithKeyA', parseInt(this.sector), cmdBytes);
				} else {
					auth = invoke(mfc, 'authenticateSectorWithKeyB', parseInt(this.sector), cmdBytes);
				}
				if (!auth) {
					this.ICERROR = '扇区验证失败';
					console.log(this.ICERROR);
					return;
				}
				var sectorData = [];
				var tmpRet;
				this.ICData = '';
				for (var i = 0; i < 4; i++) {
					tmpRet = invoke(mfc, 'readBlock', this.sector * 4 + i);
					var str = this.hextoString(this.ByteArrayToHexString(tmpRet));
					this.ICData = this.ICData + str;
					sectorData.push.apply(sectorData, tmpRet);
				}
				this.barCode = this.ICData.substring(0, 10);
				this.ICERROR = '读卡完成';
			} catch (e) {
				this.ICERROR = e.message;
				console.error(e);
			} finally {
				mfc.close();
			}
		},
		hextoString(hex) {
			var arr = hex.split('');
			var out = '';
			for (var i = 0; i < arr.length / 2; i++) {
				var tmp = '0x' + arr[i * 2] + arr[i * 2 + 1];
				var charValue = String.fromCharCode(tmp);
				out += charValue;
			}
			return out;
		},
		readcard() {
			var that = this;
			(this.ICUID = ''),
				(this.ICData = ''),
				(this.ICERROR = ''),
				(this.IntervalId = setInterval(function() {
					that.handle_nfc_data();
				}, 500));
		},
		ByteArrayToHexString(inarray) {
			var i, j, inn;
			var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
			var out = '';
			for (j = 0; j < inarray.length; ++j) {
				inn = inarray[j] & 0xff;
				i = (inn >>> 4) & 0x0f;
				out += hex[i];
				i = inn & 0x0f;
				out += hex[i];
			}
			return out;
		},
		HexStringToByteArray(instr) {
			var hexA = new Array();
			var pos = 0;
			var len = instr.length / 2;
			for (var i = 0; i < len; i++) {
				var s = instr.substr(pos, 2);
				var v = parseInt(s, 16);
				if (v >= 128) v = v - 256;
				hexA.push(v);
				pos += 2;
			}
			return hexA;
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

 