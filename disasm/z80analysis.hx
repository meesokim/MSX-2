/*
	TODO: 
	
	- Recognize files ; ROM files have headers which needs to be identified
	- Turn into HaXe package as 'z80dissassembler'
*/
#if neko
import neko.io.File;
import haxe.Int32;
#end
import StringTools;
import MSXemulator;


class Z80Analysis
{
 static var bios : Hash<Dynamic>;
 static var ios  : Hash<String>;
 static var arch : String;
 static var argh : Hash<String>;

 // limited calc function, ugly but we don't need more
 static function isCalcChar(c) {
 	return c == "*" || c == "+";
 }
 static function simpleCalc(calc : String) {
	// do * 
	var i = calc.indexOf("*");
	while(i > -1) { 
		var j = i-1; 
		while (j>0 && !isCalcChar(calc.charAt(j-1))) j--; 
		var k = i+1;
		while (k<calc.length && !isCalcChar(calc.charAt(k))) k++;
		var _mult = calc.substr(j, k-j);
		var mult = _mult.split("*");
		var res = StringTools.hex(Std.parseInt('0x' + mult[0]) * Std.parseInt('0x' + mult[1]));
		calc = StringTools.replace(calc, _mult, res);
		i = calc.indexOf("*");
	}
	// do + 
	var i = calc.indexOf("+");
	while(i > -1) { 
		var j = i-1; 
		while (j>0 && !isCalcChar(calc.charAt(j-1))) j--; 
		var k = i+1;
		while (k<calc.length && !isCalcChar(calc.charAt(k))) k++;
		var _add = calc.substr(j, k-j);
		var add = _add.split("+");
		var res = StringTools.hex(Std.parseInt('0x' + add[0]) + Std.parseInt('0x' + add[1]));
		calc = StringTools.replace(calc, _add, res);
		i = calc.indexOf("*");
	}	
	return calc;
 }
	
 // expand registers; +r cases
 static function expandRegs(op, oplookup : Hash<Dynamic>, _opc, stor : Array<Dynamic>) {
	var reglist = ["B", "C", "D", "E", "H", "L", "(HL)", "A"];
	var nop = Std.parseInt('0x' + StringTools.replace(_opc[op], "+r", ""));
	for (i in 0...reglist.length) {
		// [instr, opc, len, z80t, r800t];
		var _nop = StringTools.hex(nop + i, 2);
		var _stor = [StringTools.replace(stor[0], "r", ""+reglist[i]), 
				StringTools.replace(stor[1], _opc[op], _nop), stor[2], stor[3], stor[4]];
		add(oplookup, _stor[1].split(" "), _stor);
	}
 }

 // 3 bit calcs like 46+8*b etc
 static function expand3bits(oplookup : Hash<Dynamic>, _opc : Array<String>, stor : Array<Dynamic>) {
	var opc = null;
	for (i in 0..._opc.length) {
		if (_opc[i].indexOf("*b")>0) {
			opc = _opc[i];
			break;
		}
	}
	
 	if (opc!=null) for (i in 0...8) {
		var res = simpleCalc(StringTools.replace(opc, "b", StringTools.hex(i)));
		var _stor = [StringTools.replace(stor[0], "b", StringTools.hex(i)), 
				StringTools.replace(stor[1], opc, res), stor[2], stor[3], stor[4]];
				
		// 3bit calc + register
		if (_stor[1].indexOf("+r")>0) {
			_opc = _stor[1].split(" "); 
			for(j in 0..._opc.length) {
				if (_opc[j].indexOf("+r")>0) {
					expandRegs(j, oplookup, _opc, _stor);
					break;
				}
			}
		} else {
			add(oplookup, _stor[1].split(" "), _stor);
		}
	}
 }

 // hex numbers, when there are n or nn 
 static function resNbit(r, bin, i : Int, stor : Array<String>) {
	if (stor[0].indexOf(r)<0) return stor; // not needed, but he.
	
	var opc = stor[1].split(" ");
	var nr = "";
	for(j in 0...opc.length) {
		if (opc[j].indexOf(r+r)>-1) {
			nr = StringTools.hex(bin.get(i+j), 2) + nr;
		}
	}
	
	var tmp = StringTools.replace(stor[0], r+r, '0' + nr + 'h');
	tmp = StringTools.replace(tmp, r, '0' + nr + 'h');
	var info = null;
	if (arch == "msx") { // try to resolve some calls/outs/etc
		if (opc[0] == "CD" && bios.exists(nr)) { // see if this matches a bios call
			info = "BIOS: "+bios.get(nr);
		}
		if ((opc[0] == "D3" || opc[0]=="DB") && ios.exists(nr)) {
			info = "IOPORT: "+ios.get(nr);
		}
	}
	stor = [tmp,	
		stor[1], stor[2], stor[3], stor[4], info];

	return stor;
 }

