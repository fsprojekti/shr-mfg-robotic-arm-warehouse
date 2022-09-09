import {createRequire} from "module";

const require = createRequire(import.meta.url);
const fs = require("fs");

//QUEUES
import {
    QueueA,
    QueueB,
    QueueC,
    QueueD,
    QueueE,
    QueueF,
    QueueG,
    QueueH,
    // QueueRobot,
} from "./queuelifo.js";

// const queueStorageDock1 = new QueueA();
// const queueStorageDock2 = new QueueB();
// const queueReceiveBuffer = new QueueC();
// const queueReceiveDock = new QueueD();
// const queueStorageDock4 = new QueueE();
// const queueStorageDock3 = new QueueF();
// const queueDispatchBuffer = new QueueG();
// const queueDispatchDock = new QueueH();
// const queueRobot = new QueueRobot();

export class Warehouse {

    constructor() {
        this.location = "reset";
        this.queueStorageDock1 = new QueueA();
        this.queueStorageDock2 = new QueueB();
        this.queueReceiveBuffer = new QueueC();
        this.queueReceiveDock = new QueueD();
        this.queueStorageDock4 = new QueueE();
        this.queueStorageDock3 = new QueueF();
        this.queueDispatchBuffer = new QueueG();
        this.queueDispatchDock = new QueueH();
    }


    stateWarehouse() {
        if (this.queueStorageDock1.topIndex !== 0) {
            console.log(this.queueStorageDock1);
        }
        if (this.queueStorageDock2.topIndex !== 0) {
            console.log(this.queueStorageDock2);
        }
        if (this.queueStorageDock3.topIndex !== 0) {
            console.log(this.queueStorageDock3);
        }
        if (this.queueStorageDock4.topIndex !== 0) {
            console.log(this.queueStorageDock4);
        }
        if (this.queueReceiveBuffer.topIndex !== 0) {
            console.log(this.queueReceiveBuffer);
        }
        if (this.queueDispatchBuffer.topIndex !== 0) {
            console.log(this.queueDispatchBuffer);
        }
        // if (queueRobot.topIndex !== 0) {
        //     console.log(queueRobot);
        // }
    }

    resetWarehouse() {
        // queueRobot.dequeue();
        this.queueStorageDock1.dequeue();
        this.queueStorageDock1.dequeue();
        this.queueStorageDock1.dequeue();
        this.queueStorageDock1.dequeue();
        this.queueStorageDock2.dequeue();
        this.queueStorageDock2.dequeue();
        this.queueStorageDock2.dequeue();
        this.queueStorageDock2.dequeue();
        this.queueStorageDock3.dequeue();
        this.queueStorageDock3.dequeue();
        this.queueStorageDock3.dequeue();
        this.queueStorageDock3.dequeue();
        this.queueStorageDock4.dequeue();
        this.queueStorageDock4.dequeue();
        this.queueStorageDock4.dequeue();
        this.queueStorageDock4.dequeue();
        this.queueDispatchBuffer.dequeue();
        this.queueDispatchBuffer.dequeue();
        this.queueDispatchBuffer.dequeue();
        this.queueDispatchBuffer.dequeue();
        this.queueReceiveBuffer.dequeue();
        this.queueReceiveBuffer.dequeue();
        this.queueReceiveBuffer.dequeue();
        this.queueReceiveBuffer.dequeue();
    }

