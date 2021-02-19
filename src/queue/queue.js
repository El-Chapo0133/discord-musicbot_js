
class Queue {
    constructor() {
        this.queue = [];
    }
    add(e) {
        this.push.push(e);
    }
    clear() {
        this.queue = [];
    }
    remove(indexToRemove) {
        let tempQueue = [];
        for (let index = 0; index < this.queue.length; index++) {
            if (index != indexToRemove) {
                tempQueue.push(this.queue);
            }
        }
        this.queue = tempqueue;
    }
    get(index) {
        return new Promise((resolve, reject) => {
            if (index >= this.queue.length) {
                reject("Index not found");
            }
            resolve(this.queue[index]);
        })
    }
}

module.exports = Queue;