  // add one value to the structure
  static function add(oplookup : Hash<Dynamic>, _opc, stor : Array<Dynamic>) {
	if (oplookup.exists(_opc[0])) {
		if (stor[2]<2) return;
	
		// 3bits calcs can also have regs, so much run this first!
		if (stor[1].indexOf("*b", 0)>0) {
			expand3bits(oplookup, _opc, stor); 
			return;
		}
		
		if (_opc[1].indexOf("+r")>0) {
			expandRegs(1, oplookup, _opc, stor);
			return;
		}
		
		var lu = oplookup.get(_opc[0]);
		if (Type.getClassName(Type.getClass(lu)) == "Hash") {
			lu.set(_opc[1], stor);
		} else {
			// get the old value and split it in another hash
			var oopc = lu[1].split(" ");			
			var combl = new Hash<Dynamic>();
			combl.set(oopc[1], lu);
			combl.set(_opc[1], stor);
			oplookup.set(_opc[0], combl);
		}
	} else {
		if (_opc[0].indexOf("+r")>0) {
			expandRegs(0, oplookup, _opc, stor);
		} else {
			oplookup.set(_opc[0], stor);
		}
	}
  }

	static function echo(str, target = "notice") {
		#if neko
		neko.Lib.println(str);
		#else
		js.Lib.document.getElementById(target).innerHTML = str;
		#end
	}
	static function usage() {
		var usage = "Usage: -f <file> binary file (.rom .bin) "+
		"-a <arch> architecture (msx) "+
		"-s <addr> startaddress (0x8000) "+
		"-b list bios calls first "+
		"-e run annotated emulator (experimental) ";
		
		echo(usage);
		
		#if neko
		neko.Sys.exit(-1);
		#else 
		echo("<br />\n");
		#end
		
	}
	
	static function argParse() {
		#if neko
		var args = neko.Sys.args();
		#else
		var _args = js.Lib.document.getElementById('args');
		if (_args == null) {
			usage();
		}
		var args = _args.getAttribute("value").split(" ");
		#end
		var i = 0; 
		argh = new Hash();
		while (i < args.length) {
			if (args[i].charAt(0) == "-") {
				var _arg = null;
				if (i+1 == args.length || args[i+1].charAt(0) == "-") {
					_arg = ".";
				} else {
					_arg = args[i+1];
				}
				argh.set(args[i].substr(1), _arg);
				i+=2;
			} else {
				usage();
			}
		}
		
	}

