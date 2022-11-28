'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
		let res = '';
		for(var i = 0; i < 6; i++) res += Math.floor(Math.random()*10);
		
	
	//返回数据给客户端
	return res
};
