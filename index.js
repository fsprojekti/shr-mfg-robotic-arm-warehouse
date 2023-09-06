import {createRequire} from "module";
// define require because this app is now defined as a "module" type
const require = createRequire(import.meta.url);
import express from 'express';
const app = express();

const config = require('./config/config.json');

import {Warehouse} from "./warehouse.js";
import {processTask, checkReceiveBuffer, checkPackages} from "./task.js";

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

let warehouse;

// global variables
// busy: defined if the robotic arm is busy with processing a task
let busy = false;
// tasksQueue: an array of tasks waiting to be processed on FIFO principle
let tasksQueue = [];

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
    let warehouseJson = {
        "queueStorageDock1": warehouse.queueStorageDock1, "queueStorageDock2": warehouse.queueStorageDock2,
        "queueStorageDock3": warehouse.queueStorageDock3, "queueStorageDock4": warehouse.queueStorageDock4,
        "queueReceiveBuffer": warehouse.queueReceiveBuffer, "queueDispatchBuffer": warehouse.queueDispatchBuffer,
    }
    res.send(JSON.stringify(warehouseJson));

});

// API endpoint called by a control app to request a dispatch
app.get('/dispatch', function (req, res) {

    let requestUrl = req.ip.substring(7, req.ip.length);

    console.log("received a request to the endpoint /dispatch from IP: " + requestUrl);

    if (!req.query.packageId || !req.query.offerId || !req.query.mode) {
        console.log("Error, missing packageId and/or offerId and/or mode");
        res.send({"status": "reject, missing packageId and/or offerId and/or mode"});
    } else {

        console.log(req.query);

        // extract data from the request = source and target locations for the requested transfer
        let packageId = req.query.packageId;
        let offerId = req.query.offerId;
        let mode = req.query.mode;


        // create a request object and add it to the queue
        let reqObject = {}
        reqObject.offerId = offerId;
        reqObject.packageId = packageId;
        reqObject.mode = mode;
        // if the mode is load, store the current timestamp --> this will be used to check if the package is within the allowed time to stay in the warehouse
        if (mode === "load") {
            reqObject.storageTimeLimit = Date.now();
        }
        let queueIndex = tasksQueue.push(reqObject);

        console.log("Current tasks queue:" + JSON.stringify(tasksQueue));

        res.send({"status": "accept", "queueIndex": queueIndex});
    }
});

// start the server
app.listen(config.nodejsPort, function () {

    // initialize warehouse state
    // create a warehouse object
    warehouse = new Warehouse();
    // read last saved warehouse state from warehouse.json
    warehouse.readWarehouse();
    console.log(JSON.stringify(warehouse));

    console.log('Warehouse Node.js server listening on port ' + config.nodejsPort + '!');
});

// set the state of the warehouse
function setBusy(value) {
    busy = value;
}

// periodically check the tasks queue and process it
setInterval(async function () {

        console.info("tasks queue at the start of setInterval: " + JSON.stringify(tasksQueue));

        // check if there is any task in the queue
        if (tasksQueue.length > 0) {
            console.info("tasks queue not empty")
            // if the robot arm is not busy doing a task, start a new task
            if (!busy) {
                console.info("robot arm not busy, started processing a task...")
                setBusy(true);
                // take the first task from the queue (FIFO)
                let task = tasksQueue[0];
                console.info("processing task: " + JSON.stringify(task));

                // process the task
                await processTask(task);

            } else {
                console.info("robot arm is busy, task not started");
            }
        } else {
            console.info("task management: there are no tasks in the queue");
        }
    },
    5000
);

// periodically check the reception buffer and generate a move task if the size of the buffer exceeds the threshold set in the config
// periodically check the storage time limit of packages and request a move if the storage time exceeds a pre-defined threshold set in the config
setInterval(function () {
    checkReceiveBuffer();
    checkPackages();
}, 3000);

export {
    warehouse,
    tasksQueue,
    busy,
    setBusy
};
