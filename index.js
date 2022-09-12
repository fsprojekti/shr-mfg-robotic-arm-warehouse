import {createRequire} from "module";
// define require because this app is now defined as a "module" type

const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const axios = require('axios').default;
let Promise = require("es6-promise").Promise;

// open file with configuration data
//const fs = require('fs');
const config = require("./config.json");

import {Warehouse} from "./warehouse.js";

let warehouse;

import {
    goStorageD1,
    goStorageD2,
    goStorageD3,
    goStorageD4,
    goReset,
    goReceiveDock,
    goReceiveBuffer,
    goDispatchDock,
    goDispatchBuffer,
    suctionON,
    suctionOFF,
} from "./robotmotion.js";

// global variables
let busy = false;
let tasksQueue = [];
// let warehouse = {};

// #### API ENDPOINTS ####

// default API endpoint, returns a message that the server is up and running
app.get('/', function (req, res) {

    console.log("Received a request to the endpoint /");
    res.send("Warehouse Node.js server is up and running.");

});

// API endpoint that returns current value of the requests queue
app.get('/requestsQueue', function (req, res) {

    console.log("received a request to the endpoint /requestsQueue");
    res.send(JSON.stringify(tasksQueue));

});

// API endpoint that returns current state of the warehouse
app.get('/warehouse', function (req, res) {

    console.log("received a request to the endpoint /warehouse");
    warehouse = {
        "storageDock1": warehouse.queueStorageDock1, "storageDock2": warehouse.queueStorageDock2,
        "storageDock3": warehouse.queueStorageDock3, "storageDock4": warehouse.queueStorageDock4,
        "receiveBuffer": warehouse.queueReceiveBuffer, "dispatchBuffer": warehouse.queueDispatchBuffer,
    }
    res.send(JSON.stringify(warehouse));

});

// API endpoint called by a control app to request a dispatch
app.get('/dispatch', function (req, res) {


    let requestUrl = req.ip.substring(7, req.ip.length);

    console.log("received a request to the endpoint /dispatch from IP: " + requestUrl);


    if (!req.query.packageId || !req.query.taskId || !req.query.mode) {
        console.log("Error, missing packageId and/or taskId and/or mode");
        res.send({"state": "reject, missing packageId and/or taskId and/or mode"});
    } else {

        console.log(req.query);

        // extract data from the request = source and target locations for the requested transfer
        let packageId = req.query.packageId;
        let taskId = req.query.taskId;
        let mode = req.query.mode;

        // create a request object and add it to the queue
        let reqObject = {}
        reqObject.taskId = taskId;
        reqObject.packageId = packageId;
        reqObject.mode = mode;

        let queueIndex = tasksQueue.push(reqObject);

        console.log("Current tasks queue:" + JSON.stringify(tasksQueue));

        res.send({"state": "accept", "queueIndex": queueIndex});
    }
});

// start the server
app.listen(config.nodejsPort, function () {

    // initialize warehouse state
    // create a warehouse object
    warehouse = new Warehouse();
    // read last warehouse state from warehouse.json
    warehouse.readWarehouse();

    // create a test request object and add it to the queue
    // let reqObject = {}
    // reqObject.taskId = 1;
    // reqObject.packageId = "abc";
    // reqObject.packageDock = "D1";
    // reqObject.dockPosition = 4;
    // reqObject.mode = "test";
    // tasksQueue.push(reqObject);

    console.log('Warehouse Node.js server listening on port ' + config.nodejsPort + '!');
});

