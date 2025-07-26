export class Stack{
    constructor(){
        this.items = []
    }
    isEmpty() {
        return (this.items.length == 0)
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        if (this.isEmpty()) 
            return 'uh oh'
        return this.items.pop();
    }
    peek() {
        if (this.isEmpty()) 
            return 'uh oh'
        return this.items[this.items.length - 1];
    }
    size() {
        return this.items.length;
    }
}
// A* requires the use of a priority queue and nodes 
export class Priority_Queue{
    elts;
    constructor(){
        this.elts = []
    }
    isEmpty(){
        return this.elts.length == 0
    }
    // This insertion works at O(log(N)) time now
    insert(elt, priority, dontprint = true){
        if (!dontprint ){
            for (let k = 0; k < this.elts.length; k++)
                console.log("elts:" + this.elts[k])
            // console.log("priority: ", priority)
        }
        if (this.isEmpty()) {
            this.elts.push([elt, priority])
            return null
        }
        if (this.elts.length < 10) {
            let v;
            for(v = 0; v < this.elts.length; v++) {
                if (!dontprint )
                    console.log("priority-test: " + this.elts[v][1], priority)
                if(priority > this.elts[v][1])
                    break
            }
            this.elts.splice(v,0,[elt, priority])
            return null
        }
        let k = Math.floor(this.elts.length / 2)
        let increment = Math.ceil(this.elts.length / 4)
        while (true) {
            if (increment == 0) 
                break
            if (priority < this.elts[k][1]) 
                k = k + increment
            else if(priority > this.elts[k][1])
                k = k - increment
            else
                break
            increment = Math.floor(increment / 2)
        }
        this.elts.splice(k,0,[elt, priority])
    }
    get_elt() {
        return this.elts.pop()[0]
    }
    contains_elt(elt) {
        if (this.isEmpty())
            return false
        for (let k = 0; k < this.elts.length; k++) {
            // console.log(this.elts[k], elt, arrayEqual(this.elts[k][0], elt))
            if (this.elts[k][0] == elt || arrayEqual(this.elts[k][0], elt))
                return true
        }
        return false
    }
}

export class Dictionary{
    constructor(){
        this.elts = []
        this.keys = []
    }
    add(key, elt){
        this.elts.push(elt)
        this.keys.push(key)
        // console.log(this.elts)
    }
    getElt(key) {
        for (let ind = 0; ind < this.elts.length; ind++) {
            // console.log(ind, this.keys[ind])
            // console.log(this.elts[ind][0])
            if (arrayEqual(this.keys[ind], key))
                return this.elts[ind]
        }
        return false
    }
    assign(key, val){
        for (let ind = 0; ind < this.elts.length; ind++) {
            // console.log(ind, this.keys[ind])
            // console.log(this.elts[ind][0])
            if (arrayEqual(this.keys[ind], key)) {
                this.elts[ind] = val
                return true
            }
        }
        return false
    }
}

// THIS IS A REALLLLLLYYYY IMPORTANT CLASS
// IT WRAPS ANY THING INTO AN OBJECT SO THAT IT CAN BE ASSIGNED OUT OF SCOPE WITHOUT CONST ISSUES
export class Wrapper{
    item
    constructor(item){
        this.item = item
    }
}

// compares nested arrays (only code to use recursion)
function arrayEqual(arr1, arr2) {
    // console.log(arr1,arr2,typeof(arr1), typeof(arr2))
    if (typeof(arr1) != typeof(arr2)) 
        return false
    if (typeof(arr1) == 'number' && arr1 != arr2) 
        return false
    if (arr1.length != arr2.length) 
        return false
    let val = true
    for (let k = 0; k < arr1.length; k++) {
        if (!val)
            return val
        if (typeof(arr1[k]) != 'number')
            val = val && arrayEqual(arr1[k], arr2[k])
        else
            val = val && (arr1[k] == arr2[k])
    }
    return val
}

