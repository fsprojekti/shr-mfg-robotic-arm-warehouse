import {createRequire} from "module";

const require = createRequire(import.meta.url);
let config = require("./config/config.json");

//QUEUE STORAGE DOCK 1
export class QueueStorageDock1 {
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 2
export class QueueStorageDock2 {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        console.log("current dock 2 size: ", this.items.length);
        console.log("adding item: ", item);
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE RECEIVE BUFFER
export class QueueReceiveBuffer {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item) {
        console.log("current receive buffer size: ", this.items.length);
        console.log("adding item: ", item);
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE RECEIVE DOCK
export class QueueReceiveDock {
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 4
export class QueueStorageDock4 {
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE STORAGE DOCK 3
export class QueueStorageDock3 {
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE DISPATCH BUFFER
export class QueueDispatchBuffer {
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

    //
    // peek() {
    //     return this.items[0];
    // }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}

//QUEUE DISPATCH DOCK
export class QueueDispatchDock {
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

    //
    // peek() {
    //     return this.items[0];
    // }

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
