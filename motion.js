import {createRequire} from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
let Promise = require("es6-promise").Promise;

import {warehouse} from "./index.js";
import {getCenterPy} from "./visual.js";

const config = require("./config/config.json");

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

// calculate how much time should a moveTo (absolute move) take
async function calculateMoveToDuration(startLocation, endLocation) {
    let duration = config.moveToDurationDefault;
    if (startLocation === "receiveBuffer" && endLocation === "storageDock1")
        duration = config.moveToDurationDefault;
    else if (startLocation === "storageDock4" && endLocation === "dispatchBuffer")
        duration = config.moveToDurationDefault;
    // moves from one side of the robot arm to the other side need longer time
    else if ((startLocation === "storageDock1" || startLocation === "storageDock2") && (endLocation === "storageDock3" || endLocation === "storageDock4"))
        duration = config.moveToDurationDefault / 2;
    else if ((startLocation === "storageDock3" || startLocation === "storageDock4") && (endLocation === "storageDock1" || endLocation === "storageDock2"))
        duration = config.moveToDurationDefault / 2;
    // moves from the reset location
    else if (startLocation === "reset") {
        if (endLocation === "storageDock2" || endLocation === "storageDock3")
            duration = config.moveToDurationDefault;
        else if (endLocation === "storageDock1" || endLocation === "storageDock4")
            duration = config.moveToDurationDefault;
    } else if (endLocation === "reset") {
        if (startLocation === "storageDock2" || startLocation === "storageDock3")
            duration = config.moveToDurationDefault;
        else if (startLocation === "storageDock1" || startLocation === "storageDock4")
            duration = config.moveToDurationDefault;
    }
    return duration;
}

// calculate how much time should we wait for the robot arm to finish a move
async function calculateSetTimeoutTime(endLocation) {

    let setTimeoutTime = 0;
    if (endLocation === "reset" && warehouse.location === "reset")
        setTimeoutTime = 0;
    else if (endLocation === "reset" && warehouse.location === "receiveDock" || warehouse.location === "receiveBuffer" || warehouse.location === "dispatchDock" || warehouse.location === "dispatchBuffer")
        setTimeoutTime = 800;
    else if (endLocation === "reset" && warehouse.location === "storageDock2" || warehouse.location === "storageDock3")
        setTimeoutTime = 1200;
    else if (endLocation === "reset")
        setTimeoutTime = 1500;

    // if end location is storageDock1
    else if (endLocation === "storageDock1" && warehouse.location === "storageDock2")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock1" && warehouse.location === "receiveBuffer")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock1" && warehouse.location === "storageDock3")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock1" && warehouse.location === "storageDock4")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock1")
        setTimeoutTime = 2000;

    // if end location is storageDock2
    else if (endLocation === "storageDock2" && warehouse.location === "storageDock1")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock2" && warehouse.location === "receiveBuffer")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock2" && warehouse.location === "storageDock3")
        setTimeoutTime = 1800;
    else if (endLocation === "storageDock2" && warehouse.location === "storageDock4")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock2")
        setTimeoutTime = 2000;

    // if end location is storageDock3
    else if (endLocation === "storageDock3" && warehouse.location === "storageDock4")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock3" && warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock3" && warehouse.location === "storageDock2")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock3" && warehouse.location === "storageDock1")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock3")
        setTimeoutTime = 2000;

    // if end location is storageDock4
    else if (endLocation === "storageDock4" && warehouse.location === "storageDock3")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock4" && warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else if (endLocation === "storageDock4" && warehouse.location === "storageDock2")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock4" && warehouse.location === "storageDock1")
        setTimeoutTime = 2000;
    else if (endLocation === "storageDock4")
        setTimeoutTime = 2000;

    // if end location is receiveBuffer (then the start location is loading dock)
    else if (endLocation === "receiveBuffer")
        setTimeoutTime = 1200;

    // if end location is dispatch buffer
    else if (endLocation === "dispatchBuffer" && warehouse.location === "storageDock3")
        setTimeoutTime = 1000;
    else if (endLocation === "dispatchBuffer" && warehouse.location === "storageDock4")
        setTimeoutTime = 1000;
    else if (endLocation === "dispatchBuffer" && warehouse.location === "storageDock2")
        setTimeoutTime = 1500;
    else if (endLocation === "dispatchBuffer" && warehouse.location === "storageDock1")
        setTimeoutTime = 1800;
    else if (endLocation === "dispatchBuffer")
        setTimeoutTime = 2000;

    // if end location is receiveDock
    else if (endLocation === "receiveDock")
        setTimeoutTime = 500;

    // if end location is dispatch dock
    else if (endLocation === "dispatchDock" && warehouse.location === "storageDock3")
        setTimeoutTime = 1200;
    else if (endLocation === "dispatchDock" && warehouse.location === "storageDock4")
        setTimeoutTime = 1500;
    else if (endLocation === "dispatchDock" && warehouse.location === "storageDock2")
        setTimeoutTime = 1200;
    else if (endLocation === "dispatchDock" && warehouse.location === "storageDock1")
        setTimeoutTime = 1500;
    else if (endLocation === "dispatchDock" && warehouse.location === "dispatchBuffer")
        setTimeoutTime = 1000;
    else if (endLocation === "dispatchDock")
        setTimeoutTime = 1500;

    console.log("move to " + endLocation + " timeout time: " + setTimeoutTime);

    return setTimeoutTime;
}

