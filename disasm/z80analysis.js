$estr = function() { return js.Boot.__string_rec(this,''); }
if(typeof js=='undefined') js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__unhtml(js.Boot.__string_rec(v,"")) + "<br/>";
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("No haxe:trace element defined\n" + msg); else d.innerHTML += msg;
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	};
	f1.scope = o;
	f1.method = m;
	return f1;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return null;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	$closure = js.Boot.__closure;
}
js.Boot.prototype.__class__ = js.Boot;
if(typeof haxe=='undefined') haxe = {}
haxe.Http = function(url) {
	if( url === $_ ) return;
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
}
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype.url = null;
haxe.Http.prototype.async = null;
haxe.Http.prototype.postData = null;
haxe.Http.prototype.headers = null;
haxe.Http.prototype.params = null;
haxe.Http.prototype.setHeader = function(header,value) {
	this.headers.set(header,value);
}
haxe.Http.prototype.setParameter = function(param,value) {
	this.params.set(param,value);
}
haxe.Http.prototype.setPostData = function(data) {
	this.postData = data;
}
haxe.Http.prototype.request = function(post) {
	var me = this;
	var r = new js.XMLHttpRequest();
	var onreadystatechange = function() {
		if(r.readyState != 4) return;
		var s = (function($this) {
			var $r;
			try {
				$r = r.status;
			} catch( e ) {
				$r = null;
			}
			return $r;
		}(this));
		if(s == undefined) s = null;
		if(s != null) me.onStatus(s);
		if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
		case null: case undefined:
			me.onError("Failed to connect or resolve host");
			break;
		case 12029:
			me.onError("Failed to connect to host");
			break;
		case 12007:
			me.onError("Unknown host");
			break;
		default:
			me.onError("Http Error #" + r.status);
		}
	};
	if(this.async) r.onreadystatechange = onreadystatechange;
	var uri = this.postData;
	if(uri != null) post = true; else {
		var $it0 = this.params.keys();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			if(uri == null) uri = ""; else uri += "&";
			uri += StringTools.urlDecode(p) + "=" + StringTools.urlEncode(this.params.get(p));
		}
	}
	try {
		if(post) r.open("POST",this.url,this.async); else if(uri != null) {
			var question = this.url.split("?").length <= 1;
			r.open("GET",this.url + (question?"?":"&") + uri,this.async);
			uri = null;
		} else r.open("GET",this.url,this.async);
	} catch( e ) {
		this.onError(e.toString());
		return;
	}
	if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var $it1 = this.headers.keys();
	while( $it1.hasNext() ) {
		var h = $it1.next();
		r.setRequestHeader(h,this.headers.get(h));
	}
	r.send(uri);
	if(!this.async) onreadystatechange();
}
haxe.Http.prototype.onData = function(data) {
}
haxe.Http.prototype.onError = function(msg) {
}
haxe.Http.prototype.onStatus = function(status) {
}
haxe.Http.prototype.__class__ = haxe.Http;
js.Lib = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype.__class__ = js.Lib;
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = function(length,b) {
	if( length === $_ ) return;
	this.length = length;
	this.b = b;
}
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.cca(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype.length = null;
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.get = function(pos) {
	return this.b[pos];
}
haxe.io.Bytes.prototype.set = function(pos,v) {
	this.b[pos] = v & 255;
}
haxe.io.Bytes.prototype.blit = function(pos,src,srcpos,len) {
	if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	if(b1 == b2 && pos > srcpos) {
		var i = len;
		while(i > 0) {
			i--;
			b1[i + pos] = b2[i + srcpos];
		}
		return;
	}
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		b1[i + pos] = b2[i + srcpos];
	}
}
haxe.io.Bytes.prototype.sub = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
}
haxe.io.Bytes.prototype.compare = function(other) {
	var b1 = this.b;
	var b2 = other.b;
	var len = this.length < other.length?this.length:other.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		if(b1[i] != b2[i]) return b1[i] - b2[i];
	}
	return this.length - other.length;
}
haxe.io.Bytes.prototype.readString = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	var s = "";
	var b = this.b;
	var fcc = String.fromCharCode;
	var i = pos;
	var max = pos + len;
	while(i < max) {
		var c = b[i++];
		if(c < 128) {
			if(c == 0) break;
			s += fcc(c);
		} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
			var c2 = b[i++];
			s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
		} else {
			var c2 = b[i++];
			var c3 = b[i++];
			s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
		}
	}
	return s;
}
haxe.io.Bytes.prototype.toString = function() {
	return this.readString(0,this.length);
}
haxe.io.Bytes.prototype.toHex = function() {
	var s = new StringBuf();
	var chars = [];
	var str = "0123456789abcdef";
	var _g1 = 0, _g = str.length;
	while(_g1 < _g) {
		var i = _g1++;
		chars.push(str.charCodeAt(i));
	}
	var _g1 = 0, _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = this.b[i];
		s.b[s.b.length] = String.fromCharCode(chars[c >> 4]);
		s.b[s.b.length] = String.fromCharCode(chars[c & 15]);
	}
	return s.b.join("");
}
haxe.io.Bytes.prototype.getData = function() {
	return this.b;
}
haxe.io.Bytes.prototype.__class__ = haxe.io.Bytes;
ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl;
	try {
		cl = eval(name);
	} catch( e ) {
		cl = null;
	}
	if(cl == null || cl.__name__ == null) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e;
	try {
		e = eval(name);
	} catch( err ) {
		e = null;
	}
	if(e == null || e.__ename__ == null) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	if(args.length <= 3) return new cl(args[0],args[1],args[2]);
	if(args.length > 8) throw "Too many arguments";
	return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
}
Type.createEmptyInstance = function(cl) {
	return new cl($_);
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = Reflect.fields(c.prototype);
	a.remove("__class__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.copy();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ != null) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.prototype.__class__ = Type;
MSXemulator = function(bin,start,entry,annBin) {
	if( bin === $_ ) return;
	this.bin = bin;
	this.start = start;
	this.entry = this.PC = entry;
	this.annBin = annBin;
	this.memory = new Array();
	this.di = false;
	this.AF = 0;
	this.BC = 0;
	this.DE = 0;
	this.HL = 0;
	this.SP = 65520;
}
MSXemulator.__name__ = ["MSXemulator"];
MSXemulator.prototype.annBin = null;
MSXemulator.prototype.bin = null;
MSXemulator.prototype.start = null;
MSXemulator.prototype.entry = null;
MSXemulator.prototype.memory = null;
MSXemulator.prototype.AF = null;
MSXemulator.prototype.BC = null;
MSXemulator.prototype.DE = null;
MSXemulator.prototype.HL = null;
MSXemulator.prototype.IX = null;
MSXemulator.prototype.IY = null;
MSXemulator.prototype.SP = null;
MSXemulator.prototype.PC = null;
MSXemulator.prototype.di = null;
MSXemulator.prototype.run = function() {
	while(true) this.step();
}
MSXemulator.prototype.step = function() {
	if(((function($this) {
		var $r;
		var $t = $this.annBin[$this.PC][1];
		if(Std["is"]($t,String)) $t; else throw "Class cast error";
		$r = $t;
		return $r;
	}(this))).indexOf("Illegal") > -1) {
	}
	this.cpu(this.annBin[this.PC][0],this.annBin[this.PC][1]);
}
MSXemulator.prototype.out = function(port,value) {
	var _p = StringTools.hex(port);
}
MSXemulator.prototype.bios = function(addr) {
	var _a = StringTools.hex(addr);
	this.PC = this.pop2();
}
MSXemulator.prototype.poke = function(addr,val) {
	this.memory[addr] = val;
}
MSXemulator.prototype.peek = function(addr) {
	if(this.memory[addr] == null) this.memory[addr] = 0;
	return this.memory[addr];
}
MSXemulator.prototype.hi = function(value) {
	return (value & 65280) >> 8;
}
MSXemulator.prototype.lo = function(value) {
	return value & 255;
}
MSXemulator.prototype.setLo = function(value,newlo) {
	return (value & 65280) + newlo;
}
MSXemulator.prototype.setHi = function(value,newhi) {
	return (value & 255) + (newhi << 8);
}
MSXemulator.prototype.write16bit = function(addrs,value) {
	var hi = this.hi(value);
	var lo = this.lo(value);
	this.poke(addrs,lo);
	this.poke(addrs + 1,hi);
}
MSXemulator.prototype.push = function(lo,hi) {
	if(hi == null) hi = -1;
	if(lo > 255) {
		this.write16bit(this.SP,lo);
		this.SP += 2;
	} else {
		this.poke(this.SP++,lo);
		if(hi >= 0) this.poke(this.SP++,hi);
	}
}
MSXemulator.prototype.pop2 = function() {
	return this.pop(2);
}
MSXemulator.prototype.pop = function(bytes) {
	if(bytes == null) bytes = 1;
	this.SP -= bytes;
	var res = null;
	if(bytes == 2) res = this.peek(this.SP) + 256 * this.peek(this.SP + 1); else res = this.peek(this.SP);
	return res;
}
MSXemulator.prototype.debug = function(str) {
	var line = "AF = " + StringTools.hex(this.AF) + ", " + "BC = " + StringTools.hex(this.BC) + ", " + "DE = " + StringTools.hex(this.DE) + ", " + "HL = " + StringTools.hex(this.HL) + ", " + "SP = " + StringTools.hex(this.SP) + ", " + "PC = " + StringTools.hex(this.PC);
}
MSXemulator.prototype.setF = function(val) {
	this.AF = this.setLo(this.AF,this.lo(val));
}
MSXemulator.prototype.flag = function(val,bytes) {
	if(bytes == null) bytes = 1;
	var hval = val;
	if(bytes == 2) hval = this.hi(val);
	this.setF(this.AF | hval & 128);
	if(val == 0) this.setF(this.AF | 64); else this.setF(this.AF & 191);
	this.setF(this.AF | val & 32);
	this.setF(this.AF | val & 8);
}
MSXemulator.prototype.add = function(val,a,bytes) {
	if(bytes == null) bytes = 1;
	var max = bytes == 1?255:65535;
	var nval = val;
	if(val + a > max) {
		nval = val + a - (max + 1);
		this.setF(this.AF | 1);
	} else {
		nval += a;
		this.setF(this.AF & 254);
	}
	this.setF(this.AF & 223);
	var nmax = max >> 8;
	if(((val & nmax) + (a & nmax) & nmax + 1) != 0) this.setF(this.AF | 16); else this.setF(this.AF & 239);
	this.flag(nval,bytes);
	return nval;
}
MSXemulator.prototype.sub = function(val,a,bytes) {
	if(bytes == null) bytes = 1;
	var max = bytes == 1?255:65535;
	var nval = val;
	if(val - a < 0) {
		nval = max + 1 + (val - a);
		this.setF(this.AF | 1);
	} else {
		nval -= a;
		this.setF(this.AF & 254);
	}
	this.setF(this.AF | 2);
	var nmax = max >> 8;
	if(((val & nmax) - (a & nmax) & nmax + 1) != 0) this.setF(this.AF | 16); else this.setF(this.AF & 239);
	this.flag(nval,bytes);
	return nval;
}
MSXemulator.prototype.add2 = function(val,a) {
	return this.add(val,a,2);
}
MSXemulator.prototype.sub2 = function(val,a) {
	return this.sub(val,a,2);
}
MSXemulator.prototype.dec = function(val) {
	return this.sub(val,1);
}
MSXemulator.prototype.dec2 = function(val) {
	return this.sub2(val,1);
}
MSXemulator.prototype.inc = function(val) {
	return this.add(val,1);
}
MSXemulator.prototype.inc2 = function(val) {
	return this.add2(val,1);
}
MSXemulator.prototype.cpu = function(instr,info) {
	this.debug("Calling: " + info);
	switch(instr[0]) {
	case 0:
		break;
	case 1:
		this.BC = instr[1] + 256 * instr[2];
		break;
	case 2:
		this.poke(this.BC,this.hi(this.AF));
		break;
	case 3:
		this.BC = this.inc2(this.BC);
		break;
	case 4:
		this.BC = this.setHi(this.BC,this.dec(this.hi(this.BC)));
		break;
	case 6:
		this.BC = this.setHi(this.BC,instr[1]);
		break;
	case 10:
		this.AF = this.setHi(this.AF,this.peek(this.BC));
		break;
	case 11:
		this.BC = this.dec2(this.BC);
		break;
	case 13:
		this.BC = this.setLo(this.BC,this.dec(this.lo(this.BC)));
		break;
	case 14:
		this.BC = this.setLo(this.BC,instr[1]);
		break;
	case 19:
		this.DE = this.inc2(this.DE);
		break;
	case 32:
		if((this.AF & 64) == 0) {
			var oAF = this.AF;
			this.PC = this.add2(this.PC,instr[1]);
			this.AF = oAF;
			return;
		}
		break;
	case 33:
		this.HL = instr[1] + 256 * instr[2];
		break;
	case 34:
		this.write16bit(instr[1] + 256 * instr[2],this.HL);
		break;
	case 35:
		this.HL = this.inc2(this.HL);
		break;
	case 40:
		if((this.AF & 64) != 0) {
			var oAF = this.AF;
			this.PC = this.add2(this.PC,instr[1]);
			this.AF = oAF;
			return;
		}
		break;
	case 42:
		this.HL = this.setHi(this.HL,this.peek(instr[1] + 256 * instr[2] + 1));
		this.HL = this.setLo(this.HL,this.peek(instr[1] + 256 * instr[2]));
		break;
	case 49:
		this.SP = instr[1] + 256 * instr[2];
		break;
	case 50:
		this.memory[instr[1] + 256 * instr[2]] = this.hi(this.AF);
		break;
	case 54:
		this.memory[this.HL] = instr[1];
		break;
	case 58:
		this.AF = this.setHi(this.AF,this.peek(instr[1] + 256 * instr[2]));
		break;
	case 61:
		this.AF = this.setHi(this.AF,this.dec(this.hi(this.AF)));
		break;
	case 62:
		this.AF = this.setHi(this.AF,instr[1]);
		break;
	case 84:
		this.DE = this.setHi(this.DE,this.hi(this.HL));
		break;
	case 93:
		this.DE = this.setLo(this.DE,this.lo(this.HL));
		break;
	case 119:
		this.memory[this.HL] = this.hi(this.AF);
		break;
	case 120:
		this.AF = this.setHi(this.AF,(this.BC & 65280) >> 8);
		break;
	case 127:
		break;
	case 177:
		this.AF = this.setHi(this.AF,this.BC & 255 | this.hi(this.AF));
		this.flag(this.hi(this.AF));
		break;
	case 194:
		if((this.AF & 64) == 0) {
			this.PC = instr[1] + 256 * instr[2];
			return;
		}
		break;
	case 195:
		this.PC = instr[1] + 256 * instr[2];
		return;
	case 201:
		this.PC = this.pop2();
		return;
	case 203:
		switch(instr[1]) {
		case 135:
			this.AF = this.setHi(this.AF,this.AF & 254);
			break;
		}
		break;
	case 205:
		this.push(this.add2(this.PC,instr.length));
		if(info.indexOf("BIOS:") > 0) this.bios(instr[1] + 256 * instr[2]); else this.PC = instr[1] + 256 * instr[2];
		return;
	case 211:
		this.out(instr[1],this.hi(this.AF));
		break;
	case 237:
		switch(instr[1]) {
		case 171:
			this.out(this.lo(this.BC),this.peek(this.HL));
			this.HL = this.dec2(this.HL);
			this.BC = this.setHi(this.BC,this.dec(this.hi(this.BC)));
			break;
		case 176:
			while(this.BC > 0) {
				this.write16bit(this.DE,this.peek(this.HL));
				this.DE = this.inc(this.DE);
				this.HL = this.inc(this.HL);
				this.BC = this.dec2(this.BC);
			}
			break;
		case 65:
			this.out(this.lo(this.BC),this.hi(this.BC));
			break;
		default:
		}
		break;
	case 242:
		if((this.AF & 128) != 0) {
			this.PC = instr[1] + 256 * instr[2];
			return;
		}
		break;
	case 243:
		this.di = true;
		break;
	default:
	}
	var oAF = this.AF;
	this.PC = this.add2(this.PC,instr.length);
	this.AF = oAF;
	this.debug("Result: " + info);
}
MSXemulator.prototype.__class__ = MSXemulator;
Std = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype.__class__ = Std;
haxe.io.Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && s.substr(0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && s.substr(slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return s.substr(r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return s.substr(0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += c.substr(0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += c.substr(0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.cca(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
StringTools.prototype.__class__ = StringTools;
Hash = function(p) {
	if( p === $_ ) return;
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
}
Hash.__name__ = ["Hash"];
Hash.prototype.h = null;
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
}
Hash.prototype.get = function(key) {
	return this.h["$" + key];
}
Hash.prototype.exists = function(key) {
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	} catch( e ) {
		for(var i in this.h) if( i == key ) return true;
		return false;
	}
}
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
}
Hash.prototype.keys = function() {
	var a = new Array();
	for(var i in this.h) a.push(i.substr(1));
	return a.iterator();
}
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}};
}
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{" == null?"null":"{";
	var it = this.keys();
	while( it.hasNext() ) {
		var i = it.next();
		s.b[s.b.length] = i == null?"null":i;
		s.b[s.b.length] = " => " == null?"null":" => ";
		s.add(Std.string(this.get(i)));
		if(it.hasNext()) s.b[s.b.length] = ", " == null?"null":", ";
	}
	s.b[s.b.length] = "}" == null?"null":"}";
	return s.b.join("");
}
Hash.prototype.__class__ = Hash;
Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	var $it0 = arr.iterator();
	while( $it0.hasNext() ) {
		var t = $it0.next();
		if(t == field) return true;
	}
	return false;
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		for(var i in o) if( o.hasOwnProperty(i) ) a.push(i);
	} else {
		var t;
		try {
			t = o.__proto__;
		} catch( e ) {
			t = null;
		}
		if(t != null) o.__proto__ = null;
		for(var i in o) if( i != "__proto__" ) a.push(i);
		if(t != null) o.__proto__ = t;
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && f.__name__ == null;
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && v.__name__ != null;
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = new Array();
		var _g1 = 0, _g = arguments.length;
		while(_g1 < _g) {
			var i = _g1++;
			a.push(arguments[i]);
		}
		return f(a);
	};
}
Reflect.prototype.__class__ = Reflect;
StringBuf = function(p) {
	if( p === $_ ) return;
	this.b = new Array();
}
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x == null?"null":x;
}
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
}
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
}
StringBuf.prototype.toString = function() {
	return this.b.join("");
}
StringBuf.prototype.b = null;
StringBuf.prototype.__class__ = StringBuf;
Z80Analysis = function() { }
Z80Analysis.__name__ = ["Z80Analysis"];
Z80Analysis.bios = null;
Z80Analysis.ios = null;
Z80Analysis.arch = null;
Z80Analysis.argh = null;
Z80Analysis.isCalcChar = function(c) {
	return c == "*" || c == "+";
}
Z80Analysis.simpleCalc = function(calc) {
	var i = calc.indexOf("*");
	while(i > -1) {
		var j = i - 1;
		while(j > 0 && !Z80Analysis.isCalcChar(calc.charAt(j - 1))) j--;
		var k = i + 1;
		while(k < calc.length && !Z80Analysis.isCalcChar(calc.charAt(k))) k++;
		var _mult = calc.substr(j,k - j);
		var mult = _mult.split("*");
		var res = StringTools.hex(Std.parseInt("0x" + mult[0]) * Std.parseInt("0x" + mult[1]));
		calc = StringTools.replace(calc,_mult,res);
		i = calc.indexOf("*");
	}
	var i1 = calc.indexOf("+");
	while(i1 > -1) {
		var j = i1 - 1;
		while(j > 0 && !Z80Analysis.isCalcChar(calc.charAt(j - 1))) j--;
		var k = i1 + 1;
		while(k < calc.length && !Z80Analysis.isCalcChar(calc.charAt(k))) k++;
		var _add = calc.substr(j,k - j);
		var add = _add.split("+");
		var res = StringTools.hex(Std.parseInt("0x" + add[0]) + Std.parseInt("0x" + add[1]));
		calc = StringTools.replace(calc,_add,res);
		i1 = calc.indexOf("*");
	}
	return calc;
}
Z80Analysis.expandRegs = function(op,oplookup,_opc,stor) {
	var reglist = ["B","C","D","E","H","L","(HL)","A"];
	var nop = Std.parseInt("0x" + StringTools.replace(_opc[op],"+r",""));
	var _g1 = 0, _g = reglist.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _nop = StringTools.hex(nop + i,2);
		var _stor = [StringTools.replace(stor[0],"r","" + reglist[i]),StringTools.replace(stor[1],_opc[op],_nop),stor[2],stor[3],stor[4]];
		Z80Analysis.add(oplookup,_stor[1].split(" "),_stor);
	}
}
Z80Analysis.expand3bits = function(oplookup,_opc,stor) {
	var opc = null;
	var _g1 = 0, _g = _opc.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(_opc[i].indexOf("*b") > 0) {
			opc = _opc[i];
			break;
		}
	}
	if(opc != null) {
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			var res = Z80Analysis.simpleCalc(StringTools.replace(opc,"b",StringTools.hex(i)));
			var _stor = [StringTools.replace(stor[0],"b",StringTools.hex(i)),StringTools.replace(stor[1],opc,res),stor[2],stor[3],stor[4]];
			if(_stor[1].indexOf("+r") > 0) {
				_opc = _stor[1].split(" ");
				var _g2 = 0, _g1 = _opc.length;
				while(_g2 < _g1) {
					var j = _g2++;
					if(_opc[j].indexOf("+r") > 0) {
						Z80Analysis.expandRegs(j,oplookup,_opc,_stor);
						break;
					}
				}
			} else Z80Analysis.add(oplookup,_stor[1].split(" "),_stor);
		}
	}
}
Z80Analysis.resNbit = function(r,bin,i,stor) {
	if(stor[0].indexOf(r) < 0) return stor;
	var opc = stor[1].split(" ");
	var nr = "";
	var _g1 = 0, _g = opc.length;
	while(_g1 < _g) {
		var j = _g1++;
		if(opc[j].indexOf(r + r) > -1) nr = StringTools.hex(bin.get(i + j),2) + nr;
	}
	var tmp = StringTools.replace(stor[0],r + r,"0" + nr + "h");
	tmp = StringTools.replace(tmp,r,"0" + nr + "h");
	var info = null;
	if(Z80Analysis.arch == "msx") {
		if(opc[0] == "CD" && Z80Analysis.bios.exists(nr)) info = "BIOS: " + Z80Analysis.bios.get(nr);
		if((opc[0] == "D3" || opc[0] == "DB") && Z80Analysis.ios.exists(nr)) info = "IOPORT: " + Z80Analysis.ios.get(nr);
	}
	stor = [tmp,stor[1],stor[2],stor[3],stor[4],info];
	return stor;
}
Z80Analysis.add = function(oplookup,_opc,stor) {
	if(oplookup.exists(_opc[0])) {
		if(stor[2] < 2) return;
		if(stor[1].indexOf("*b",0) > 0) {
			Z80Analysis.expand3bits(oplookup,_opc,stor);
			return;
		}
		if(_opc[1].indexOf("+r") > 0) {
			Z80Analysis.expandRegs(1,oplookup,_opc,stor);
			return;
		}
		var lu = oplookup.get(_opc[0]);
		if(Type.getClassName(Type.getClass(lu)) == "Hash") lu.set(_opc[1],stor); else {
			var oopc = lu[1].split(" ");
			var combl = new Hash();
			combl.set(oopc[1],lu);
			combl.set(_opc[1],stor);
			oplookup.set(_opc[0],combl);
		}
	} else if(_opc[0].indexOf("+r") > 0) Z80Analysis.expandRegs(0,oplookup,_opc,stor); else oplookup.set(_opc[0],stor);
}
Z80Analysis.echo = function(str,target) {
	if(target == null) target = "notice";
	js.Lib.document.getElementById(target).innerHTML = str;
}
Z80Analysis.usage = function() {
	var usage = "Usage: -f <file> binary file (.rom .bin) " + "-a <arch> architecture (msx) " + "-s <addr> startaddress (0x8000) " + "-b list bios calls first " + "-e run annotated emulator (experimental) ";
	Z80Analysis.echo(usage);
	Z80Analysis.echo("<br />\n");
}
Z80Analysis.argParse = function() {
	var _args = js.Lib.document.getElementById("args");
	if(_args == null) Z80Analysis.usage();
	var args = _args.getAttribute("value").split(" ");
	var i = 0;
	Z80Analysis.argh = new Hash();
	while(i < args.length) if(args[i].charAt(0) == "-") {
		var _arg = null;
		if(i + 1 == args.length || args[i + 1].charAt(0) == "-") _arg = "."; else _arg = args[i + 1];
		Z80Analysis.argh.set(args[i].substr(1),_arg);
		i += 2;
	} else Z80Analysis.usage();
}
Z80Analysis.main = function() {
	var opcodes = haxe.Http.requestUrl("z80.csv");
	var _opcodes = opcodes.split("\r");
	var oplookup = new Hash();
	var _g1 = 2, _g = _opcodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var l = _opcodes[i];
		var c = l.indexOf("\",");
		var instr, z80t, r800t, opc, len;
		if(c > 0) {
			l = l.substr(1,c - 1) + l.substr(c + 1);
			c -= 1;
		} else c = l.indexOf(",");
		instr = l.substr(0,c);
		l = l.substr(c + 1);
		var tmp = l.split(",");
		z80t = tmp[0];
		r800t = tmp[1];
		opc = tmp[2];
		len = Std.parseInt(tmp[3]);
		if(opc == null) continue;
		var _opc = opc.split(" ");
		var stor = [instr,opc,len,z80t,r800t];
		Z80Analysis.add(oplookup,_opc,stor);
	}
	Z80Analysis.argParse();
	if(!Z80Analysis.argh.exists("f")) Z80Analysis.usage();
	var file = Z80Analysis.argh.get("f");
	Z80Analysis.arch = Z80Analysis.argh.exists("a")?Z80Analysis.argh.get("a"):"msx";
	if(Z80Analysis.arch == "msx") {
		var bioshtml = haxe.Http.requestUrl("msxbios.html");
		var i = bioshtml.indexOf("<h3");
		Z80Analysis.bios = new Hash();
		while(i > -1) {
			var j = bioshtml.indexOf("</pre>",i);
			var bioscall = bioshtml.substr(i,j - i);
			if(bioscall == null) {
				Z80Analysis.echo("Could not read BIOS","notice");
				break;
			}
			var l = bioscall.indexOf("#");
			var addr = bioscall.substr(l + 1,4);
			l = bioscall.indexOf(">");
			var name = bioscall.substr(l + 1,bioscall.indexOf("<",l) - l - 1);
			l = bioscall.indexOf("Function");
			l = bioscall.indexOf(":",l);
			var func = StringTools.trim(bioscall.substr(l + 1,bioscall.indexOf("\n",l) - l - 1));
			i = bioshtml.indexOf("<h3",j);
		}
		var ioportshtml = haxe.Http.requestUrl("ioports.html");
		i = ioportshtml.indexOf("<th>Port range</th>");
		var j = ioportshtml.indexOf("</table>",i);
		ioportshtml = ioportshtml.substr(i,j - i);
		i = ioportshtml.indexOf("<tr>");
		Z80Analysis.ios = new Hash();
		while(i > -1) {
			j = ioportshtml.indexOf("</tr>",i);
			var ioport = ioportshtml.substr(i,j - i);
			var k = ioport.indexOf("<td>");
			var ports = StringTools.trim(ioport.substr(k + 4,k = ioport.indexOf("</",k + 4)));
			k = ioport.indexOf("<td>",k + 4);
			var descr = StringTools.trim(ioport.substr(k + 4,ioport.indexOf("</",k + 4)));
			var ps = new Array();
			if(ports.indexOf("-") > 0) {
				var sp = ports.split("-");
				if(sp[0].charAt(0) == "#") sp[0] = sp[0].substr(1);
				if(sp[1].charAt(0) == "#") sp[1] = sp[1].substr(1);
				var i1 = Std.parseInt("0x" + sp[0]);
				var i2 = Std.parseInt("0x" + sp[1]);
				var _g = i1;
				while(_g < i2) {
					var l = _g++;
					Z80Analysis.ios.set(StringTools.hex(l),descr);
				}
			} else Z80Analysis.ios.set(ports.substr(1),descr);
			i = ioportshtml.indexOf("<tr>",j);
		}
	}
	var bin = null;
	var i = 0;
	var start = 32768;
	var entry = start;
	if(Z80Analysis.arch == "msx" && file.indexOf(".rom") > 0) {
		entry = bin.b[2] + 256 * bin.b[3];
		Z80Analysis.echo("; Entry address for rom: " + StringTools.hex(entry),"notice");
		start = entry & 61440;
	}
	if(Z80Analysis.argh.exists("s")) start = Std.parseInt(Z80Analysis.argh.get("s"));
	var annotatedBin = new Array();
	js.Lib.alert(bin.length);
	while(i < bin.length) {
		var op = StringTools.hex(bin.b[i],2);
		var op1 = null;
		if(i + 1 < bin.length - 1) op1 = StringTools.hex(bin.b[i + 1],2);
		var lu = oplookup.get(op);
		var res = null;
		if(op1 != null && Type.getClassName(Type.getClass(lu)) == "Hash") res = lu.get(op1); else res = lu;
		if(res == null) {
			if(!Z80Analysis.argh.exists("b") && !Z80Analysis.argh.exists("e")) Z80Analysis.echo("Illegal sequence: " + op + ", next(" + op1 + ") on " + StringTools.hex(start + i,4),"notice");
			annotatedBin[start + i] = [[bin.b[i],bin.b[i + 1]],"Illegal: " + op + ", " + op1];
			i++;
			continue;
		}
		res = Z80Analysis.resNbit("n",bin,i,res);
		res = Z80Analysis.resNbit("o",bin,i,res);
		var instr = new Array();
		var addr = StringTools.hex(start + i,4);
		var line = addr + " : ";
		var _g1 = 0, _g = res[2];
		while(_g1 < _g) {
			var j = _g1++;
			line += StringTools.hex(bin.b[i + j],2) + " ";
			instr[j] = bin.b[i + j];
		}
		line += ": ";
		line += res[0].toString();
		if(res[5] != null) line += " : " + res[5];
		if(!Z80Analysis.argh.exists("e") && (!Z80Analysis.argh.exists("b") || res[5] != null && res[5].substr(0,4) == "BIOS")) Z80Analysis.echo(line,"notice");
		annotatedBin[start + i] = [instr,line];
		i += Std["int"](res[2]);
	}
}
Z80Analysis.prototype.__class__ = Z80Analysis;
IntIter = function(min,max) {
	if( min === $_ ) return;
	this.min = min;
	this.max = max;
}
IntIter.__name__ = ["IntIter"];
IntIter.prototype.min = null;
IntIter.prototype.max = null;
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
}
IntIter.prototype.next = function() {
	return this.min++;
}
IntIter.prototype.__class__ = IntIter;
$_ = {}
js.Boot.__res = {}
js.Boot.__init();
{
	js.Lib.document = document;
	js.Lib.window = window;
	onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if( f == null )
			return false;
		return f(msg,[url+":"+line]);
	}
}
{
	String.prototype.__class__ = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = Array;
	Array.__name__ = ["Array"];
	Int = { __name__ : ["Int"]};
	Dynamic = { __name__ : ["Dynamic"]};
	Float = Number;
	Float.__name__ = ["Float"];
	Bool = { __ename__ : ["Bool"]};
	Class = { __name__ : ["Class"]};
	Enum = { };
	Void = { __ename__ : ["Void"]};
}
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
}
js["XMLHttpRequest"] = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
js.Lib.onerror = null;
Z80Analysis.main()