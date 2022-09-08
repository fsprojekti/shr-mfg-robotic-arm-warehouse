import {createRequire} from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
let Promise = require("es6-promise").Promise;

const config = require("./config.json");

const jetmaxUbuntuServerIpAddress = config.roboticArmIpAddress;

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

//Warehouse
import {saveWarehouse, stateWarehouse} from "./warehouse.js";

// MOTION FUNCTIONS

//GO Reset
async function goReset(duration) {

    try {
        let X = config.resetLocation.x;
        let Y = config.resetLocation.y;
        let Z = config.resetLocation.z;
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration : duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    } catch (error) {
        console.log("goReset() error");
        console.log(error);
        return new Promise((resolve) => {
            resolve(error);
        });
    }
}

//GO A
async function goStorageD1(duration) {

    try {
        let X = config.storageD1Location.x;
        let Y = config.storageD1Location.y;
        let Z = config.storageD1Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goStorageD1() error");
        console.log(error);
        return new Promise((resolve) => {
            resolve(error);
        });
    }
}

//GO B
async function goStorageD2(duration) {

    try {
        let X = config.storageD2Location.x;
        let Y = config.storageD2Location.y;
        let Z = config.storageD2Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goStorageD2() error");
        console.log(error);
        return new Promise((resolve,reject) => {
            reject(error);
        });
    }
}

//GO F
async function goStorageD3(duration) {

    try {
        let X = config.storageD3Location.x;
        let Y = config.storageD3Location.y;
        let Z = config.storageD3Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goStorageD3() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO E
async function goStorageD4(duration) {

    try {
        let X = config.storageD4Location.x;
        let Y = config.storageD4Location.y;
        let Z = config.storageD4Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goStorageD4() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO C
async function goReceiveBuffer(duration) {

    try {
        let X = config.receiveBufferLocation.x;
        let Y = config.receiveBufferLocation.y;
        let Z = config.receiveBufferLocation.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });

    } catch (error) {
        console.log("goReceiveBuffer() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO G
async function goDispatchBuffer(duration) {

    try {
        let X = config.dispatchBufferLocation.x; //TODO: check
        let Y = config.dispatchBufferLocation.y; //TODO: check
        let Z = config.dispatchBufferLocation.z; //TODO: check

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goDispatchBuffer() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO D
async function goReceiveDock(duration) {

    try {
        let X = config.receiveDockLocation.x; //TODO: check
        let Y = config.receiveDockLocation.y; //TODO: check
        let Z = config.receiveDockLocation.z; //TODO: check

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goReceiveDock() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO H
async function goDispatchDock(duration) {

    try {
        let X = config.dispatchDockLocation.x; //TODO
        let Y = config.dispatchDockLocation.y; //TODO
        let Z = config.dispatchDockLocation.z; //TODO

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await saveWarehouse();
        // await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 2000);
        });
    } catch (error) {
        console.log("goDispatchDock() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//SUCTION ON
async function suctionON(packageIndex) {

    try {
        console.log("doing goDown()");
        await goDown(packageIndex);
        console.log("doing goGrab()");
        await goGrab();
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
            params: {msg: {data: true}},
        });
	console.log("doing goRelease()");
	await goRelease();
        console.log("doing goUp()");
        await goUp(packageIndex);
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            //setTimeout(() => {
                resolve("resolved");
            //}, 1000);
        });
    } catch (error) {
        console.log("suctionON() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            //setTimeout(() => {
                reject(error);
            //}, 1000);
        });
    }
}

//SUCTION OFF
async function suctionOFF(packageIndex) {

    try {
        console.log("doing goDown()");
        await goDown(packageIndex);
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
            params: {msg: {data: false}},
        });
        console.log("doing goRelease()");
        await goRelease();
        console.log("doing goUp()");
	await goUp(packageIndex);
        await saveWarehouse();
        await stateWarehouse();

        return new Promise((resolve) => {
            //setTimeout(() => {
                resolve("resolved");
            //}, 1000);
        });

    } catch (error) {
        console.log("suctionOFF() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            //setTimeout(() => {
                reject(error);
            //}, 1000);
        });
    }
}

//GO DOWN
async function goDown(packageIndex) {

    try {
        if (packageIndex === 0 || packageIndex === 1) {
            await moveDown(1);
        } else if (packageIndex === 2) {
            await moveDown(2);
        } else if (packageIndex === 3) {
            await moveDown(3);
        } else if (packageIndex === 4) {
            await moveDown(4);
        } else {
            console.log("goDown: incorrect package index: " + packageIndex);
            throw new Error("goDown: incorrect package index: " + packageIndex);
        }

        return new Promise((resolve) => {
                resolve("resolved");
        });
    } catch (error) {
        console.log("goDown() error");
        console.log(error);
        return new Promise((resolve, reject) => {
                reject(error);
 
        });
    }
}

// MOVE DOWN
async function moveDown(index) {

    console.log("doing moveDown()");
    // read the relative move by z axis from a config file
    let z = config.moveDownZ[index - 1];

    // duration of the move is dependent on the end position index
    // this is crucial to prevent fast movements
    let moveDuration = config.moveDurationDefault;

    try {
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
            params: {msg: {x: 0, y: 0, z: z, duration: moveDuration}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    } catch (error) {
        console.log("moveDown() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

//GO UP
async function goUp(packageIndex) {

    try {
        if (packageIndex === 0 || packageIndex === 1) {
            await moveUp(1);
        } else if (packageIndex === 2) {
            await moveUp(2);
        } else if (packageIndex === 3) {
            await moveUp(3);
        } else if (packageIndex === 4) {
            await moveUp(4);
        } else {
            console.log("goUp: incorrect package index: " + packageIndex);
            throw new Error("goUp: incorrect package index: " + packageIndex);
        }

        return new Promise((resolve) => {

                resolve("resolved");

        });
    } catch (error) {
        console.log("goUp() error");
        console.log(error);
        return new Promise((resolve, reject) => {

                reject(error);

        });
    }
}

// MOVE UP
async function moveUp(index) {

    console.log("doing moveUp()");
    // read the relative move by z axis from a config file
    let z = config.moveUpZ[index - 1];

    // duration of the move is dependent on the end position index
    // this is crucial to prevent fast movements
    let moveDuration = config.moveDurationDefault;

    try {
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
            params: {msg: {x: 0, y: 0, z: z, duration: moveDuration}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    } catch (error) {
        console.log("moveUp() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

async function goGrab() {

    try {
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
            params: {msg: {x: 0, y: 0, z: config.goGrabZ, duration: config.moveDurationDefault}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    } catch (error) {
        console.log("goGrab() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

async function goRelease() {

    try {
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
            params: {msg: {x: 0, y: 0, z: config.goReleaseZ, duration: config.moveDurationDefault}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    } catch (error) {
        console.log("goRelease() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 1000);
        });
    }
}

export {
    goDown,
    goReset,
    goStorageD1,
    goStorageD2,
    goStorageD3,
    goStorageD4,
    goDispatchBuffer,
    goDispatchDock,
    goReceiveBuffer,
    goReceiveDock,
    suctionOFF,
    suctionON,
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
    QueueH,
};
