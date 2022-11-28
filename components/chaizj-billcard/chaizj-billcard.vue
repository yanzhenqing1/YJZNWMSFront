<template>
	<view>
		<view class="card" @click="morebtn()">
			<view class="neirong">
				<view class="biaoti1"><text>{{title}}</text></view>
				<view class="biaoti2"><text>{{typename}}</text></view>
				<view class="biaoti3"><text>{{time}}</text></view>
				<view class="biaoti4"><text>{{price}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * billcard 自定义账单卡片
	 * @description 账单卡片组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=30
	 * @property {Number} title 标题，默认100px/秒
	 * @property {String} typename 分类名
	 * @property {String} time 账单时间
	 * @property {String} price 价格
	 * @property {String} value 点击返回值
	 * @event {Function} morebtn 点击 NoticeBar 触发事件
	 */
	export default {
		name: "billcard",
		emits: ['morebtn'],
		props: {
			title: {
				type: String,
				default: '支付宝转入到余额宝' // view|canvas
			},
			typename: {
				type: String,
				default: '投资理财' // view|canvas
			},
			time: {
				type: String,
				default: '2022-01-02 04:07' // view|canvas
			},
			price: {
				type: String,
				default: '280.00' // view|canvas
			},
			value: {
				type: String,
				default: '1' // view|canvas
			}
		},
		data() {
			return {

			};
		},
		methods: {
			morebtn() {
				console.log("组件点击");
				this.$emit("morebtn", this.value);
			}
		}
	}
</script>

<style>
	.card {
		height: 200upx;
		background-color: #F8F8F8;
	}

	.neirong {
		margin-left: 50upx;
		width: 650upx;
		margin-right: 50upx;
	}

	.biaoti1 {
		font-size: 40upx;
		margin-top: 35upx;
	}

	.biaoti2 {
		font-size: 30upx;
		margin-top: 15upx;
		color: #666666;
	}

	.biaoti3 {
		font-size: 30upx;
		margin-top: 15upx;
		color: #666666;
	}

	.biaoti4 {
		width: 100%;
		font-size: 40upx;
		margin-top: -165upx;
		text-align: right;
		margin-right: 30upx;
		/* margin-left: 400upx; */
		color: #000000;
	}
</style>
