import StringTools;
import haxe.io.Bytes;

/*
	This is not a full emulator (obviously) ; it's just to play around with z80/msx internals to 
	see how they work.
	
	
*/

class MSXemulator {
	// some internal stuff
	var annBin : Array<Dynamic>;
	var bin : Bytes; 
	var start : Int; 
	var entry : Int;
	
	// address space 
	var memory : Array<Int>; 
	
	// regs
	var AF : Int;
	var BC : Int;
	var DE : Int;
	var HL : Int;
	var IX : Int;
	var IY : Int;
	var SP : Int;  
	var PC : Int; 

	// interrupts
	var di : Bool;

		
	public function new(bin : Bytes, start, entry, annBin : Array<Dynamic>) {
		this.bin = bin;
		this.start = start; 
		this.entry = this.PC = entry;
		this.annBin = annBin;
		memory = new Array();
		di = false;
		AF = 0;
		BC = 0; 
		DE = 0; 
		HL = 0;
		SP = 0xfff0; // saw this is another MSX emulator
	}
	
	public function run() {
		while (true) {
			step();
		}
	}
	
	public function step() {
		
		// this is not supposed to happen obviously:
	//neko.Lib.println(" ::: "+StringTools.hex(PC));
	 //  neko.Lib.println(cast(annBin[PC][1], String));
	//neko.Lib.println(annBin.toString());
		if (cast(annBin[PC][1], String).indexOf("Illegal")>-1) {
			#if neko
			neko.Lib.println(annBin[PC][1]);
			neko.Sys.exit(-1);
			#end
		}
		
		cpu(annBin[PC][0], annBin[PC][1]);
	}
	
	private function out(port : Int, value : Int) {
		var _p = StringTools.hex(port);
		#if neko
		neko.Lib.println("Out execute "+StringTools.hex(port)+", "+ StringTools.hex(value));
		#end
	}
	
	private function bios(addr) {
		var _a = StringTools.hex(addr);
		#if neko
		neko.Lib.println("Call to BIOS: "+_a);
		#end
		PC = pop2();
	}

	private function poke(addr, val) {
		memory[addr] = val;
	}
	private function peek(addr) {
		if (memory[addr] == null) // init addy (is this ok?) 
			memory[addr] = 0;
		return memory[addr];
	}
	
	private function hi(value) {
		return (value & 0xff00) >> 8;
	}
	
	private function lo(value) {
		return value & 0x00ff;
	}
	private function setLo(value : Int, newlo : Int) {
		return (value & 0xff00) + newlo;
	}
	private function setHi(value : Int, newhi : Int) {
		return (value & 0x00ff) + (newhi<<8);
	}

	private function write16bit(addrs, value) {
		var hi = hi(value);
		var lo = lo(value);
		poke(addrs, lo);
		poke(addrs+1, hi);
	}
	private function push(lo:Int,hi=-1) {
		if (lo > 0xff) {
			write16bit(SP, lo);
			SP+=2;
		} else {
			poke(SP++, lo);
			if (hi>=0)
				poke(SP++, hi);
		}
	}
	
	private function pop2() {
		return pop(2);
	}
	
	private function pop(bytes = 1) {
		SP -= bytes;
		var res = null;
		if (bytes == 2) {
			//neko.Lib.println(StringTools.hex(peek(SP)));
			//neko.Lib.println(StringTools.hex(peek(SP+1)));
		
			res = peek(SP)+256*peek(SP+1);
		} else {
			res = peek(SP);
		}
		//neko.Lib.println("Pop: "+StringTools.hex(res));
		return res;
	}
	
	private function debug(str : String) {
		var line = "AF = "+StringTools.hex(AF)+", "+
			"BC = "+StringTools.hex(BC)+", "+
			"DE = "+StringTools.hex(DE)+", "+
			"HL = "+StringTools.hex(HL)+", "+
			"SP = "+StringTools.hex(SP)+", "+
			"PC = "+StringTools.hex(PC);
		#if neko
		neko.Lib.println(str+ " ("+line+")");
		#end
	}
	
	// most flags can be calced after the fact
	private function setF(val) {
		AF = setLo(AF, lo(val));
	}
	private function flag(val, bytes=1) {
	//	neko.Lib.println(StringTools.hex(val) + " ; AF ="+ StringTools.hex(AF));
		
		var hval = val; 
		if (bytes == 2) 
			hval = hi(val);
		setF(AF | (hval & 0x80)); // SF
		if (val == 0) // ZF
			setF(AF | 0x40); 	
		else 
			setF(AF & 0xBF);
		setF(AF | (val & 0x20)); // YF
		setF(AF | (val & 0x08)); // XF
	//	AF |= 
	//neko.Lib.println(StringTools.hex(val) + " ; AF = "+StringTools.hex(AF));
	
	}

	// manage overflows!
	private function add(val, a, bytes = 1) {
		var max = (bytes == 1)?0xff:0xffff;
		var nval = val;
		if (val + a > max) {
			nval = (val + a) - (max+1);  
			setF(AF | 0x01); // CF
		} else {
			nval += a;
			setF(AF & 0xfe); // CF
		}
		setF(AF & 0xDF); // NF
		// half carry HF
		var nmax = max >> 8; 
		if ( ((val & nmax) + (a & nmax)) & (nmax+1) != 0 ) 
			setF(AF | 0x10); else setF(AF & 0xef);
		flag(nval, bytes);
		return nval;
	}
	
