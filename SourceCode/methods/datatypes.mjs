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
    insert(elt, priority){
        if (this.isEmpty()) {
            this.elts.push([elt, priority])
            return null
        }
        if (this.elts.length < 4) {
            let v;
            for(v = 0; v < this.elts.length; v++) {
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
            if (this.elts[k][0] == elt)
                return true
        }
        return false
    }
}

export class Dictionary{
    constructor(){
        this.elts = []
    }
    add(key, elt){
        this.elts.push([key, elt])
    }
    getElt(key) {
        for (let ind = 0; ind < this.elts.length; ind++) {
            if (this.elts[ind][0] == key)
                return this.elts[ind][1]
        }
        return false
    }
}
