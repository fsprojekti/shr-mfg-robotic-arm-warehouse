//QUEUE STORAGE DOCK 1
export class QueueA {
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexA = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexA = this.topIndexA + 1;
      this.items.push(item);
    } else console.log("INFO : The A queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexA = this.topIndexA - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexB = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexB = this.topIndexB + 1;
      this.items.push(item);
    } else console.log("INFO : The B queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexB = this.topIndexB - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexC = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexC = this.topIndexC + 1;
      this.items.push(item);
    } else console.log("INFO : The C queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexC = this.topIndexC - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexD = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexD = this.topIndexD + 1;
      item = Math.random().toString(16).slice(10);
      this.items.push(item);
    } else console.log("INFO : The D queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexD = this.topIndexD - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexE = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexE = this.topIndexE + 1;
      this.items.push(item);
    } else console.log("INFO : The E queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexE = this.topIndexE - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexF = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexF = this.topIndexF + 1;
      this.items.push(item);
    } else console.log("INFO : The F queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexF = this.topIndexF - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexG = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexG = this.topIndexG + 1;
      this.items.push(item);
    } else console.log("INFO : The G queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexG = this.topIndexG - 1;
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
  constructor(length = 4) {
    this.items = [];
    this.maxlength = length;
    this.topIndexH = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexH = this.topIndexH + 1;
      this.items.push(item);
    } else console.log("INFO : The H queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexH = this.topIndexH - 1;
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

export class QueueRobot {
  constructor(length = 1) {
    this.items = [];
    this.maxlength = length;
    this.topIndexR = 0;
  }
  enqueue(item) {
    if (this.items.length <= this.maxlength - 1) {
      this.topIndexR = this.topIndexR + 1;
      this.items.push(item);
    } else console.log("INFO : The Robot queue is full");
  }
  dequeue() {
    if (!this.isEmpty()) {
      this.topIndexR = this.topIndexR - 1;
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