	private function sub(val, a, bytes = 1) {
		var max = (bytes == 1)?0xff:0xffff;
		var nval = val; 
		if (val - a < 0) {
			nval = (max+1) + (val - a);
			setF(AF | 0x01); // CF
		} else {
			nval -= a;
			setF(AF & 0xfe); // CF
		}
		setF(AF | 0x02); // NF
		// half carry HF
		var nmax = max >> 8;		
		if ( ((val & nmax) - (a & nmax)) & (nmax+1) != 0 ) 
			setF(AF | 0x10); else setF(AF & 0xef);
		flag(nval, bytes);
		return nval;
	}
	
	private function add2(val, a) {
		return add(val, a, 2);
	}
	private function sub2(val, a) {
		return sub(val, a, 2);
	}

	private function dec(val) {
		return sub(val, 1);
	}
	private function dec2(val) {
		return sub2(val, 1);
	}
	private function inc(val) {
		return add(val, 1);
	}
	private function inc2(val) {
		return add2(val, 1);
	}

	// TODO: fixing overflows
	private function cpu(instr, info : String) {
		debug("Calling: "+info);
		switch(instr[0]) {
			case 0x00: // nop
				// do nothing
			case 0x01: //ld bc,nn
				BC = instr[1]+256*instr[2];
			case 0x02: // ld (bc),a
				poke(BC, hi(AF));
			case 0x03: // inc BC
				BC = inc2(BC);
			case 0x04: // inc b
				BC = setHi(BC, dec(hi(BC)));
			case 0x06: // ld b, n
				BC = setHi(BC, instr[1]);
			case 0x0A: // ld a,(bc)
				AF = setHi(AF, peek(BC));
			case 0x0B: // dec BC
				BC = dec2(BC); 
			case 0x0D: // dec C
				BC = setLo(BC, dec(lo(BC)));
			case 0x0E: // ld c, n
				BC = setLo(BC, instr[1]);
			case 0x13: // inc de
				DE = inc2(DE);
			case 0x20: // jr nz, n
				if (AF & 0x40 == 0) {
					var oAF = AF;
					PC = add2(PC, instr[1]);
					AF = oAF; 
					return;
				}					
			case 0x21: //ld hl, nn
				HL = instr[1]+256*instr[2];
			case 0x22: // ld (nn), hl
				write16bit(instr[1]+256*instr[2], HL);
			case 0x23: // inc hl
				HL = inc2(HL);	
			case 0x28: // jr z, n
				if (AF & 0x40 != 0) {
					var oAF = AF;
					PC = add2(PC, instr[1]);
					AF = oAF; 
					return;
				}
			case 0x2A: // ld hl,(nn)
				HL = setHi(HL, peek(instr[1]+256*instr[2]+1));
				HL = setLo(HL, peek(instr[1]+256*instr[2]));
			case 0x31: // ld sp, nn
				SP = instr[1]+256*instr[2];
			case 0x32: // ld (nn), a
				memory[instr[1]+256*instr[2]] = hi(AF);
			case 0x36: // ld (hl), n
				memory[HL] = instr[1];
			case 0x3A: // ld a,(nn)
				AF = setHi(AF, peek(instr[1]+256*instr[2]));
			case 0x3D: // dec A
				AF = setHi(AF, dec(hi(AF)));
			case 0x3E: // ld a, n
				AF = setHi(AF, instr[1]);
			case 0x54: // ld d,h
				DE = setHi(DE, hi(HL));
			case 0x5D: // ld e,l
				DE = setLo(DE, lo(HL));
			case 0x77: // ld (hl),a
				memory[HL] = hi(AF);
			case 0x78: // ld a, b
				AF = setHi(AF, (BC & 0xFF00) >> 8);
			case 0x7F: // ld a,a
				// do nothing
			case 0xB1: // or c
				AF = setHi(AF, (BC & 0x00FF) | hi(AF));	
				flag(hi(AF));
			case 0xC2: // jp nz, nn
				if (AF & 0x40 == 0) {
					PC = instr[1]+256*instr[2];
					return;
				}
			case 0xC3: // jp nn
				PC = instr[1]+256*instr[2];
				return;
			case 0xC9: // ret
				PC = pop2();
				return;
			case 0xCB: // res N,x
				switch(instr[1]) {
					case 0x87: // res 0,A
						AF = setHi(AF, AF & 0xfe);
				}
			case 0xCD: // call nn
				push(add2(PC, instr.length));
				if (info.indexOf("BIOS:")>0) {
					bios(instr[1]+256*instr[2]);
				} else {
					PC = instr[1]+256*instr[2];
				}
				return;
			case 0xD3: // out (n), a
				out(instr[1], hi(AF));	
		  	case 0xED: // special instructions
				switch(instr[1]) {
					case 0xAB: // outd
						out(lo(BC), peek(HL)); 
						HL = dec2(HL);				// apparently this is the right order!
						BC = setHi(BC, dec(hi(BC)));
					case 0xB0: // ldir
						//if (BC == 0) BC = 0xffff;
						while (BC > 0) { // is the > or >= ? 
							write16bit(DE, peek(HL));
							DE = inc(DE);
							HL = inc(HL); 
							BC = dec2(BC);
						}
					case 0x41: // out (c), b
						out(lo(BC), hi(BC));
					default: 
						#if neko
						neko.Lib.println("CPU doesn't have info for special instruction: "+info);
						neko.Sys.exit(-1);	
						#end
				}
			case 0xF2: // jp p,nn (http://z80-heaven.wikidot.com/instructions-set:jp)
				if (AF & 0x80 != 0) {
					PC = instr[1]+256*instr[2];
					return;
				}
			case 0xF3: // di
				di = true;
				
			default: 
				#if neko
				neko.Lib.println("CPU doesn't have info for: "+info);
				neko.Sys.exit(-1);
				#end
		}
		// ugly ; fix! 
		var oAF = AF;
		PC = add2(PC,instr.length);
		AF = oAF;
		debug("Result: "+info);
	}
}