import {createRequire} from "module";
// define require because this app is now defined as a "module" type

const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const axios = require('axios').default;
let Promise = require("es6-promise").Promise;

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

// open file with configuration data
//const fs = require('fs');
const config = require("./config.json");

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
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
    queueReceiveBuffer,
    queueDispatchBuffer
} from "./robotmotion.js";

//Warehouse
import {readWarehouse, saveWarehouse, stateWarehouse} from "./warehouse.js";
// import {Promise} from "es6-promise";

// global variables
let busy = false;
let tasksQueue = [];
let warehouse = {};

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
    res.send(JSON.stringify(warehouse));

});

// API endpoint called by a control app to request a dispatch
app.get('/dispatch', function (req, res) {

    console.log("received a request to the endpoint /dispatch");

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
    warehouse = readWarehouse();

    console.log('Warehouse Node.js server listening on port ' + config.nodejsPort + '!');
});

// load a package, from a receive dock to the receive buffer
async function load() {

    // let res = [];

    try {
        await goReset();
        await goReceiveDock();
        await suctionON();
        await goReceiveBuffer();
        await suctionOFF();
        await goReset();

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
async function unload(location) {

    try {
        await goReset();
        if (location === "D1")
            await goStorageD1();
        else if (location === "D2")
            await goStorageD2();
        else if (location === "D3")
            await goStorageD3();
        else if (location === "D4")
            await goStorageD4();
        else if (location === "receiveBuffer")
            await goReceiveBuffer();
        else if (location === "dispatchBuffer")
            await goDispatchBuffer();

        await suctionON();
        await goDispatchDock();
        await suctionOFF();
        await goReset();

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
// // the starting location can be any of the 4 storage docks or of the 2 buffer docks
async function move(startLocation, itemIndex) {

    let newLocation = await findNewLocation(startLocation);

    try {
        // move to the start location
        await goReset();
        if (startLocation === "D1")
            await goStorageD1();
        else if (startLocation === "D2")
            await goStorageD2();
        else if (startLocation === "D3")
            await goStorageD3();
        else if (startLocation === "D4")
            await goStorageD4();
        else if (startLocation === "receiveBuffer")
            await goReceiveBuffer();
        else if (startLocation === "dispatchBuffer")
            await goDispatchBuffer();

        await suctionON();

        // move to the new location
        if (newLocation === "D1")
            await goStorageD1();
        else if (newLocation === "D2")
            await goStorageD2();
        else if (newLocation === "D3")
            await goStorageD3();
        else if (newLocation === "D4")
            await goStorageD4();

        await suctionOFF();
        await goReset();

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

// find a best location for a package move
async function findNewLocation(currentLocation) {

    let newLocation;
    let queues = [
        {"location": "D1", "topIndex": queueStorageDock1.topIndex},
        {"location": "D2", "topIndex": queueStorageDock2.topIndex},
        {"location": "D3", "topIndex": queueStorageDock3.topIndex},
        {"location": "D4", "topIndex": queueStorageDock4.topIndex},
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

    // check if there is any task in the queue
    if (tasksQueue.length > 0) {
        console.log("tasks queue not empty")
        // if the robot arm is not busy doing a task, start a new task
        if (!busy) {
            console.log("robot arm not busy, started processing a task...")
            // take the first task from the queue (FIFO)
            let task = tasksQueue[0];
            console.log("processing task: " + task);

            // if the task is to load a package from a car to the storage
            if (task.mode === "load") {
                console.log("task mode is load");

                // first check if the receive buffer is full
                if (queueReceiveBuffer.getSize() === 4)
                    console.log("error, receive buffer is full, load task not performed");
                // receive buffer is not full, proceed with the load task
                else {
                    console.log("calling the load() task...");
                    let loadPromise = load();
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
                                },
                                (error) => {
                                    console.log("error calling control app, task remains in the queue");
                                    console.log(error);
                                }
                            )
                        },
                        (error) => {
                            console.log("error while doing the LOAD task, task remains in the queue");
                            // console.log(error);
                        }
                    )
                }
            } else if (task.mode === "unload") {

                let itemIndex;
                // this array holds all the promises for async functions calls, it is constructed depending on the start
                // location of the package, and at the end Promise.all is called
                let promiseArray = []
                // first check if the package is actually in the storage
                // check each of six docks where the package could potentially be stored
                if ((itemIndex = queueStorageDock1.items.indexOf(task.packageId)) !== -1) {
                    // package is in the storage dock D1
                    let currentTopPackageIndex = queueStorageDock1.topIndex;

                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("D1", currentTopPackageIndex));
                        promiseArray.push(move("D1", currentTopPackageIndex - 1));
                        promiseArray.push(move("D1", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("D1", currentTopPackageIndex));
                        promiseArray.push(move("D1", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("D1", currentTopPackageIndex));
                    }
                    promiseArray.push(unload("D1"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else if (queueStorageDock2.items.indexOf(task.packageId) !== -1) {
                    // package is in the storage dock D2
                    let currentTopPackageIndex = queueStorageDock2.topIndex;
                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("D2", currentTopPackageIndex));
                        promiseArray.push(move("D2", currentTopPackageIndex - 1));
                        promiseArray.push(move("D2", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("D2", currentTopPackageIndex));
                        promiseArray.push(move("D2", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("D2", currentTopPackageIndex));
                    }
                    promiseArray.push(unload("D2"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else if (queueStorageDock3.items.indexOf(task.packageId) !== -1) {
                    // package is in the storage dock D3
                    let currentTopPackageIndex = queueStorageDock3.topIndex;
                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("D3", currentTopPackageIndex));
                        promiseArray.push(move("D3", currentTopPackageIndex - 1));
                        promiseArray.push(move("D3", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("D3", currentTopPackageIndex));
                        promiseArray.push(move("D3", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("D3", currentTopPackageIndex));
                    }
                    promiseArray.push(unload("D1"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else if (queueStorageDock4.items.indexOf(task.packageId) !== -1) {
                    // package is in the storage dock D4
                    let currentTopPackageIndex = queueStorageDock4.topIndex;
                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("D4", currentTopPackageIndex));
                        promiseArray.push(move("D4", currentTopPackageIndex - 1));
                        promiseArray.push(move("D4", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("D4", currentTopPackageIndex));
                        promiseArray.push(move("D4", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("D4", currentTopPackageIndex));
                    }
                    promiseArray.push(unload("D4"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else if (queueReceiveBuffer.items.indexOf(task.packageId) !== -1) {
                    // package is in the receive buffer
                    let currentTopPackageIndex = queueReceiveBuffer.topIndex;
                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex));
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex - 1));
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex));
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("receiveBuffer", currentTopPackageIndex));
                    }
                    promiseArray.push(unload("receiveBuffer"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else if (queueDispatchBuffer.items.indexOf(task.packageId) !== -1) {
                    // package is in the dispatch buffer
                    let currentTopPackageIndex = queueDispatchBuffer.topIndex;
                    // check if the package is at the top of the dock
                    if ((currentTopPackageIndex - itemIndex) === 3) {
                        // move 3 packages
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex));
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex - 1));
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex - 2));
                    } else if ((currentTopPackageIndex - itemIndex) === 2) {
                        // move 2 packages
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex));
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex - 1));
                    } else if ((currentTopPackageIndex - itemIndex) === 1) {
                        // move 1 package
                        promiseArray.push(move("dispatchBuffer", currentTopPackageIndex));

                    }
                    promiseArray.push(unload("dispatchBuffer"))

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    promiseArray.push(axios.get(config.controlAppUrl + "/dispatchFinished", {
                        params: {taskId: tasksQueue[0].taskId}
                    }));

                } else {
                    console.log("error, the package is not in the storage")
                }
                // if the package is in the storage, proceed with the task
                if (promiseArray.length > 0) {
                    Promise.all(promiseArray)
                        .then(() => {
                                console.log("the unload task successfully finished, removing the task from the queue")
                                // remove the task from the queue
                                tasksQueue.shift();
                            },
                            (error) => {
                                console.log("error while doing the unload task, task remains in the queue");
                                console.log(error);
                            })
                }
            } else if (task.mode === "move") {

                let promiseMove = move(task.packageDock, task.dockPosition)
                promiseMove.then(() => {
                    console.log("the move task successfully finished, removing the task from the queue")
                    // remove the task from the queue
                    tasksQueue.shift();

                }, (error) => {
                    console.log("error while doing the move task, task remains in the queue");
                    console.log(error);
                })
            }
        } else {
            console.log("robot arm is busy, task not started");
        }
    } else {
        console.log("task management: there are no tasks in the queue");
    }
}, 5000);