// get (absolute) coordinates of the end location
async function getEndLocationCoordinates(endLocation) {

    let coordinates = {};

    if (endLocation === "reset") {
        coordinates.x = config.resetLocation.x;
        coordinates.y = config.resetLocation.y;
        coordinates.z = config.resetLocation.z;
    } else if (endLocation === "storageDock1") {
        coordinates.x = config.storageDock1Location.x;
        coordinates.y = config.storageDock1Location.y;
        coordinates.z = config.storageDock1Location.z;
    } else if (endLocation === "storageDock1Camera") {
        coordinates.x = config.storageDock1LocationCamera.x;
        coordinates.y = config.storageDock1LocationCamera.y;
        coordinates.z = config.storageDock1LocationCamera.z;
    } else if (endLocation === "storageDock2") {
        coordinates.x = config.storageDock2Location.x;
        coordinates.y = config.storageDock2Location.y;
        coordinates.z = config.storageDock2Location.z;
    } else if (endLocation === "storageDock2Camera") {
        coordinates.x = config.storageDock2LocationCamera.x;
        coordinates.y = config.storageDock2LocationCamera.y;
        coordinates.z = config.storageDock2LocationCamera.z;
    } else if (endLocation === "storageDock3") {
        coordinates.x = config.storageDock3Location.x;
        coordinates.y = config.storageDock3Location.y;
        coordinates.z = config.storageDock3Location.z;
    } else if (endLocation === "storageDock3Camera") {
        coordinates.x = config.storageDock3LocationCamera.x;
        coordinates.y = config.storageDock3LocationCamera.y;
        coordinates.z = config.storageDock3LocationCamera.z;
    } else if (endLocation === "storageDock4") {
        coordinates.x = config.storageDock4Location.x;
        coordinates.y = config.storageDock4Location.y;
        coordinates.z = config.storageDock4Location.z;
    } else if (endLocation === "storageDock4Camera") {
        coordinates.x = config.storageDock4LocationCamera.x;
        coordinates.y = config.storageDock4LocationCamera.y;
        coordinates.z = config.storageDock4LocationCamera.z;
    } else if (endLocation === "receiveBuffer") {
        coordinates.x = config.receiveBufferLocation.x;
        coordinates.y = config.receiveBufferLocation.y;
        coordinates.z = config.receiveBufferLocation.z;
    } else if (endLocation === "receiveBufferCamera") {
        coordinates.x = config.receiveBufferLocationCamera.x;
        coordinates.y = config.receiveBufferLocationCamera.y;
        coordinates.z = config.receiveBufferLocationCamera.z;
    } else if (endLocation === "dispatchBuffer") {
        coordinates.x = config.dispatchBufferLocation.x;
        coordinates.y = config.dispatchBufferLocation.y;
        coordinates.z = config.dispatchBufferLocation.z;
    } else if (endLocation === "dispatchBufferCamera") {
        coordinates.x = config.dispatchBufferLocationCamera.x;
        coordinates.y = config.dispatchBufferLocationCamera.y;
        coordinates.z = config.dispatchBufferLocationCamera.z;
    } else if (endLocation === "receiveDock") {
        coordinates.x = config.receiveDockLocation.x;
        coordinates.y = config.receiveDockLocation.y;
        coordinates.z = config.receiveDockLocation.z;
    } else if (endLocation === "receiveDockCamera") {
        coordinates.x = config.receiveDockLocationCamera.x;
        coordinates.y = config.receiveDockLocationCamera.y;
        coordinates.z = config.receiveDockLocationCamera.z;
    } else if (endLocation === "dispatchDock") {
        coordinates.x = config.dispatchDockLocation.x;
        coordinates.y = config.dispatchDockLocation.y;
        coordinates.z = config.dispatchDockLocation.z;
    } else if (endLocation === "dispatchDockCamera") {
        coordinates.x = config.dispatchDockLocationCamera.x;
        coordinates.y = config.dispatchDockLocationCamera.y;
        coordinates.z = config.dispatchDockLocationCamera.z;
    }

    console.log("end location coordinates:" + coordinates.x + ", " + coordinates.y + ", " + coordinates.z);

    return coordinates;
}

