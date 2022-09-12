import {createRequire} from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
let Promise = require("es6-promise").Promise;

const config = require("./config.json");
const jetmaxUbuntuServerIpAddress = config.roboticArmIpAddress;

//Warehouse
import {warehouse} from "./index.js";

// MOTION FUNCTIONS

//GO Reset
async function goReset(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "reset")
        setTimeoutTime = 100;
    else if (warehouse.location === "receiveDock" || warehouse.location === "receiveBuffer" || warehouse.location === "dispatchDock" || warehouse.location === "dispatchBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "D2" || warehouse.location === "D3")
        setTimeoutTime = 800;
    else
        setTimeoutTime = 1000;

    try {
        let X = config.resetLocation.x;
        let Y = config.resetLocation.y;
        let Z = config.resetLocation.z;
        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "reset";
                resolve("resolved");
            }, setTimeoutTime);
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

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D2")
        setTimeoutTime = 500;
    else if (warehouse.location === "receiveBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "D3")
        setTimeoutTime = 1800;
    else if (warehouse.location === "D4")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    try {
        let X = config.storageD1Location.x;
        let Y = config.storageD1Location.y;
        let Z = config.storageD1Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "D1";
                resolve("resolved");
            }, setTimeoutTime);
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

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D1")
        setTimeoutTime = 500;
    else if (warehouse.location === "receiveBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "D3")
        setTimeoutTime = 1800;
    else if (warehouse.location === "D4")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    try {
        let X = config.storageD2Location.x;
        let Y = config.storageD2Location.y;
        let Z = config.storageD2Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "D2";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goStorageD2() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

//GO F
async function goStorageD3(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D4")
        setTimeoutTime = 500;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "D2")
        setTimeoutTime = 1800;
    else if (warehouse.location === "D1")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    try {
        let X = config.storageD3Location.x;
        let Y = config.storageD3Location.y;
        let Z = config.storageD3Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "D3";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goStorageD3() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

//GO E
async function goStorageD4(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D3")
        setTimeoutTime = 500;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "D2")
        setTimeoutTime = 1800;
    else if (warehouse.location === "D1")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    try {
        let X = config.storageD4Location.x;
        let Y = config.storageD4Location.y;
        let Z = config.storageD4Location.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "D4";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goStorageD4() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);

        });
    }
}

//GO C
async function goReceiveBuffer(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "receiveDock")
        setTimeoutTime = 800;
    else
        setTimeoutTime = 1000;

    try {
        let X = config.receiveBufferLocation.x;
        let Y = config.receiveBufferLocation.y;
        let Z = config.receiveBufferLocation.z;

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "receiveBuffer";
                resolve("resolved");
            }, setTimeoutTime);
        });

    } catch (error) {
        console.log("goReceiveBuffer() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

//GO G
async function goDispatchBuffer(duration) {


    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D3")
        setTimeoutTime = 800;
    else if (warehouse.location === "D4")
        setTimeoutTime = 800;
    else if (warehouse.location === "D2")
        setTimeoutTime = 1500;
    else if (warehouse.location === "D1")
        setTimeoutTime = 1800;
    else
        setTimeoutTime = 1500;

    try {
        let X = config.dispatchBufferLocation.x; //TODO: check
        let Y = config.dispatchBufferLocation.y; //TODO: check
        let Z = config.dispatchBufferLocation.z; //TODO: check

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "dispatchBuffer";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goDispatchBuffer() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

//GO D
async function goReceiveDock(duration) {


    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "reset")
        setTimeoutTime = 800;
    else
        setTimeoutTime = 1000;

    try {
        let X = config.receiveDockLocation.x; //TODO: check
        let Y = config.receiveDockLocation.y; //TODO: check
        let Z = config.receiveDockLocation.z; //TODO: check

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "receiveDock";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goReceiveDock() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

//GO H
async function goDispatchDock(duration) {


    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "D3")
        setTimeoutTime = 800;
    else if (warehouse.location === "D4")
        setTimeoutTime = 1000;
    else if (warehouse.location === "D2")
        setTimeoutTime = 8000;
    else if (warehouse.location === "D1")
        setTimeoutTime = 1000;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 500;
    else
        setTimeoutTime = 1000;

    try {
        let X = config.dispatchDockLocation.x; //TODO
        let Y = config.dispatchDockLocation.y; //TODO
        let Z = config.dispatchDockLocation.z; //TODO

        await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "dispatchDock";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("goDispatchDock() error");
        console.log(error);
        return new Promise((resolve, reject) => {

            reject(error);

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
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();
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
        await warehouse.saveWarehouse();
        await warehouse.stateWarehouse();

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
        } else if (packageIndex === 5) {
            await moveDown(5);
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
    let z;
    // read the relative move by z axis from a config file
    if (index === 5)
        z = config.moveDownZCar;
    else
        z = config.moveDownZ[index - 1];

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
        } else if (packageIndex === 5) {
            await moveUp(5);
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
    let z;
    // read the relative move by z axis from a config file
    if (index === 5)
        z = config.moveUpZCar;
    else
        z = config.moveUpZ[index - 1];

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
    suctionON
};