function calculateMoveToDuration(startLocation, endLocation) {

    let duration = config.moveToDurationDefault;

    // if(startLocation = "receiveDock"): default duration
    // if(endLocation === "receiveBuffer"): default duration
    // if(startLocation = "receiveBuffer" && endLocation === "D2"): default duration
    if (startLocation === "receiveBuffer" && endLocation === "D1")
        duration = config.moveToDurationDefault;

        // if (startLocation === "D1" && endLocation = "D2"   || startLocation === "D2" && endLocation = "D1"): default duration

        // if(startLocation === "dispatchBuffer"): default duration
        // if(endLocation === "dispatchDock"): default duration
    // if startLocation = "D3" && endLocation === "dispatchBuffer": default duration
    else if (startLocation === "D4" && endLocation === "dispatchBuffer")
        duration = config.moveToDurationDefault;

        // if (startLocation === "D3" && endLocation = "D4"   || startLocation === "D4" && endLocation = "D3"): default duration

    // moves from one side of the robot arm to the other side need longer time
    else if ((startLocation === "D1" || startLocation === "D2") && (endLocation === "D3" || endLocation === "D4"))
        duration = config.moveToDurationDefault / 2;
    else if ((startLocation === "D3" || startLocation === "D4") && (endLocation === "D1" || endLocation === "D2"))
        duration = config.moveToDurationDefault / 3;

    // moves from the reset location
    else if (startLocation === "reset") {
        if (endLocation === "D2" || endLocation === "D3")
            duration = config.moveToDurationDefault / 2;
        else if (endLocation === "D1" || endLocation === "D4")
            duration = config.moveToDurationDefault / 2;
    } else if (endLocation === "reset") {
        if (startLocation === "D2" || startLocation === "D3")
            duration = config.moveToDurationDefault / 2;
        else if (startLocation === "D1" || startLocation === "D4")
            duration = config.moveToDurationDefault / 2;
    }

    return duration;
}

