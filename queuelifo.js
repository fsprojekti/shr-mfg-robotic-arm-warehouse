import {createRequire} from "module";
const require = createRequire(import.meta.url);
let config = require("./config.json");

//QUEUE STORAGE DOCK 1
export class QueueA {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
	console.log("current dock 1 size: ", this.items.length);
	console.log("adding item: ", item);
	console.log("dock 1 max length: ", this.maxlength);
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The storage dock 1 is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 2
export class QueueB {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The storage dock 2 is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE RECEIVE BUFFER
export class QueueC {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The receive buffer is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE RECEIVE DOCK
export class QueueD {
    constructor(length = 1) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            item = Math.random().toString(16).slice(10);
            this.items.push(item);
        } else console.log("INFO : The D queue is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 4
export class QueueE {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The storage dock 4 is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 3
export class QueueF {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The storage dock 3 is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE DISPATCH BUFFER
export class QueueG {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The dispatch buffer is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE DISPATCH DOCK
export class QueueH {
    constructor(length = 1) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The H queue is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    peek() {
        return this.items[0];
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

// export class QueueRobot {
//     constructor(length = 1) {
//         this.items = [];
//         this.maxlength = length;
//         this.topIndex = 0;
//     }
//
//     enqueue(item) {
//         if (this.items.length <= this.maxlength - 1) {
//             this.topIndex = this.topIndex + 1;
//             this.items.push(item);
//         } else console.log("INFO : The Robot queue is full");
//     }
//
//     dequeue() {
//         if (!this.isEmpty()) {
//             this.topIndex = this.topIndex - 1;
//             return this.items.pop();
//         }
//     }
//
//     peek() {
//         return this.items[0];
//     }
//
//     getSize() {
//         return this.items.length;
//     }
//
//     isEmpty() {
//         return this.getSize() === 0;
//     }
// }
