/*
	This probably exists in HaXe but didn't have any internet while writing this.
*/
class Stack {
	var stack : Array<Int>;
	var size : Int;
	
	public function new(ne) {
		stack = new Array();
		size = 0;
	}
	
	public function push(i) {
		stack[size++] = i; 
	}
	
	public function pop() : Int {
		return stack[--size];
	}
	
}