  static function main()
  {
      

/*	var b = 0xaabb;
	neko.Lib.println(StringTools.hex(b));
	b = (b & 0xff00) >> 8; 
	neko.Lib.println(StringTools.hex(b));*/
//	b >>= 8;
//	neko.Lib.println(StringTools.hex(b));
	
//	neko.Sys.exit(-1);
	#if neko
	var opcodes = neko.io.File.getContent("z80.csv");
	#else 
	var opcodes = haxe.Http.requestUrl("z80.csv");
	#end
	var _opcodes = opcodes.split("\r");

	var oplookup = new Hash<Dynamic>();
	for(i in 2..._opcodes.length) { 
		var l = _opcodes[i];
		var c = l.indexOf("\",");
		var instr, z80t, r800t, opc, len;
		
		if (c > 0) {
			l = l.substr(1, c-1) + 
				l.substr(c+1);
			c-=1;
		} else {
			c = l.indexOf(",");
		}
		instr = l.substr(0, c);
				
		l = l.substr(c+1);

		var tmp = l.split(",");
		z80t = tmp[0];
		r800t = tmp[1];
		opc = tmp[2];
		len = Std.parseInt(tmp[3]);
		
		if (opc == null) continue; // ?
		
		var _opc = opc.split(" ");
	
		var stor = [instr, opc, len, z80t, r800t];
		add(oplookup, _opc, stor);
	}
	/*
		TODO: make a commandline parser here
	*/
	
	argParse(); 
	
	if (!argh.exists("f")) {
		usage();
	}
	var file = argh.get("f");

	// add more later
    arch = argh.exists("a")?argh.get("a"):"msx";
	
	/* 
		load some msx specific stuff, like the BIOS
	*/
	if (arch == "msx") {
		// thanks grauw.nl for this one; should put this into an easier format
		#if neko
		var bioshtml = neko.io.File.getContent("msxbios.html");
		#else
		var bioshtml = haxe.Http.requestUrl("msxbios.html");
		#end
		
		var i = bioshtml.indexOf("<h3");
		
		bios = new Hash<Dynamic>();
		while (i > -1) {
			var j = bioshtml.indexOf("</pre>", i);
			
			var bioscall = bioshtml.substr(i, j-i);

			if (bioscall == null) {
				echo("Could not read BIOS", "notice");
				break;
			}

			// now we have the call, let's get the info out
			var l = bioscall.indexOf("#");
			var addr = bioscall.substr(l+1, 4);
			l = bioscall.indexOf(">");
			var name = bioscall.substr(l+1, bioscall.indexOf('<', l)-l-1);
			l = bioscall.indexOf("Function");
			l = bioscall.indexOf(":", l);
			var func = StringTools.trim(bioscall.substr(l+1, bioscall.indexOf("\n", l)-l-1));
			
			// javascript regexps are different than neko, so this doesn't work... 
			// var r = ~/<h3.*?>(.*?)<.*?Address.*?:.*?#(....).*?Function.*?:\s*?(.*?)[\r\n]/ms;


			//(bios.set(r.matched(2), [r.matched(1), r.matched(3)]);
			i = bioshtml.indexOf("<h3", j);
		}
		
		#if neko
		var ioportshtml = neko.io.File.getContent("ioports.html");
		#else 
		var ioportshtml = haxe.Http.requestUrl("ioports.html");
		#end
		i = ioportshtml.indexOf("<th>Port range</th>");
		var j = ioportshtml.indexOf("</table>", i);
		ioportshtml = ioportshtml.substr(i, j-i);
		i = ioportshtml.indexOf("<tr>");
		ios = new Hash();
		while (i > -1) {
			j = ioportshtml.indexOf("</tr>", i);
			var ioport = ioportshtml.substr(i, j-i);
			var k = ioport.indexOf("<td>");
			var ports = StringTools.trim(ioport.substr(k+4, (k=ioport.indexOf('</', k+4))));
			k = ioport.indexOf("<td>", k+4);
			var descr = StringTools.trim(ioport.substr(k+4, ioport.indexOf('</', k+4)));
			//echo(descr+ports, "notice");
		//	var r = ~/<td>(.*?)<\/td>.*?<td>(.*?)<\/td>/gims;
		//	r.match(ioport);
			var ps = new Array<Int>();
			if (ports.indexOf('-')>0) {
				var sp = ports.split('-');
				if (sp[0].charAt(0)=='#')
					sp[0]= sp[0].substr(1);
				if (sp[1].charAt(0)=='#')
					sp[1]= sp[1].substr(1);
				var i1 = Std.parseInt("0x"+sp[0]);
				var i2 = Std.parseInt("0x"+sp[1]);
				for (l in i1...i2) {
					ios.set(StringTools.hex(l), descr);
				}
		 	} else {
				ios.set(ports.substr(1), descr);
			}	
			i = ioportshtml.indexOf("<tr>", j);
		}
	}
	
//	neko.Lib.println(ios.toString());
//	neko.Sys.exit(0);
	// finish this ; currently I don't care. 
    //var startaddr = neko.Sys.args()[2];
	
	
	#if neko
	var bin = neko.io.File.getBytes(file);
	#else 
	// javascript is really bad with/for binary files, so we use some php 
	// to send the stuff over encoded in parts... 
	var bin : haxe.io.Bytes = null;
	#end
	
	// pass one ; disassembly and finding all addresses
	var i = 0;
	var start = 0x8000;
	var entry = start;
	
	// if we are loading an MSX rom, we'll get the start address
	if (arch == "msx" && file.indexOf(".rom")>0) {
		//i = 16; 
		entry = bin.get(2)+256*bin.get(3);
	
		echo("; Entry address for rom: "+StringTools.hex(entry), "notice");
		start = entry & 0xF000;
	}
	
	if (argh.exists("s")) {
		start = Std.parseInt(argh.get("s"));	
	}

	var annotatedBin = new Array<Dynamic>();
	js.Lib.alert(bin.length);
 	while (i < bin.length) {
		var op = StringTools.hex(bin.get(i), 2);
		var op1 = null; 
		if (i+1 < bin.length-1) 
			op1 = StringTools.hex(bin.get(i+1), 2); 
			
		var lu = oplookup.get(op);
		var res = null;
		if (op1 != null && Type.getClassName(Type.getClass(lu)) == "Hash") {
			res = lu.get(op1);
		} else {
			res = lu; 
		}

		// TODO: refactor
		if (res == null) {
			if (!argh.exists("b") && !argh.exists("e")) {
			
				echo("Illegal sequence: "+op+", next("+op1+") on "+ StringTools.hex(start + i,4), 'notice');
				
			}
			annotatedBin[start + i] = [[bin.get(i), bin.get(i+1)], "Illegal: "+op+", "+op1];
			i++;
			continue;
		}
		
		res = resNbit('n', bin, i, res);
		res = resNbit('o', bin, i, res);
	
		var instr = new Array<Int>();
		 
		var addr = StringTools.hex(start + i,4);
		var line = addr + " : "; 

		for(j in 0...res[2]) {
			line += StringTools.hex(bin.get(i+j), 2)+" ";
			instr[j] = bin.get(i+j);
		}
		
		line += ": ";

		line += res[0].toString();
		
		if (res[5]!=null) {
			line += " : " + res[5];
		}
		
		if (!argh.exists("e") && (!argh.exists("b") || (res[5]!=null && res[5].substr(0, 4)=="BIOS"))) {
		
			echo(line, 'notice');
		
		}
		
		annotatedBin[start + i] = [instr, line];
		
		i+=Std.int(res[2]);
	}
	//neko.Lib.println(annotatedBin.toString());
    //var msx = new MSXemulator(bin, start, entry, annotatedBin);
	//msx.run();
  }
}