// make an absolute move on the XY plane
async function go(startLocation, endLocation) {

    // duration of the move operation
    let duration = calculateMoveToDuration(startLocation, endLocation);

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = await calculateSetTimeoutTime(endLocation);

    // get end location coordinates
    let endLocationCoordinates = await getEndLocationCoordinates(endLocation);

    try {
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {
                msg: {
                    x: endLocationCoordinates.x,
                    y: endLocationCoordinates.y,
                    z: endLocationCoordinates.z,
                    duration: duration
                }
            },
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                warehouse.location = "reset";
                resolve("resolved");
            }, setTimeoutTime);
        });
    } catch (error) {
        console.log("error moving to " + endLocation);
        console.log(error);
        return new Promise((resolve) => {
            resolve(error);
        });
    }
}

// move down to the package, turn the suction on and move back up
async function suctionON(packageIndex, locationX, locationY) {

    let dx1, dy1, dx2, dy2, dx3, dy3;
    let newLocationX, newLocationY;
    let package_id;

    let locationZ;
    // determine the Z axis location
    // 5: a move to the robot car
    // in other cases the Z coordinate is retrieved from config
    if (packageIndex === 5)
        locationZ = config.moveDownZCar;
        // else if (packageIndex === -1)
    //     locationZ = config.moveDownTagDetectionHeightLoad;
    else
        locationZ = config.moveDownZ[packageIndex];

    try {
        // go down to a tag detection height: this is a safe distance above the actual package location
        console.log("doing goDown() to a tag detection height");
        await goXYZ(locationX, locationY, locationZ + config.moveDownSafeDistance);

        // get center of the april tag and move to correct the position
        console.log("suctionON(): getting package center, 1s tim ...");
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
        await goXYZ(newLocationX, newLocationY, locationZ + config.moveDownSafeDistance);

        for (let i = 0; i < 5; i++) {


            // because moves are not 100% accurate we repeat the correction
            await getCenterPy().then((data) => {
                dx3 = data.x
                dy3 = data.y
                package_id = data.id
            });
            console.log("package center 2nd time: ");
            console.log(dx3 + ", " + dy3)

            console.log("relative move to correct the position of the robot arm ...");
            newLocationX = newLocationX + dx3;
            newLocationY = newLocationY + dy3;
            await goXYZ(newLocationX, newLocationY, locationZ + config.moveDownSafeDistance);

        }

        // final check if the package is now in the center of the camera image
        await getCenterPy().then((data) => {
            dx3 = data.x
            dy3 = data.y
            package_id = data.id
        });

        // move to consider offset between the suction cup and the camera
        console.log("move robotic arm to consider the offset between the camera and the suction cup ...");
        await moveOffset(locationZ + config.moveDownSafeDistance).then((data) => {
            dx2 = data.x
            dy2 = data.y
        });

        newLocationX = newLocationX + dx2;
        newLocationY = newLocationY + dy2;

        // go down and turn the suction on
        console.log("doing goDown()");
        console.log("location index: " + packageIndex);
        await goDown(newLocationX, newLocationY, packageIndex);
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/suction", {
            params: {msg: {data: true}},
        });

        // go up to the default height
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

