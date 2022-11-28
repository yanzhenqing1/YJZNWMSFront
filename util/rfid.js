//#ifdef APP-PLUS
let Context = plus.android.importClass("android.content.Context");
let NfcManager = plus.android.importClass("android.nfc.NfcManager");
let NfcAdapter = plus.android.importClass("android.nfc.NfcAdapter");
let Settings = plus.android.importClass("android.provider.Settings");
let Intent = plus.android.importClass("android.content.Intent");
let Parcelable = plus.android.importClass("android.os.Parcelable");
let PendingIntent = plus.android.importClass('android.app.PendingIntent');
let IntentFilter = plus.android.importClass('android.content.IntentFilter');
let NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
let NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
let Tag = plus.android.importClass("android.nfc.Tag");
let MifareClassic = plus.android.importClass("android.nfc.tech.MifareClassic");
let invoke = plus.android.invoke;

let barCode = '';
let sector = 2;
let keyType = 'A';
let keyVal = 'FFFFFFFFFFFF'; //FFFFFFFFFFFF
let ICUID = '';
let ICData = '';
let ICERROR = '';
let nfcAdapter = null;
let main = null;
let intent = null;
let IntervalId = null;
let techListsArray = [
	["android.nfc.tech.IsoDep"],
	["android.nfc.tech.NfcA"],
	["android.nfc.tech.NfcB"],
	["android.nfc.tech.NfcF"],
	["android.nfc.tech.NfcV"],
	["android.nfc.tech.Ndef"],
	["android.nfc.tech.NdefFormatable"],
	["android.nfc.tech.MifareClassic"],
	["android.nfc.tech.MifareUltralight"]
];
//#endif
function nfcinit() {
	main = plus.android.runtimeMainActivity();
	var nfchManager = main.getSystemService(Context.NFC_SERVICE);
	var nfcAdapter = nfchManager.getDefaultAdapter();
	if (!nfcAdapter.isEnabled()) {
		intent = new Intent(Settings.ACTION_NFC_SETTINGS);
		main.startActivity(intent);
	}
	var intent = new Intent(main, main.getClass());
	intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
	var pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
	var ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
	ndef.addDataType("*/*");
	var intentFiltersArray = [ndef];
	nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
	nfcAdapter = nfcAdapter;

	ICUID = '',
		ICData = '',
		ICERROR = '';
	// IntervalId = setInterval(function() {
	// 	handle_nfc_data();
	// }, 1000);
	handle_nfc_data();
	return barCode;
}

function nfcclose() {
	if (nfcAdapter)
		nfcAdapter.disableForegroundDispatch(main);
	nfcAdapter = null;
	clearInterval(IntervalId);
}

function handle_nfc_data() {
	var intent = main.getIntent();
	if (intent.getAction() == "android.nfc.action.TECH_DISCOVERED") {
		//clearInterval(IntervalId);
		readData(intent);
	}
}

function readData(intent) {
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
		ICERROR = '卡片类型错误!';
		return;
	}
	var mfc = MifareClassic.get(tag);
	if (!mfc) {
		ICERROR = '卡片获取错误!';
		return;
	}
	if (!mfc.isConnected()) {
		try {
			invoke(mfc, 'connect');
		} catch (e) {
			ICERROR = '卡片连接错误!';
			return;
		}
	}
	try {
		ICUID = ByteArrayToHexString(tag.getId());
		var cmdBytes = HexStringToByteArray(keyVal);
		var auth = false;
		if (keyType == "A") {
			auth = invoke(mfc, "authenticateSectorWithKeyA", parseInt(sector), cmdBytes);
		} else {
			auth = invoke(mfc, "authenticateSectorWithKeyB", parseInt(sector), cmdBytes);
		}
		if (!auth) {
			ICERROR = '扇区验证失败';
			console.log(ICERROR)
			return;
		}
		var sectorData = [];
		var tmpRet;
		ICData = '';
		for (var i = 0; i < 4; i++) {
			tmpRet = invoke(mfc, "readBlock", sector * 4 + i);
			var str = hextoString(ByteArrayToHexString(tmpRet));
			ICData = ICData + str;
			sectorData.push.apply(sectorData, tmpRet);
		}
		barCode = ICData.substring(0, 13);
		ICERROR = '读卡完成';
	} catch (e) {
		ICERROR = e.message;
		console.error(e);
	} finally {
		mfc.close();
	}
}

function ByteArrayToHexString(inarray) {
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
}

function HexStringToByteArray(instr) {
	var hexA = new Array();
	var pos = 0;
	var len = instr.length / 2;
	for (var i = 0; i < len; i++) {
		var s = instr.substr(pos, 2);
		var v = parseInt(s, 16);
		if (v >= 128)
			v = v - 256;
		hexA.push(v);
		pos += 2;
	}
	return hexA;
}

function hextoString(hex) {
	var arr = hex.split("")
	var out = ""
	for (var i = 0; i < arr.length / 2; i++) {
		var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
		var charValue = String.fromCharCode(tmp);
		out += charValue
	}
	return out
}

export {
	nfcinit,
	nfcclose
}
