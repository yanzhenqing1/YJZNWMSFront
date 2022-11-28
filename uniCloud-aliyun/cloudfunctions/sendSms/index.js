'use strict';
exports.main = async (event, context) => {
	try {
			const res = await uniCloud.sendSms({
	            //uni-app应用标识，请替换为自己Dcloud appID
				appid: '__UNI__B061961',            
	 
				//请填写自己开通短信中的账号 API 密钥，如开通服务中第二张图上
				smsKey: 'dc20c58434c9b9396b4784db1d9022b7',        
				smsSecret: '380819731476afc9a849e0afab2f3fe9',
	 
	            // 请替换为自己申请的短信模板id
				templateId: '16226',                
	 
				//调用接口传入参数
				phone: event.phone,
				data: event.data
			})
			// 调用成功，请注意这时不代表发送成功
			return res
		} catch(err) {
			// 调用失败
			console.log(err.errCode)
			console.log(err.errMsg)
			return {
				code: err.errCode,
				msg: err.errMsg
			}
	}
};


