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

const queueStorageDock1 = new QueueA();
const queueStorageDock2 = new QueueB();
const queueReceiveBuffer = new QueueC();
const queueReceiveDock = new QueueD();
const queueStorageDock4 = new QueueE();
const queueStorageDock3 = new QueueF();
const queueDispatchBuffer = new QueueG();
const queueDispatchDock = new QueueH();
// const queueRobot = new QueueRobot();

let location = "reset";

function stateWarehouse() {
    if (queueStorageDock1.topIndex !== 0) {
        console.log(queueStorageDock1);
    }
    if (queueStorageDock2.topIndex !== 0) {
        console.log(queueStorageDock2);
    }
    if (queueStorageDock3.topIndex !== 0) {
        console.log(queueStorageDock3);
    }
    if (queueStorageDock4.topIndex !== 0) {
        console.log(queueStorageDock4);
    }
    if (queueReceiveBuffer.topIndex !== 0) {
        console.log(queueReceiveBuffer);
    }
    if (queueReceiveDock.topIndex !== 0) {
        console.log(queueReceiveDock);
    }
    if (queueDispatchBuffer.topIndex !== 0) {
        console.log(queueDispatchBuffer);
    }
    if (queueDispatchDock.topIndex !== 0) {
        console.log(queueDispatchDock);
    }
    // if (queueRobot.topIndex !== 0) {
    //     console.log(queueRobot);
    // }
}

function resetWarehouse() {
    // queueRobot.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
}

function readWarehouse() {
    const warehouse = require("./warehouse.json");

    if (warehouse.storageDock1[0] !== undefined) {
        queueStorageDock1.enqueue(warehouse.storageDock1[0]);
    }
    if (warehouse.storageDock1[1] !== undefined) {
        queueStorageDock1.enqueue(warehouse.storageDock1[1]);
    }
    if (warehouse.storageDock1[2] !== undefined) {
        queueStorageDock1.enqueue(warehouse.storageDock1[2]);
    }
    if (warehouse.storageDock1[3] !== undefined) {
        queueStorageDock1.enqueue(warehouse.storageDock1[3]);
    }

    if (warehouse.storageDock2[0] !== undefined) {
        queueStorageDock2.enqueue(warehouse.storageDock2[0]);
    }
    if (warehouse.storageDock2[1] !== undefined) {
        queueStorageDock2.enqueue(warehouse.storageDock2[1]);
    }
    if (warehouse.storageDock2[2] !== undefined) {
        queueStorageDock2.enqueue(warehouse.storageDock2[2]);
    }
    if (warehouse.storageDock2[3] !== undefined) {
        queueStorageDock2.enqueue(warehouse.storageDock2[3]);
    }

    if (warehouse.storageDock3[0] !== undefined) {
        queueStorageDock3.enqueue(warehouse.storageDock3[0]);
    }
    if (warehouse.storageDock3[1] !== undefined) {
        queueStorageDock3.enqueue(warehouse.storageDock3[1]);
    }
    if (warehouse.storageDock3[2] !== undefined) {
        queueStorageDock3.enqueue(warehouse.storageDock3[2]);
    }
    if (warehouse.storageDock3[3] !== undefined) {
        queueStorageDock3.enqueue(warehouse.storageDock3[3]);
    }

    if (warehouse.storageDock4[0] !== undefined) {
        queueStorageDock4.enqueue(warehouse.storageDock4[0]);
    }
    if (warehouse.storageDock4[1] !== undefined) {
        queueStorageDock4.enqueue(warehouse.storageDock4[1]);
    }
    if (warehouse.storageDock4[2] !== undefined) {
        queueStorageDock4.enqueue(warehouse.storageDock4[2]);
    }
    if (warehouse.storageDock4[3] !== undefined) {
        queueStorageDock4.enqueue(warehouse.storageDock4[3]);
    }

    if (warehouse.dispatchBuffer[0] !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[0]);
    }
    if (warehouse.dispatchBuffer[1] !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[1]);
    }
    if (warehouse.dispatchBuffer[2] !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[2]);
    }
    if (warehouse.dispatchBuffer[3] !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.dispatchBuffer[3]);
    }

    if (warehouse.dispatchDock[0] !== undefined) {
        queueDispatchDock.enqueue(warehouse.dispatchDock[0]);
    }
    if (warehouse.dispatchDock[1] !== undefined) {
        queueDispatchDock.enqueue(warehouse.dispatchDock[1]);
    }
    if (warehouse.dispatchDock[2] !== undefined) {
        queueDispatchDock.enqueue(warehouse.dispatchDock[2]);
    }
    if (warehouse.dispatchDock[3] !== undefined) {
        queueDispatchDock.enqueue(warehouse.dispatchDock[3]);
    }

    if (warehouse.receiveBuffer[0] !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.receiveBuffer[0]);
    }
    if (warehouse.receiveBuffer[1] !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.receiveBuffer[1]);
    }
    if (warehouse.receiveBuffer[2] !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.receiveBuffer[2]);
    }
    if (warehouse.receiveBuffer[3] !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.receiveBuffer[3]);
    }

    if (warehouse.receiveDock[0] !== undefined) {
        queueReceiveDock.enqueue(warehouse.receiveDock[0]);
    }
    if (warehouse.receiveDock[1] !== undefined) {
        queueReceiveDock.enqueue(warehouse.receiveDock[1]);
    }
    if (warehouse.receiveDock[2] !== undefined) {
        queueReceiveDock.enqueue(warehouse.receiveDock[2]);
    }
    if (warehouse.receiveDock[3] !== undefined) {
        queueReceiveDock.enqueue(warehouse.receiveDock[3]);
    }

    let warehouseObj = {
        "storageDock1": queueStorageDock1, "storageDock2": queueStorageDock2,
        "storageDock3": queueStorageDock3, "storageDock4": queueStorageDock4,
        "receiveBuffer": queueReceiveBuffer, "dispatchBuffer": queueDispatchBuffer,
    }
    console.log("warehouse read: " + JSON.stringify(warehouseObj));
}