    readWarehouse() {
        const warehouse = require("./warehouse.json");

        if (warehouse.storageDock1[0] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.storageDock1[0]);
        }
        if (warehouse.storageDock1[1] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.storageDock1[1]);
        }
        if (warehouse.storageDock1[2] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.storageDock1[2]);
        }
        if (warehouse.storageDock1[3] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.storageDock1[3]);
        }

        if (warehouse.storageDock2[0] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.storageDock2[0]);
        }
        if (warehouse.storageDock2[1] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.storageDock2[1]);
        }
        if (warehouse.storageDock2[2] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.storageDock2[2]);
        }
        if (warehouse.storageDock2[3] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.storageDock2[3]);
        }

        if (warehouse.storageDock3[0] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.storageDock3[0]);
        }
        if (warehouse.storageDock3[1] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.storageDock3[1]);
        }
        if (warehouse.storageDock3[2] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.storageDock3[2]);
        }
        if (warehouse.storageDock3[3] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.storageDock3[3]);
        }

        if (warehouse.storageDock4[0] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.storageDock4[0]);
        }
        if (warehouse.storageDock4[1] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.storageDock4[1]);
        }
        if (warehouse.storageDock4[2] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.storageDock4[2]);
        }
        if (warehouse.storageDock4[3] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.storageDock4[3]);
        }

        if (warehouse.dispatchBuffer[0] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[0]);
        }
        if (warehouse.dispatchBuffer[1] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[1]);
        }
        if (warehouse.dispatchBuffer[2] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[2]);
        }
        if (warehouse.dispatchBuffer[3] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[3]);
        }

        if (warehouse.receiveBuffer[0] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.receiveBuffer[0]);
        }
        if (warehouse.receiveBuffer[1] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.receiveBuffer[1]);
        }
        if (warehouse.receiveBuffer[2] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.receiveBuffer[2]);
        }
        if (warehouse.receiveBuffer[3] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.receiveBuffer[3]);
        }

        let warehouseObj = {
            "storageDock1": this.queueStorageDock1, "storageDock2": this.queueStorageDock2,
            "storageDock3": this.queueStorageDock3, "storageDock4": this.queueStorageDock4,
            "receiveBuffer": this.queueReceiveBuffer, "dispatchBuffer": this.queueDispatchBuffer,
        }
        console.log("warehouse read: " + JSON.stringify(warehouseObj));
    }

    saveWarehouse() {

        let saveDataObject = {};
        saveDataObject.storageDock1 = [];
        saveDataObject.storageDock2 = [];
        saveDataObject.storageDock3 = [];
        saveDataObject.storageDock4 = [];
        saveDataObject.receiveBuffer = [];
        saveDataObject.dispatchBuffer = [];

        if (this.queueStorageDock1.items[0] !== undefined)
            saveDataObject.storageDock1[0] = this.queueStorageDock1.items[0];
        if (this.queueStorageDock1.items[1] !== undefined)
            saveDataObject.storageDock1[1] = this.queueStorageDock1.items[1];
        if (this.queueStorageDock1.items[2] !== undefined)
            saveDataObject.storageDock1[2] = this.queueStorageDock1.items[2];
        if (this.queueStorageDock1.items[3] !== undefined)
            saveDataObject.storageDock1[3] = this.queueStorageDock1.items[3];

        if (this.queueStorageDock2.items[0] !== undefined)
            saveDataObject.storageDock2[0] = this.queueStorageDock2.items[0];
        if (this.queueStorageDock2.items[1] !== undefined)
            saveDataObject.storageDock2[1] = this.queueStorageDock2.items[1];
        if (this.queueStorageDock2.items[2] !== undefined)
            saveDataObject.storageDock2[2] = this.queueStorageDock2.items[2];
        if (this.queueStorageDock2.items[3] !== undefined)
            saveDataObject.storageDock2[3] = this.queueStorageDock2.items[3];

        if (this.queueStorageDock3.items[0] !== undefined)
            saveDataObject.storageDock3[0] = this.queueStorageDock3.items[0];
        if (this.queueStorageDock3.items[1] !== undefined)
            saveDataObject.storageDock3[1] = this.queueStorageDock3.items[1];
        if (this.queueStorageDock3.items[2] !== undefined)
            saveDataObject.storageDock3[2] = this.queueStorageDock3.items[2];
        if (this.queueStorageDock3.items[3] !== undefined)
            saveDataObject.storageDock3[3] = this.queueStorageDock3.items[3];

        if (this.queueStorageDock4.items[0] !== undefined)
            saveDataObject.storageDock4[0] = this.queueStorageDock4.items[0];
        if (this.queueStorageDock4.items[1] !== undefined)
            saveDataObject.storageDock4[1] = this.queueStorageDock4.items[1];
        if (this.queueStorageDock4.items[2] !== undefined)
            saveDataObject.storageDock4[2] = this.queueStorageDock4.items[2];
        if (this.queueStorageDock4.items[3] !== undefined)
            saveDataObject.storageDock4[3] = this.queueStorageDock4.items[3];

        if (this.queueReceiveBuffer.items[0] !== undefined)
            saveDataObject.receiveBuffer[0] = this.queueReceiveBuffer.items[0];
        if (this.queueReceiveBuffer.items[1] !== undefined)
            saveDataObject.receiveBuffer[1] = this.queueReceiveBuffer.items[1];
        if (this.queueReceiveBuffer.items[2] !== undefined)
            saveDataObject.receiveBuffer[2] = this.queueReceiveBuffer.items[2];
        if (this.queueReceiveBuffer.items[3] !== undefined)
            saveDataObject.receiveBuffer[3] = this.queueReceiveBuffer.items[3];

        if (this.queueDispatchBuffer.items[0] !== undefined)
            saveDataObject.dispatchBuffer[0] = this.queueDispatchBuffer.items[0];
        if (this.queueDispatchBuffer.items[1] !== undefined)
            saveDataObject.dispatchBuffer[1] = this.queueDispatchBuffer.items[1];
        if (this.queueDispatchBuffer.items[2] !== undefined)
            saveDataObject.dispatchBuffer[2] = this.queueDispatchBuffer.items[2];
        if (this.queueDispatchBuffer.items[3] !== undefined)
            saveDataObject.dispatchBuffer[3] = this.queueDispatchBuffer.items[3];

        fs.writeFile("warehouse.json", JSON.stringify(saveDataObject), function (erreur) {
            if (erreur) {
                console.log(erreur);
            }
        });
    }

// queueReceiveBuffer.enqueue(JSON.stringify(ID.ReceiveBufferitemID)); //recevoir les données enregistré
// function newReceiveWarehouse() {
//     queueReceiveDock.enqueue("new item 1 : no #ID");
//     queueReceiveDock.enqueue("new item 2 : no #ID");
//     queueReceiveDock.enqueue("new item 3 : no #ID");
//     queueReceiveDock.enqueue("new item 4 : no #ID");
// }

}

// export {
//     location,
//    resetWarehouse,
//    stateWarehouse,
//    saveWarehouse,
//    readWarehouse,
//    queueDispatchBuffer,
//    queueDispatchDock,
//    queueReceiveBuffer,
//    queueReceiveDock,
//     queueStorageDock1,
//     queueStorageDock2,
//    queueStorageDock3,
//    queueStorageDock4,
//    QueueA,
//    QueueB,
//    QueueC,
//    QueueD,
//   QueueE,
//   QueueF,
//   QueueG,
//   QueueH
// };