// move down, turn the suction off and move back up
async function suctionOFF(packageIndex, locationX, locationY, mode) {

    let dx1, dy1, dx2, dy2;
    let newLocationX, newLocationY;

    try {
        if (mode === "unload") {

            console.log("doing goDown() to a tag detection height");
            await goDown(locationX, locationY, 5, "suctionOFF");

            // get center of the april tag and move to correct the position
            console.log("suctionOFF(): getting package center ...");
            await getCenterPy().then((data) => {
                dx1 = data.x
                dy1 = data.y
            });
            console.log("package center: ");
            console.log(dx1 + ", " + dy1)
            console.log("relative move to correct the position of the robot arm ...");

            newLocationX = locationX + dx1;
            newLocationY = locationY + dy1;

            await goXYZ(newLocationX, newLocationY, config.moveDownZCar + config.moveDownSafeDistance);

            //offset between suction and camera
            console.log("move robotic arm to consider the offset between the camera and the suction cup ...");
            await moveOffset(config.moveDownZCar + config.moveDownSafeDistance).then((data) => {
                dx2 = data.x
                dy2 = data.y
            });

            newLocationX = newLocationX + dx2;
            newLocationY = newLocationY + dy2;

        } else {
            newLocationX = locationX;
            newLocationY = locationY;
        }

        // go down and turn the suction off
        console.log("doing goDown()");
        console.log("location index: " + packageIndex);
        await goDown(newLocationX, newLocationY, packageIndex, "suctionOFF");
        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/suction", {
            params: {msg: {data: false}},
        });
        // move back up to the default height
        console.log("doing goUp()");
        await goUp(packageIndex, newLocationX, newLocationY);

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

// move down to the package
// if this is part of the unload task, the robot moves to a safe distance above the package
async function goDown(locationX, locationY, packageIndex, mode) {

    try {

        let locationZ;
        // read the relative move by z axis from a config file
        if (packageIndex === 5)
            locationZ = config.moveDownZCar;
        else if (packageIndex === -1)
            locationZ = config.moveDownTagDetectionHeightLoad;
        else
            locationZ = config.moveDownZ[packageIndex];

        if (packageIndex !== -1 && mode === "suctionOFF")
            locationZ += config.moveDownSafeDistance / 2;

        let moveToDuration = config.moveToDurationDefault;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveToDuration}},
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1200);
        });

    } catch (error) {
        console.log("goDown() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// go up to a default location
async function goUp(packageIndex, locationX, locationY) {

    try {
        let locationZ = config.moveUpZDefault;

        // duration of the move is dependent on the end position index; this is crucial to prevent fast movements
        let moveToDuration = config.moveToDurationDefault;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveToDuration}},
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1200);
        });

    } catch (error) {
        console.log("goUp() error");
        console.log(error);
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// the move to correct the position of the robotic arm to the center of the april tag
// this is an absolute move on all 3 axis simultaneously
async function goXYZ(x, y, z) {

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

// move robot arm to consider the offset between the camera and the suction cup
// this move is made on XY plane
const moveOffset = async (locationZ) => {
    let current_x, current_y, o;
    let response = await getState();
    current_x = response.x
    current_y = response.y
    console.log("getState() inside offsetToll finished");
    o = Math.atan2(current_y, current_x);
    console.log("o: " + o)
    console.log("middleware angle", o * 180 / Math.PI);
    let dx = Math.cos(o) * 43;
    let dy = Math.sin(o) * 43;
    let d = {
        x: dx,
        y: dy
    }
    await goXYZ(current_x + dx, current_y + dy, locationZ);

    return d;
}

// call API getState and retrieve current state of the robotic arm
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
    go,
    // goDown,
    goXYZ,
    suctionOFF,
    suctionON,
    getState
};
