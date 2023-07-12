import {createRequire} from "module";
// define require because this app is now defined as a "module" type
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const axios = require('axios').default;

// open file with configuration data
const config = require("./config/config.json");

import {Warehouse} from "./warehouse.js";

let warehouse;
import {processTask, checkReceiveBuffer} from "./task.js";

// global variables
let busy = false;
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
    // read last warehouse state from warehouse.json
    warehouse.readWarehouse();
    console.log(JSON.stringify(warehouse));

    console.log('Warehouse Node.js server listening on port ' + config.nodejsPort + '!');
});

// periodically check the tasks queue and process it
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

                // process the task
                await processTask(task);

            } else {
                console.log("robot arm is busy, task not started");
            }
        } else {
            console.log("task management: there are no tasks in the queue");
        }
    },
    5000
);

setInterval(function () {
    checkReceiveBuffer();

}, 3000);

export {
    warehouse,
    tasksQueue,
    busy
};