// load a package, from a receive dock to the receive buffer
async function load(packageId, receiveBufferIndex) {

    try {
        await goReset(calculateMoveToDuration("", "reset"));
        await goReceiveDock(calculateMoveToDuration("reset", "receiveDock"));
        // "packageIndex" for suctionOn() function is 0, because the first move is to the receive dock = robot car
        await suctionON(5);
        // packageIndex is the topIndex+1 of the receiveBuffer
        await goReceiveBuffer(calculateMoveToDuration("receiveDock", "receiveBuffer"));
        await suctionOFF(receiveBufferIndex);
        // move the package to the receive buffer queue
        warehouse.queueReceiveBuffer.enqueue(packageId);

        await goReset(calculateMoveToDuration("", "reset"));

        return new Promise((resolve) => {
            resolve("done");
        });
    } catch (error) {
        console.log("error executing the load task");
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// unload a package - from any of the storage docks, receive buffer or dispatch buffer to the dispatch dock
async function unload(startLocation, packageIndex) {

    console.log("starting an unload from: (" + startLocation + ", " + packageIndex + ")");

    try {
        await goReset(calculateMoveToDuration("", "reset"));
        if (startLocation === "D1")
            await goStorageD1(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "D2")
            await goStorageD2(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "D3")
            await goStorageD3(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "D4")
            await goStorageD4(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "receiveBuffer")
            await goReceiveBuffer(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "dispatchBuffer")
            await goDispatchBuffer(calculateMoveToDuration("reset", startLocation));

        await suctionON(packageIndex);
        // remove the package from the start location
        if (startLocation === "D1")
            warehouse.queueStorageDock1.dequeue();
        else if (startLocation === "D2")
            warehouse.queueStorageDock2.dequeue();
        else if (startLocation === "D3")
            warehouse.queueStorageDock3.dequeue();
        else if (startLocation === "D4")
            warehouse.queueStorageDock4.dequeue();
        else if (startLocation === "receiveBuffer")
            warehouse.queueReceiveBuffer.dequeue();
        else if (startLocation === "dispatchBuffer")
            warehouse.queueDispatchBuffer.dequeue();

        await goDispatchDock(calculateMoveToDuration(startLocation, "dispatchDock"));
        // "packageIndex" of suctionOFF() is 0, because the end location is dispatch dock = robot car
        await suctionOFF(5);
        await goReset(calculateMoveToDuration("dispatchDock", "reset"));

        return new Promise((resolve) => {
            resolve("done");
        });
    } catch (error) {
        console.log("error executing the unload task");
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// move a package from one dock to another
// the starting location can be any of the 4 storage docks or of the 2 buffer docks
async function move(startLocation, packageIndex) {

    console.log("starting a move from: (" + startLocation + ", " + packageIndex + ")");

    let newLocation = await findNewLocation(startLocation);

    //	console.log(JSON.stringify(warehouse.queueReceiveBuffer));

    let packageId;
    if (startLocation === "storageDock1")
        packageId = warehouse.queueStorageDock1.items[packageIndex];
    else if (startLocation === "storageDock2")
        packageId = warehouse.queueStorageDock2.items[packageIndex];
    else if (startLocation === "storageDock3")
        packageId = warehouse.queueStorageDock3.items[packageIndex];
    else if (startLocation === "storageDock4")
        packageId = warehouse.queueStorageDock4.items[packageIndex];
    else if (startLocation === "receiveBuffer")
        packageId = warehouse.queueReceiveBuffer.items[packageIndex];
    else if (startLocation === "dispatchBuffer")
        packageId = warehouse.queueDispatchBuffer.items[packageIndex];
    else
        console.log("move() error: undefined start location");


    let durationMove1 = calculateMoveToDuration("reset", startLocation);

    console.log("selected new location: " + newLocation);

    try {

        console.log("doing goReset()");
        await goReset(calculateMoveToDuration("", "reset"));
        // move to the start location
        if (startLocation === "D1") {
            console.log("doing goStorageD1()");
            await goStorageD1(durationMove1);
        } else if (startLocation === "D2") {
            console.log("doing goStorageD2()");
            await goStorageD2(durationMove1);
        } else if (startLocation === "D3") {
            console.log("doing goStorageD3()");
            await goStorageD3(durationMove1);
        } else if (startLocation === "D4") {
            console.log("doing goStorageD4()");
            await goStorageD4(durationMove1);
        } else if (startLocation === "receiveBuffer") {
            console.log("doing goReceiveBuffer()");
            await goReceiveBuffer(durationMove1);
        } else if (startLocation === "dispatchBuffer") {
            console.log("doing goDispatchBuffer()");
            await goDispatchBuffer(durationMove1);
        }

        console.log("doing suctionON()");
        // packageIndex is the index of the package in the start location queue
        await suctionON(packageIndex);
        // remove the package from the start location queue
        if (startLocation === "D1")
            warehouse.queueStorageDock1.dequeue();
        else if (startLocation === "D2")
            warehouse.queueStorageDock2.dequeue();
        else if (startLocation === "D3")
            warehouse.queueStorageDock3.dequeue();
        else if (startLocation === "D4")
            warehouse.queueStorageDock4.dequeue();
        else if (startLocation === "receiveBuffer")
            warehouse.queueReceiveBuffer.dequeue();
        warehouse.queueDispatchBuffer.dequeue();


        let durationMove2 = calculateMoveToDuration(startLocation, newLocation);

        console.log("package id:" + packageId);

        // move the robot arm to the new location
        if (newLocation === "D1") {
            console.log("doing goStorageD1()");
            await goStorageD1(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock1.topIndex + 1);
            warehouse.queueStorageDock1.enqueue(packageId);
        } else if (newLocation === "D2") {
            console.log("doing goStorageD2()");
            await goStorageD2(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock2.topIndex + 1);
            warehouse.queueStorageDock2.enqueue(packageId);
        } else if (newLocation === "D3") {
            console.log("doing goStorageD3()");
            await goStorageD3(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock3.topIndex + 1);
            warehouse.queueStorageDock3.enqueue(packageId);
        } else if (newLocation === "D4") {
            console.log("doing goStorageD4()");
            await goStorageD4(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock4.topIndex + 1);
            warehouse.queueStorageDock4.enqueue(packageId);
        } else if (newLocation === "receiveBuffer") {
            console.log("doing receiveBuffer()");
            await goReceiveBuffer(durationMove2)
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueReceiveBuffer.topIndex + 1);
            warehouse.queueReceiveBuffer.enqueue(packageId);
        } else if (newLocation === "dispatchBuffer") {
            console.log("doing dispatchBuffer()");
            await goDispatchBuffer(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueDispatchBuffer.topIndex + 1);
            warehouse.queueDispatchBuffer.enqueue(packageId);
        }

        console.log("doing goReset()");
        await goReset(calculateMoveToDuration(newLocation, "reset"));

        return new Promise((resolve) => {
            resolve("done");
        });
    } catch (error) {
        console.log("error executing the move task");
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// find the best location for a package move
async function findNewLocation(currentLocation) {

    let newLocation;
    let queues = [
        {"location": "D1", "topIndex": warehouse.queueStorageDock1.topIndex},
        {"location": "D2", "topIndex": warehouse.queueStorageDock2.topIndex},
        {"location": "D3", "topIndex": warehouse.queueStorageDock3.topIndex},
        {"location": "D4", "topIndex": warehouse.queueStorageDock4.topIndex}
    ];
    // remove data for current location
    let queuesReduced = queues.filter(object => {
        return object.location !== currentLocation
    });

    let min = (a, f) => a.reduce((m, x) => m[f] < x[f] ? m : x);
    newLocation = min(queuesReduced, "topIndex")["location"];

    return newLocation;

}

// periodically check the tasks queue and order a transfer (move)
setInterval(async function () {

    console.log("tasks queue at the start of setInterval: " + JSON.stringify(tasksQueue));

    // check if there is any task in the queue
    if (tasksQueue.length > 0) {
        console.log("tasks queue not empty")
        // if the robot arm is not busy doing a task, start a new task
        if (!busy) {
            console.log("robot arm not busy, started processing a task...")
            busy = true;
            // take the first task from the queue (FIFO)
            let task = tasksQueue[0];
            console.log("processing task: " + JSON.stringify(task));

            // if the task is to load a package from a car to the storage
            if (task.mode === "load") {
                console.log("task mode is load");

                // first check if the receive buffer is full
                if (warehouse.queueReceiveBuffer.getSize() === 4)
                    console.log("error, receive buffer is full, load task not performed");
                // receive buffer is not full, proceed with the load task
                else {
                    console.log("calling the load() task...");
                    let loadPromise = load(task.packageId, warehouse.queueReceiveBuffer.topIndex + 1);
                    loadPromise.then(
                        (data) => {
                            console.log(data);
                            console.log("load task " + task.taskId + " successfully finished, calling control app /dispatchFinished");

                            // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/dispatchFinished", {
                                params: {taskId: tasksQueue[0].taskId},
                            });
                            axiosPromise.then(
                                (data) => {
                                    console.log(data);
                                    console.log("/dispatchFinished successfully called, removing a task from the queue")
                                    tasksQueue.shift();
                                    console.log("tasks queue after load: " + JSON.stringify(tasksQueue));
                                    busy = false;
                                    // check if the receive buffer is too full and create a move task (or tasks)
                                    checkReceiveBuffer();
                                },
                                (error) => {
                                    console.log("error calling control app, task remains in the queue");
                                    console.log(error);
                                    busy = false;
                                }
                            )
                        },
                        (error) => {
                            console.log("error while doing the LOAD task, task remains in the queue");
                            console.log(error);
                        }
                    )
                }
            } else if (task.mode === "unload") {

                console.log("task mode is unload");
                let itemIndex;

                try {

                    // first check if the package is actually in the storage
                    // check each of six docks where the package could potentially be stored
                    if ((itemIndex = warehouse.queueStorageDock1.items.indexOf(task.packageId)) !== -1) {
                        // package is in the storage dock D1
                        console.log("package is in the storage dock D1");
                        let currentTopPackageIndex = warehouse.queueStorageDock1.topIndex;


                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("storageDock1", currentTopPackageIndex);
                            await move("storageDock1", currentTopPackageIndex - 1);
                            await move("storageDock1", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("storageDock1D1", currentTopPackageIndex);
                            await move("storageDock1", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("storageDock1", currentTopPackageIndex);
                        }
                        await unload("storageDock1", warehouse.queueStorageDock1.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });


                    } else if (warehouse.queueStorageDock2.items.indexOf(task.packageId) !== -1) {
                        // package is in the storage dock D2
                        console.log("package is in the storage dock D2");
                        let currentTopPackageIndex = warehouse.queueStorageDock2.topIndex;
                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("storageDock2", currentTopPackageIndex);
                            await move("storageDock2", currentTopPackageIndex - 1);
                            await move("storageDock2", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("storageDock2", currentTopPackageIndex);
                            await move("storageDock2", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("storageDock2", currentTopPackageIndex);
                        }
                        await unload("storageDock2", warehouse.queueStorageDock2.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });

                    } else if (warehouse.queueStorageDock3.items.indexOf(task.packageId) !== -1) {
                        // package is in the storage dock D3
                        console.log("package is in the storage dock D3");
                        let currentTopPackageIndex = warehouse.queueStorageDock3.topIndex;
                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("storageDock3", currentTopPackageIndex);
                            await move("storageDock3", currentTopPackageIndex - 1);
                            await move("storageDock3", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("storageDock3", currentTopPackageIndex);
                            await move("storageDock3", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("storageDock3", currentTopPackageIndex);
                        }
                        await unload("storageDock3", warehouse.queueStorageDock3.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });

                    } else if (warehouse.queueStorageDock4.items.indexOf(task.packageId) !== -1) {
                        // package is in the storage dock D4
                        console.log("package is in the storage dock D4");
                        let currentTopPackageIndex = warehouse.queueStorageDock4.topIndex;
                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("storageDock4", currentTopPackageIndex);
                            await move("storageDock4", currentTopPackageIndex - 1);
                            await move("storageDock4", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("storageDock4", currentTopPackageIndex);
                            await move("storageDock4", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("storageDock4", currentTopPackageIndex);
                        }
                        await unload("storageDock4", warehouse.queueStorageDock4.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });

                    } else if (warehouse.queueReceiveBuffer.items.indexOf(task.packageId) !== -1) {
                        // package is in the receive buffer
                        console.log("package is in the receive buffer");
                        let currentTopPackageIndex = warehouse.queueReceiveBuffer.topIndex;
                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("receiveBuffer", currentTopPackageIndex);
                            await move("receiveBuffer", currentTopPackageIndex - 1);
                            await move("receiveBuffer", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("receiveBuffer", currentTopPackageIndex);
                            await move("receiveBuffer", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("receiveBuffer", currentTopPackageIndex);
                        }
                        await unload("receiveBuffer", warehouse.queueReceiveBuffer.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });

                    } else if (warehouse.queueDispatchBuffer.items.indexOf(task.packageId) !== -1) {
                        // package is in the dispatch buffer
                        console.log("package is in the dispatch buffer");
                        let currentTopPackageIndex = warehouse.queueDispatchBuffer.topIndex;
                        // check if the package is at the top of the dock
                        if ((currentTopPackageIndex - itemIndex) === 3) {
                            // move 3 packages
                            await move("dispatchBuffer", currentTopPackageIndex);
                            await move("dispatchBuffer", currentTopPackageIndex - 1);
                            await move("dispatchBuffer", currentTopPackageIndex - 2);
                        } else if ((currentTopPackageIndex - itemIndex) === 2) {
                            // move 2 packages
                            await move("dispatchBuffer", currentTopPackageIndex);
                            await move("dispatchBuffer", currentTopPackageIndex - 1);
                        } else if ((currentTopPackageIndex - itemIndex) === 1) {
                            // move 1 package
                            await move("dispatchBuffer", currentTopPackageIndex);

                        }
                        await unload("dispatchBuffer", warehouse.queueDispatchBuffer.topIndex);

                        // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                        await axios.get(config.controlAppUrl + "/dispatchFinished", {
                            params: {taskId: tasksQueue[0].taskId}
                        });

                    } else {
                        console.log("error, the package is not in the warehouse")
                    }

                    console.log("the unload task successfully finished, removing the task from the queue")
                    // remove the task from the queue
                    tasksQueue.shift();
                    console.log("tasks queue after unload: " + JSON.stringify(tasksQueue));
                    busy = false;

                } catch (error) {
                    console.log("error while doing the UNLOAD task, task remains in the queue");
                    console.log(error);
                }

            } else if (task.mode === "move") {

                let promiseMove = move(task.packageDock, task.dockPosition)
                promiseMove.then(() => {

                    console.log("the move task successfully finished, removing the task from the queue")
                    // remove the task from the queue
                    tasksQueue.shift();

                    console.log("tasks queue after move: " + JSON.stringify(tasksQueue));
                    busy = false;

                }, (error) => {
                    console.log("error while doing the move task, task remains in the queue");
                    console.log(error);
                })
            } else if (task.mode === "test") {

                console.log("task mode is test");

                //if(task.mode === "test-storage1") {
                let promiseMove = move(task.packageDock, task.dockPosition)
                promiseMove.then(() => {
                    console.log("the move task successfully finished, removing the task from the queue")
                    // remove the task from the queue
                    tasksQueue.shift();

                    console.log("tasks queue after test: " + JSON.stringify(tasksQueue));
                    busy = false;

                }, (error) => {
                    console.log("error while doing the move task, task remains in the queue");
                    console.log(error);
                })
                // }
            }
        } else {
            console.log("robot arm is busy, task not started");
        }
    } else {
        console.log("task management: there are no tasks in the queue");
    }
}, 5000);

// function that checks if receive buffer is too full, generates "move" tasks and ads them to the tasksQueue
// packages are moved if more than pre-specified number of packages are currently in the queue
function checkReceiveBuffer() {

    let receiveCounter = 0;

    let i;
    for (i = warehouse.queueReceiveBuffer.getSize(); i > config.maxReceiveBufferSizeForMove; i--) {

        // check if a task with this packageId and packageDock === receiveBuffer and dockPosition === (i-1)
        //      is already in the queue
        if (tasksQueue.find(task => task.packageId = warehouse.queueReceiveBuffer.items[i - 1] &&
            task.packageDock === "receiveBuffer" &&
            task.dockPosition === (i - 1)) !== undefined) {
            console.log("a move task for this packageId is already in the queue");
        } else {
            // create a request object for package in position 3 (index === 2) and add it to the queue
            let reqObject = {}
            reqObject.taskId = "internal-move";
            reqObject.packageId = warehouse.queueReceiveBuffer.items[i - 1];
            reqObject.packageDock = "receiveBuffer";
            reqObject.dockPosition = i - 1;
            reqObject.mode = "move";
            tasksQueue.push(reqObject);
            receiveCounter++;
        }

    }

    if (receiveCounter !== 0) {
        console.log(receiveCounter + " moves from receiveBuffer added to the tasksQueue");
    }
}

// function that checks if receive buffer is too full, generates "move" tasks and ads them to the tasksQueue
// packages are moved if more than pre-specified number of packages are currently in the queue
function checkDispatchBuffer() {

    let dispatchCounter = 0;

    let i;
    for (i = warehouse.queueDispatchBuffer.getSize(); i > config.maxDispatchBufferSizeForMove; i--) {

        // check if a task with this packageId and packageDock === dispatchBuffer and dockPosition === (i-1)
        //      is already in the queue
        if (tasksQueue.find(task => task.packageId = warehouse.queueDispatchBuffer.items[i - 1] &&
            task.packageDock === "receiveBuffer" &&
            task.dockPosition === (i - 1)) !== undefined) {

            console.log("a move task for this packageId is already in the queue");
        } else {
            // create a request object for package in position 3 (index === 2) and add it to the queue
            let reqObject = {}
            reqObject.taskId = "internal-move";
            reqObject.packageId = warehouse.queueDispatchBuffer.items[i - 1];
            reqObject.packageDock = "dispatchBuffer";
            reqObject.dockPosition = i - 1;
            reqObject.mode = "move";
            tasksQueue.push(reqObject);
            dispatchCounter++;
        }
    }

    if (dispatchCounter !== 0) {
        console.log(dispatchCounter + " moves from dispatchBuffer added to the tasksQueue");
    }
}

export {
    warehouse
};
