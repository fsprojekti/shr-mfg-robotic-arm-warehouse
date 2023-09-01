import {createRequire} from "module";

const require = createRequire(import.meta.url);
let config = require("./config/config.json");

export class Dock {
    constructor(length = config.dockSize) {
        this.items = [];
        this.maxlength = length;
        this.topIndex = -1;
    }

    enqueue(item, dockName) {
        console.log("current dock 1 size: ", this.items.length);
        console.log("adding item: ", item);
        console.log("dock 1 max length: ", this.maxlength);
        if (this.items.length <= this.maxlength - 1) {
            this.topIndex = this.topIndex + 1;
            this.items.push(item);
        } else console.log("INFO : The storage dock \"" + dockName + "\" is full");
    }

    dequeue() {
        if (!this.isEmpty()) {
            this.topIndex = this.topIndex - 1;
            return this.items.pop();
        }
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}