class A {
    static aa = "111";
}
class B extends A {
    static {
        this.aa = "222";
    }
    a;
    b;
    static generate(array) {
        let re = new B();
        re.a = array[0];
        re.b = array[1];
        return re;
    }
}

class C extends B {
    c;
    d;
    static generate(array) {
        let re = new C();
        re.c = array[2];
        re.d = array[3];
        return re;
    }
}
console.log(A.aa);
let b = new B();
console.log(b.aa);


let classMap = new Map;
classMap.set("B", B);
classMap.set("C", C);
let re = classMap.get("B").generate([1,2]);
console.log(re);