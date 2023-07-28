import {createRequire} from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
let Promise = require("es6-promise").Promise;
const config = require("./config/config.json");

//Warehouse
import {warehouse} from "./index.js";
import {getCenterPy, offsetToll} from "./visual.js";

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

//go to reset position
async function goReset(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "reset")
        setTimeoutTime = 100;
    else if (warehouse.location === "receiveDock" || warehouse.location === "receiveBuffer" || warehouse.location === "dispatchDock" || warehouse.location === "dispatchBuffer")
        setTimeoutTime = 800;
    else if (warehouse.location === "storageDock2" || warehouse.location === "storageDock3")
        setTimeoutTime = 1200;
    else
        setTimeoutTime = 1500;
    console.log("goReset timeout time: " + setTimeoutTime);

    try {
        let X = config.resetLocation.x;
        let Y = config.resetLocation.y;
        let Z = config.resetLocation.z;
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

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

//go to storage dock 1 location
async function goStorageDock1(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock2")
        setTimeoutTime = 1000;
    else if (warehouse.location === "receiveBuffer")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock3")
        setTimeoutTime = 2000;
    else if (warehouse.location === "storageDock4")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    console.log("goStorageD1 timeout time: " + setTimeoutTime);

    try {
        let X = config.storageDock1Location.x;
        let Y = config.storageDock1Location.y;
        let Z = config.storageDock1Location.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "storageDock1";
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

//go to storage dock 2 location
async function goStorageDock2(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock1")
        setTimeoutTime = 1000;
    else if (warehouse.location === "receiveBuffer")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock3")
        setTimeoutTime = 1800;
    else if (warehouse.location === "storageDock4")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;
    console.log("goStorageD2 timeout time: " + setTimeoutTime);

    try {
        let X = config.storageDock2Location.x;
        let Y = config.storageDock2Location.y;
        let Z = config.storageDock2Location.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "storageDock2";
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

// go to storage dock 3 location
async function goStorageDock3(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock4")
        setTimeoutTime = 1000;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock2")
        setTimeoutTime = 2000;
    else if (warehouse.location === "storageDock1")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    console.log("goStorageD3 timeout time: " + setTimeoutTime);

    try {
        let X = config.storageDock3Location.x;
        let Y = config.storageDock3Location.y;
        let Z = config.storageDock3Location.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "storageDock3";
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

// go to storage dock 4 location
async function goStorageDock4(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock3")
        setTimeoutTime = 1000;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock2")
        setTimeoutTime = 2000;
    else if (warehouse.location === "storageDock1")
        setTimeoutTime = 2000;
    else
        setTimeoutTime = 2000;

    console.log("goStorageD4 timeout time: " + setTimeoutTime);

    try {
        let X = config.storageDock4Location.x;
        let Y = config.storageDock4Location.y;
        let Z = config.storageDock4Location.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "storageDock4";
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

// go to receive buffer location
async function goReceiveBuffer(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    setTimeoutTime = 1200;

    console.log("goReceiveBuffer timeout time: " + setTimeoutTime);

    try {
        let X = config.receiveBufferLocation.x;
        let Y = config.receiveBufferLocation.y;
        let Z = config.receiveBufferLocation.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });

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

// go to dispatch buffer location
async function goDispatchBuffer(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock3")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock4")
        setTimeoutTime = 1000;
    else if (warehouse.location === "storageDock2")
        setTimeoutTime = 1500;
    else if (warehouse.location === "storageDock1")
        setTimeoutTime = 1800;
    else
        setTimeoutTime = 2000;

    console.log("goDispatchBuffer timeout time: " + setTimeoutTime);

    try {
        let X = config.dispatchBufferLocation.x;
        let Y = config.dispatchBufferLocation.y;
        let Z = config.dispatchBufferLocation.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });


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

// go to receive dock location
async function goReceiveDock(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    setTimeoutTime = 500;

    console.log("goReceiveDock timeout time: " + setTimeoutTime);

    try {
        let X = config.receiveDockLocation.x;
        let Y = config.receiveDockLocation.y;
        let Z = config.receiveDockLocation.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });


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

// go to dispatch dock location
async function goDispatchDock(duration) {

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = 0;
    if (warehouse.location === "storageDock3")
        setTimeoutTime = 1200;
    else if (warehouse.location === "storageDock4")
        setTimeoutTime = 1500;
    else if (warehouse.location === "storageDock2")
        setTimeoutTime = 1200;
    else if (warehouse.location === "storageDock1")
        setTimeoutTime = 1500;
    else if (warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else
        setTimeoutTime = 1500;

    console.log("goDispatchDock timeout time: " + setTimeoutTime);

    try {
        let X = config.dispatchDockLocation.x;
        let Y = config.dispatchDockLocation.y;
        let Z = config.dispatchDockLocation.z;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: X, y: Y, z: Z, duration: duration}},
        });


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

// move down above the package and turn the suction on
async function suctionON(packageIndex, locationX, locationY, locationZ, center) {

    let dx1, dy1, dx2, dy2;
    let newLocationX, newLocationY;
    let package_id;

    try {
        console.log("doing moDownTagDetection()");
        await moveDownTagDetection(locationX, locationY);

        if (center) {
            // get center of the april tag and move to correct the position
            console.log("getting package center ...");
            await getCenterPy().then((data) => {
                dx1 = data.x
                dy1 = data.y
                package_id = data.id
            });
            console.log("package center: ");
            console.log(dx1 + ", " + dy1)
            console.log("relative move to correct the position of the robot arm ...");

            newLocationX = locationX + dx1;
            newLocationY = locationY + dy1;

            await moveXY(newLocationX, newLocationY, config.moveDownTagDetectionHeight);

            //offset suction and camera
            console.log("move robotic arm to consider the offset between the camera and the suction cup ...");
            await offsetToll().then((data) => {
                dx2 = data.x
                dy2 = data.y
            });

            newLocationX = newLocationX + dx2;
            newLocationY = newLocationY + dy2;
        }
        else {
            newLocationX = locationX;
            newLocationY = locationY;
        }

        console.log("doing goDown()");
        console.log("location index: " + packageIndex);
        await goDown(packageIndex, newLocationX, newLocationY, center);

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/suction", {
            params: {msg: {data: true}},
        });

        console.log("doing goUp()");
        await goUp(packageIndex, newLocationX, newLocationY);

        return new Promise((resolve) => {
            resolve("resolved");
        });
    } catch (error) {
        console.log("suctionON() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// turn the suction off and move up
async function suctionOFF(packageIndex, locationX, locationY) {

    try {
        console.log("doing goDown()");
        await goDown(packageIndex, locationX, locationY);
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/suction", {
            params: {msg: {data: false}},
        });
        console.log("doing goUp()");
        await goUp(packageIndex, locationX, locationY);

        return new Promise((resolve) => {
            resolve("resolved");
        });

    } catch (error) {
        console.log("suctionOFF() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// move down above the package
async function goDown(packageIndex, locationX, locationY, center) {

    try {
        if (packageIndex === 0) {
            await moveDown(0, locationX, locationY, center);
        } else if (packageIndex === 1) {
            await moveDown(1, locationX, locationY, center);
        } else if (packageIndex === 2) {
            await moveDown(2, locationX, locationY, center);
        } else if (packageIndex === 3) {
            await moveDown(3, locationX, locationY, center);
        } else if (packageIndex === 5) {
            await moveDown(5, locationX, locationY, center);
        } else {
            console.log("goDown: incorrect package index: " + packageIndex);
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
async function moveDown(index, locationX, locationY, center) {

    console.log("doing moveDown()");
    let locationZ;
    // read the relative move by z axis from a config file
    if (index === 5)
        locationZ = config.moveDownZCar;
    else
        locationZ = config.moveDownZ[index];

    // duration of the move is dependent on the end position index
    // this is crucial to prevent fast movements
    let moveDuration = config.moveDurationDefault;

    try {
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveDuration}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1200);
        });
    } catch (error) {
        console.log("moveDown() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// MOVE DOWN TO TAG DETECTION HEIGHT
async function moveDownTagDetection(locationX, locationY) {

    console.log("doing moveDownTagDetection()");
    // duration of the move is dependent on the end position index
    // this is crucial to prevent fast movements
    let moveDuration = config.moveDurationDefault;

    try {
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: config.moveDownTagDetectionHeight, duration: moveDuration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1200);
        });
    } catch (error) {
        console.log("moveDown() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// go up to a "save" location
async function goUp(packageIndex, locationX, locationY) {

    try {
        if (packageIndex === 0) {
            await moveUp(0, locationX, locationY);
        } else if (packageIndex === 1) {
            await moveUp(1, locationX, locationY);
        } else if (packageIndex === 2) {
            await moveUp(2, locationX, locationY);
        } else if (packageIndex === 3) {
            await moveUp(3, locationX, locationY);
        } else if (packageIndex === 5) {
            await moveUp(5, locationX, locationY);
        } else {
            console.log("goUp: incorrect package index: " + packageIndex);
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

// the actual move up
async function moveUp(index, locationX, locationY) {

    console.log("doing moveUp()");
    // read the move by z axis from a config file
    let locationZ = config.moveUpZCar;

    // duration of the move is dependent on the end position index
    // this is crucial to prevent fast movements
    let moveDuration = config.moveDurationDefault;

    try {
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveDuration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1200);
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

// the first move to leave the package height
async function moveXY(x, y, z) {

    try {
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: x, y: y, z: z, duration: config.moveToDurationDefault}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 100);
        });
    } catch (error) {
        console.log("moveXY() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, 100);
        });
    }
}

// call API getState
async function getState() {
    // call /basic/state API endpoint
    try {
        console.log("calling :" + 'http://' + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + '/basic/state');
        const response = await axios.get('http://' + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + '/basic/state')
        console.log("/basic/state response received, data:" + JSON.stringify(response.data));
        return response.data;

    } catch (error) {
        console.error("Error calling /basic/state API endpoint.");
        console.error(error);
        throw error;
    }
}

export {
    goDown,
    goReset,
    goStorageDock1,
    goStorageDock2,
    goStorageDock3,
    goStorageDock4,
    goDispatchBuffer,
    goDispatchDock,
    goReceiveBuffer,
    goReceiveDock,
    suctionOFF,
    suctionON,
    moveXY,
    getState
};
