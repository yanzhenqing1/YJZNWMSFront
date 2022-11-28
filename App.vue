<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		
		//#ifdef APP-PLUS
		var server = "http://localhost:9099/api/account/appUpt"; //检查更新地址  
		plus.runtime.getProperty(plus.runtime.appid, (inf) => {
			this.wgtVer = inf.version;
			uni.request({
				url: server,
				data: {
					version: this.wgtVer
				},
				success: (res) => {
					let data = res.data
					if (data.code == 500) {
						uni.showModal({ //提醒用户更新  
							title: "更新提示",
							content: data.msg,
							success: (res) => {
								if (res.confirm) {
									plus.runtime.openURL(data.remark);
								}
							}
						})
					}
				}
			})
		});
		//#endif  
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/* 引入 uView 基础样式 */
@import 'uview-ui/index.scss';
@import 'uview-ui/demo.scss';

/* 引入 qs-ui 基础样式 */
@import 'qs-ui/theme.scss';

/* H5的时候，隐藏滚动条 */
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}
/* #endif */
</style>
