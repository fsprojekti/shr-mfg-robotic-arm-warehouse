import {createRequire} from "module";

const require = createRequire(import.meta.url);
const fs = require("fs");

//QUEUES
import {Dock} from "./dock.js";

export class Warehouse {
    constructor() {
        this.location = "reset";
        this.queueStorageDock1 = new Dock();
        this.queueStorageDock2 = new Dock();
        this.queueReceiveBuffer = new Dock();
        this.queueReceiveDock = new Dock();
        this.queueStorageDock4 = new Dock();
        this.queueStorageDock3 = new Dock();
        this.queueDispatchBuffer = new Dock();
        this.queueDispatchDock = new Dock();
    }

    // print the current state of the warehouse to the console
    stateWarehouse() {

        console.log("printing warehouse state: ");
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
        // console.log(this);
    }

    // reset the warehouse to an empty state
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

    // read last warehouse state from warehouse.json file
    readWarehouse() {
        const warehouse = require("./data/warehouse.json");
	//console.log(warehouse);
        if (warehouse.queueStorageDock1[0] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.queueStorageDock1[0]);
        }
        if (warehouse.queueStorageDock1[1] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.queueStorageDock1[1]);
        }
        if (warehouse.queueStorageDock1[2] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.queueStorageDock1[2]);
        }
        if (warehouse.queueStorageDock1[3] !== undefined) {
            this.queueStorageDock1.enqueue(warehouse.queueStorageDock1[3]);
        }

        if (warehouse.queueStorageDock2[0] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.queueStorageDock2[0]);
        }
        if (warehouse.queueStorageDock2[1] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.queueStorageDock2[1]);
        }
        if (warehouse.queueStorageDock2[2] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.queueStorageDock2[2]);
        }
        if (warehouse.queueStorageDock2[3] !== undefined) {
            this.queueStorageDock2.enqueue(warehouse.queueStorageDock2[3]);
        }

        if (warehouse.queueStorageDock3[0] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.queueStorageDock3[0]);
        }
        if (warehouse.queueStorageDock3[1] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.queueStorageDock3[1]);
        }
        if (warehouse.queueStorageDock3[2] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.queueStorageDock3[2]);
        }
        if (warehouse.queueStorageDock3[3] !== undefined) {
            this.queueStorageDock3.enqueue(warehouse.queueStorageDock3[3]);
        }

        if (warehouse.queueStorageDock4[0] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.queueStorageDock4[0]);
        }
        if (warehouse.queueStorageDock4[1] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.queueStorageDock4[1]);
        }
        if (warehouse.queueStorageDock4[2] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.queueStorageDock4[2]);
        }
        if (warehouse.queueStorageDock4[3] !== undefined) {
            this.queueStorageDock4.enqueue(warehouse.queueStorageDock4[3]);
        }

        if (warehouse.queueDispatchBuffer[0] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.queueDispatchBuffer[0]);
        }
        if (warehouse.queueDispatchBuffer[1] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.queueDispatchBuffer[1]);
        }
        if (warehouse.queueDispatchBuffer[2] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.queueDispatchBuffer[2]);
        }
        if (warehouse.queueDispatchBuffer[3] !== undefined) {
            this.queueDispatchBuffer.enqueue(warehouse.queueDispatchBuffer[3]);
        }

        if (warehouse.queueReceiveBuffer[0] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.queueReceiveBuffer[0]);
        }
        if (warehouse.queueReceiveBuffer[1] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.queueReceiveBuffer[1]);
        }
        if (warehouse.queueReceiveBuffer[2] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.queueReceiveBuffer[2]);
        }
        if (warehouse.queueReceiveBuffer[3] !== undefined) {
            this.queueReceiveBuffer.enqueue(warehouse.queueReceiveBuffer[3]);
        }

        let warehouseObj = {
            "storageDock1": this.queueStorageDock1, "storageDock2": this.queueStorageDock2,
            "storageDock3": this.queueStorageDock3, "storageDock4": this.queueStorageDock4,
            "receiveBuffer": this.queueReceiveBuffer, "dispatchBuffer": this.queueDispatchBuffer,
        }
        console.log("warehouse read: " + JSON.stringify(warehouseObj));
    }

    // save current state of the warehouse to the warehouse.json file
    saveWarehouse() {

        console.log("saving data to file: ");

        let saveDataObject = {};
        saveDataObject.queueStorageDock1 = [];
        saveDataObject.queueStorageDock2 = [];
        saveDataObject.queueStorageDock3 = [];
        saveDataObject.queueStorageDock4 = [];
        saveDataObject.queueReceiveBuffer = [];
        saveDataObject.queueDispatchBuffer = [];

        if (this.queueStorageDock1.items[0] !== undefined)
            saveDataObject.queueStorageDock1[0] = this.queueStorageDock1.items[0];
        if (this.queueStorageDock1.items[1] !== undefined)
            saveDataObject.queueStorageDock1[1] = this.queueStorageDock1.items[1];
        if (this.queueStorageDock1.items[2] !== undefined)
            saveDataObject.queueStorageDock1[2] = this.queueStorageDock1.items[2];
        if (this.queueStorageDock1.items[3] !== undefined)
            saveDataObject.queueStorageDock1[3] = this.queueStorageDock1.items[3];

        if (this.queueStorageDock2.items[0] !== undefined)
            saveDataObject.queueStorageDock2[0] = this.queueStorageDock2.items[0];
        if (this.queueStorageDock2.items[1] !== undefined)
            saveDataObject.queueStorageDock2[1] = this.queueStorageDock2.items[1];
        if (this.queueStorageDock2.items[2] !== undefined)
            saveDataObject.queueStorageDock2[2] = this.queueStorageDock2.items[2];
        if (this.queueStorageDock2.items[3] !== undefined)
            saveDataObject.queueStorageDock2[3] = this.queueStorageDock2.items[3];

        if (this.queueStorageDock3.items[0] !== undefined)
            saveDataObject.queueStorageDock3[0] = this.queueStorageDock3.items[0];
        if (this.queueStorageDock3.items[1] !== undefined)
            saveDataObject.queueStorageDock3[1] = this.queueStorageDock3.items[1];
        if (this.queueStorageDock3.items[2] !== undefined)
            saveDataObject.queueStorageDock3[2] = this.queueStorageDock3.items[2];
        if (this.queueStorageDock3.items[3] !== undefined)
            saveDataObject.queueStorageDock3[3] = this.queueStorageDock3.items[3];

        if (this.queueStorageDock4.items[0] !== undefined)
            saveDataObject.queueStorageDock4[0] = this.queueStorageDock4.items[0];
        if (this.queueStorageDock4.items[1] !== undefined)
            saveDataObject.queueStorageDock4[1] = this.queueStorageDock4.items[1];
        if (this.queueStorageDock4.items[2] !== undefined)
            saveDataObject.queueStorageDock4[2] = this.queueStorageDock4.items[2];
        if (this.queueStorageDock4.items[3] !== undefined)
            saveDataObject.queueStorageDock4[3] = this.queueStorageDock4.items[3];

        if (this.queueReceiveBuffer.items[0] !== undefined)
            saveDataObject.queueReceiveBuffer[0] = this.queueReceiveBuffer.items[0];
        if (this.queueReceiveBuffer.items[1] !== undefined)
            saveDataObject.queueReceiveBuffer[1] = this.queueReceiveBuffer.items[1];
        if (this.queueReceiveBuffer.items[2] !== undefined)
            saveDataObject.queueReceiveBuffer[2] = this.queueReceiveBuffer.items[2];
        if (this.queueReceiveBuffer.items[3] !== undefined)
            saveDataObject.queueReceiveBuffer[3] = this.queueReceiveBuffer.items[3];

        if (this.queueDispatchBuffer.items[0] !== undefined)
            saveDataObject.queueDispatchBuffer[0] = this.queueDispatchBuffer.items[0];
        if (this.queueDispatchBuffer.items[1] !== undefined)
            saveDataObject.queueDispatchBuffer[1] = this.queueDispatchBuffer.items[1];
        if (this.queueDispatchBuffer.items[2] !== undefined)
            saveDataObject.queueDispatchBuffer[2] = this.queueDispatchBuffer.items[2];
        if (this.queueDispatchBuffer.items[3] !== undefined)
            saveDataObject.queueDispatchBuffer[3] = this.queueDispatchBuffer.items[3];

        console.log(JSON.stringify(saveDataObject));

        fs.writeFile("./data/warehouse.json", JSON.stringify(saveDataObject), function (err) {
            console.log(JSON.stringify(saveDataObject));
            if (err) {
                console.log(err);
            }
        });
    }
}