// function that periodically checks if receive and dispatch buffers are too full, generates "move" tasks and
//      ads them to the tasksQueue
// packages are moved if more than two packages are currently in the queue
setInterval(function () {

    let receiveCounter = 0;
    let dispatchCounter = 0;

    // RECEIVE BUFFER
    if (queueReceiveBuffer.getSize() > 2) {
        // create a request object for package in position 3 (index === 2) and add it to the queue
        let reqObject = {}
        reqObject.taskId = "null";
        reqObject.packageId = queueReceiveBuffer[2];
        reqObject.packageDock = "receiveBuffer";
        reqObject.dockPosition = 2;
        reqObject.mode = "move";
        tasksQueue.push(reqObject);
        receiveCounter++;
    }
    if (queueReceiveBuffer.getSize() > 3) {
        // create a request object for package in position 4 (index === 3) and add it to the queue
        let reqObject = {}
        reqObject.taskId = "null";
        reqObject.packageId = queueReceiveBuffer[3];
        reqObject.packageDock = "receiveBuffer";
        reqObject.dockPosition = 3;
        reqObject.mode = "move";
        tasksQueue.push(reqObject);
        receiveCounter++;
    }

    // DISPATCH BUFFER
    if (queueDispatchBuffer.getSize() > 2) {
        // create a request object for package in position 3 (index === 2) and add it to the queue
        let reqObject = {}
        reqObject.taskId = 0;
        reqObject.packageId = queueDispatchBuffer[2];
        reqObject.packageDock = "dispatchBuffer";
        reqObject.dockPosition = 2;
        reqObject.mode = "move";
        tasksQueue.push(reqObject);
        dispatchCounter++;
    }
    if (queueDispatchBuffer.getSize() > 3) {
        // create a request object for package in position 4 (index === 3) and add it to the queue
        let reqObject = {}
        reqObject.taskId = 0;
        reqObject.packageId = queueDispatchBuffer[3];
        reqObject.packageDock = "dispatchBuffer";
        reqObject.dockPosition = 3;
        reqObject.mode = "move";
        tasksQueue.push(reqObject);
        dispatchCounter++;
    }

    if (receiveCounter !== 0 || dispatchCounter !== 0) {
        console.log(receiveCounter + " moves from receiveBuffer and " + dispatchCounter + " moves " +
            "from dispatchCounter added to the tasksQueue");
    }

}, 5000)