function saveWarehouse() {

    let saveDataObject = {};
    saveDataObject.storageDock1 = [];
    saveDataObject.storageDock2 = [];
    saveDataObject.storageDock3 = [];
    saveDataObject.storageDock4 = [];
    saveDataObject.receiveBuffer = [];
    saveDataObject.dispatchBuffer = [];

    if(queueStorageDock1.items[0] !== undefined)
        saveDataObject.storageDock1[0] = queueStorageDock1.items[0];
    if(queueStorageDock1.items[1] !== undefined)
        saveDataObject.storageDock1[1] = queueStorageDock1.items[1];
    if(queueStorageDock1.items[2] !== undefined)
        saveDataObject.storageDock1[2] = queueStorageDock1.items[2];
    if(queueStorageDock1.items[3] !== undefined)
        saveDataObject.storageDock1[3] = queueStorageDock1.items[3];

    if(queueStorageDock2.items[0] !== undefined)
        saveDataObject.storageDock2[0] = queueStorageDock2.items[0];
    if(queueStorageDock2.items[1] !== undefined)
        saveDataObject.storageDock2[1] = queueStorageDock2.items[1];
    if(queueStorageDock2.items[2] !== undefined)
        saveDataObject.storageDock2[2] = queueStorageDock2.items[2];
    if(queueStorageDock2.items[3] !== undefined)
        saveDataObject.storageDock2[3] = queueStorageDock2.items[3];

    if(queueStorageDock3.items[0] !== undefined)
        saveDataObject.storageDock3[0] = queueStorageDock3.items[0];
    if(queueStorageDock3.items[1] !== undefined)
        saveDataObject.storageDock3[1] = queueStorageDock3.items[1];
    if(queueStorageDock3.items[2] !== undefined)
        saveDataObject.storageDock3[2] = queueStorageDock3.items[2];
    if(queueStorageDock3.items[3] !== undefined)
        saveDataObject.storageDock3[3] = queueStorageDock3.items[3];

    if(queueStorageDock4.items[0] !== undefined)
        saveDataObject.storageDock4[0] = queueStorageDock4.items[0];
    if(queueStorageDock4.items[1] !== undefined)
        saveDataObject.storageDock4[1] = queueStorageDock4.items[1];
    if(queueStorageDock4.items[2] !== undefined)
        saveDataObject.storageDock4[2] = queueStorageDock4.items[2];
    if(queueStorageDock4.items[3] !== undefined)
        saveDataObject.storageDock4[3] = queueStorageDock4.items[3];

    if(queueReceiveBuffer.items[0] !== undefined)
        saveDataObject.receiveBuffer[0] = queueReceiveBuffer.items[0];
    if(queueReceiveBuffer.items[1] !== undefined)
        saveDataObject.receiveBuffer[1] = queueReceiveBuffer.items[1];
    if(queueReceiveBuffer.items[2] !== undefined)
        saveDataObject.receiveBuffer[2] = queueReceiveBuffer.items[2];
    if(queueReceiveBuffer.items[3] !== undefined)
        saveDataObject.receiveBuffer[3] = queueReceiveBuffer.items[3];

    if(queueDispatchBuffer.items[0] !== undefined)
        saveDataObject.dispatchBuffer[0] = queueDispatchBuffer.items[0];
    if(queueDispatchBuffer.items[1] !== undefined)
        saveDataObject.dispatchBuffer[1] = queueDispatchBuffer.items[1];
    if(queueDispatchBuffer.items[2] !== undefined)
        saveDataObject.dispatchBuffer[2] = queueDispatchBuffer.items[2];
    if(queueDispatchBuffer.items[3] !== undefined)
        saveDataObject.dispatchBuffer[3] = queueDispatchBuffer.items[3];

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

export {
    location,
    resetWarehouse,
    stateWarehouse,
    saveWarehouse,
    readWarehouse,
    queueDispatchBuffer,
    queueDispatchDock,
    queueReceiveBuffer,
    queueReceiveDock,
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
    QueueA,
    QueueB,
    QueueC,
    QueueD,
    QueueE,
    QueueF,
    QueueG,
    QueueH
};
