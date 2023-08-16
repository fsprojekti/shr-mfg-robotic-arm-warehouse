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

// calculate how much time should a move take
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
    } else if (endLocation === "storageDock2") {
        coordinates.x = config.storageDock2Location.x;
        coordinates.y = config.storageDock2Location.y;
        coordinates.z = config.storageDock2Location.z;
    } else if (endLocation === "storageDock3") {
        coordinates.x = config.storageDock3Location.x;
        coordinates.y = config.storageDock3Location.y;
        coordinates.z = config.storageDock3Location.z;
    } else if (endLocation === "storageDock4") {
        coordinates.x = config.storageDock4Location.x;
        coordinates.y = config.storageDock4Location.y;
        coordinates.z = config.storageDock4Location.z;
    } else if (endLocation === "receiveBuffer") {
        coordinates.x = config.receiveBufferLocation.x;
        coordinates.y = config.receiveBufferLocation.y;
        coordinates.z = config.receiveBufferLocation.z;
    } else if (endLocation === "dispatchBuffer") {
        coordinates.x = config.dispatchBufferLocation.x;
        coordinates.y = config.dispatchBufferLocation.y;
        coordinates.z = config.dispatchBufferLocation.z;
    } else if (endLocation === "receiveDock") {
        coordinates.x = config.receiveDockLocation.x;
        coordinates.y = config.receiveDockLocation.y;
        coordinates.z = config.receiveDockLocation.z;
    } else if (endLocation === "dispatchDock") {
        coordinates.x = config.dispatchDockLocation.x;
        coordinates.y = config.dispatchDockLocation.y;
        coordinates.z = config.dispatchDockLocation.z;
    }

    console.log("end location coordinates:" + coordinates.x + ", " + coordinates.y + ", " + coordinates.z);

    return coordinates;
}

async function go(startLocation, endLocation) {

    // duration of the move operation
    let duration = calculateMoveToDuration(startLocation, endLocation);

    // set time to wait for the robot arm to finish the move (depends on the current location of the robot arm)
    let setTimeoutTime = await calculateSetTimeoutTime(endLocation);

    // end location coordinates
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

// move down above the package and turn the suction on
async function suctionON(packageIndex, locationX, locationY, locationZ) {

    let dx1, dy1, dx2, dy2;
    let newLocationX, newLocationY;
    let package_id;

    try {
        console.log("doing goDown() to tag detection height");
        await goDown(-1, locationX, locationY);

        // if (center) {
        // get center of the april tag and move to correct the position
        console.log("suctionON(): getting package center ...");
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

        await goXY(newLocationX, newLocationY, config.moveDownTagDetectionHeight);

        //offset suction and camera
        console.log("move robotic arm to consider the offset between the camera and the suction cup ...");
        await offsetToll().then((data) => {
            dx2 = data.x
            dy2 = data.y
        });

        newLocationX = newLocationX + dx2;
        newLocationY = newLocationY + dy2;

        console.log("doing goDown()");
        console.log("location index: " + packageIndex);
        await goDown(packageIndex, newLocationX, newLocationY);

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
async function suctionOFF(packageIndex, locationX, locationY, locationZ, mode) {

    let dx1, dy1, dx2, dy2;
    let newLocationX, newLocationY;

    try {
        if(mode === "unload") {

            console.log("doing goDown() to tag detection height");
            await goDown(-1, locationX, locationY);

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

            await goXY(newLocationX, newLocationY, config.moveDownTagDetectionHeight);

            //offset suction and camera
            console.log("move robotic arm to consider the offset between the camera and the suction cup ...");
            await offsetToll().then((data) => {
                dx2 = data.x
                dy2 = data.y
            });

            newLocationX = newLocationX + dx2;
            newLocationY = newLocationY + dy2;

        } else {
            newLocationX = locationX;
            newLocationY = locationY;
        }

        console.log("doing goDown()");
        console.log("location index: " + packageIndex);
        await goDown(packageIndex, newLocationX, newLocationY);

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/suction", {
            params: {msg: {data: false}},
        });
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

// move down above the package
async function goDown(packageIndex, locationX, locationY) {

    try {

        let locationZ;
        // read the relative move by z axis from a config file
        if (packageIndex === 5)
            locationZ = config.moveDownZCar;
        else if (packageIndex === -1)
            locationZ = config.moveDownTagDetectionHeight;
        else
            locationZ = config.moveDownZ[packageIndex];

        let moveDuration = config.moveDurationDefault;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveDuration}},
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

// go up to a "save" location
async function goUp(packageIndex, locationX, locationY) {

    try {
        let locationZ = config.moveUpZDefault;

        // duration of the move is dependent on the end position index; this is crucial to prevent fast movements
        let moveDuration = config.moveDurationDefault;

        await axios.get("http://" + config.roboticArmIpAddress + ":" + config.roboticArmHttpServerPort + "/basic/moveTo", {
            params: {msg: {x: locationX, y: locationY, z: locationZ, duration: moveDuration}},
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
async function goXY(x, y, z) {

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
    go,
    // goDown,
    goXY,
    suctionOFF,
    suctionON,
    getState
};
