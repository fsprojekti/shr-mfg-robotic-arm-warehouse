const config = require("./config/config.json");
const {
    goReset,
    goReceiveDock,
    suctionON,
    goReceiveBuffer,
    suctionOFF,
    goStorageDock1,
    goStorageDock2,
    goStorageDock3,
    goStorageDock4,
    goDispatchBuffer,
    goDispatchDock
} = require("./motion.js");
const {Promise} = require("es6-promise");
const {warehouse} = require("./index.js");
const {default: axios} = require("axios");

import {tasksQueue, busy} from "./index.js";


async function calculateMoveToDuration(startLocation, endLocation) {
    let duration = config.moveToDurationDefault;
    // if(startLocation = "receiveDock"): default duration
    // if(endLocation === "receiveBuffer"): default duration
    // if(startLocation = "receiveBuffer" && endLocation === "storageDock2"): default duration
    if (startLocation === "receiveBuffer" && endLocation === "storageDock1")
        duration = config.moveToDurationDefault;
        // if (startLocation === "storageDock1" && endLocation = "storageDock2"   || startLocation === "storageDock2" && endLocation = "storageDock1"): default duration
        // if(startLocation === "dispatchBuffer"): default duration
        // if(endLocation === "dispatchDock"): default duration
    // if startLocation = "storageDock3" && endLocation === "dispatchBuffer": default duration
    else if (startLocation === "storageDock4" && endLocation === "dispatchBuffer")
        duration = config.moveToDurationDefault;
        // if (startLocation === "storageDock3" && endLocation = "storageDock4"   || startLocation === "storageDock4" && endLocation = "storageDock3"): default duration
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

// load a package, from a receive dock to the receive buffer
async function load(packageId, receiveBufferIndex) {

    try {
        await goReset(calculateMoveToDuration("", "reset"));
        await goReceiveDock(calculateMoveToDuration("reset", "receiveDock"));
        // "packageIndex" for suctionOn() function is 0, because the first move is to the receive dock = robot car
        await suctionON(5, config.receiveDockLocation.x, config.receiveDockLocation.y, config.receiveDockLocation.z);
        // packageIndex is the topIndex+1 of the receiveBuffer
        await goReceiveBuffer(calculateMoveToDuration("receiveDock", "receiveBuffer"));
        await suctionOFF(receiveBufferIndex, config.receiveBufferLocation.x, config.receiveBufferLocation.y, config.receiveBufferLocation.z);
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
        if (startLocation === "storageDock1")
            await goStorageDock1(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "storageDock2")
            await goStorageDock2(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "storageDock3")
            await goStorageDock3(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "storageDock4")
            await goStorageDock4(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "receiveBuffer")
            await goReceiveBuffer(calculateMoveToDuration("reset", startLocation));
        else if (startLocation === "dispatchBuffer")
            await goDispatchBuffer(calculateMoveToDuration("reset", startLocation));

        await suctionON(packageIndex);
        // remove the package from the start location
        if (startLocation === "storageDock1")
            warehouse.queueStorageDock1.dequeue();
        else if (startLocation === "storageDock2")
            warehouse.queueStorageDock2.dequeue();
        else if (startLocation === "storageDock3")
            warehouse.queueStorageDock3.dequeue();
        else if (startLocation === "storageDock4")
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
    if (startLocation === "storageDock1") {
        packageId = warehouse.queueStorageDock1.items[packageIndex];
    } else if (startLocation === "storageDock2") {
        packageId = warehouse.queueStorageDock2.items[packageIndex];
    } else if (startLocation === "storageDock3") {
        packageId = warehouse.queueStorageDock3.items[packageIndex];
    } else if (startLocation === "storageDock4") {
        packageId = warehouse.queueStorageDock4.items[packageIndex];
    } else if (startLocation === "receiveBuffer") {
        packageId = warehouse.queueReceiveBuffer.items[packageIndex];
    } else if (startLocation === "dispatchBuffer") {
        packageId = warehouse.queueDispatchBuffer.items[packageIndex];
    } else
        console.log("move() error: undefined start location");


    let durationMove1 = calculateMoveToDuration("reset", startLocation);

    console.log("selected new location: " + newLocation);

    try {

        console.log("doing goReset()");
        await goReset(calculateMoveToDuration("", "reset"));
        // move to the start location
        if (startLocation === "storageDock1") {
            console.log("doing goStorageDock1()");
            await goStorageDock1(durationMove1);
        } else if (startLocation === "storageDock2") {
            console.log("doing goStorageDock2()");
            await goStorageDock2(durationMove1);
        } else if (startLocation === "storageDock3") {
            console.log("doing goStorageDock3()");
            await goStorageDock3(durationMove1);
        } else if (startLocation === "storageDock4") {
            console.log("doing goStorageDock4()");
            await goStorageDock4(durationMove1);
        } else if (startLocation === "receiveBuffer") {
            console.log("doing goReceiveBuffer()");
            await goReceiveBuffer(durationMove1);
        } else if (startLocation === "dispatchBuffer") {
            console.log("doing goDispatchBuffer()");
            await goDispatchBuffer(durationMove1);
        }

        console.log("doing suctionON()");
        // packageIndex is the index of the package in the start location queue
        await suctionON(packageIndex - 1);
        // remove the package from the start location queue
        if (startLocation === "storageDock1")
            warehouse.queueStorageDock1.dequeue();
        else if (startLocation === "storageDock2")
            warehouse.queueStorageDock2.dequeue();
        else if (startLocation === "storageDock3")
            warehouse.queueStorageDock3.dequeue();
        else if (startLocation === "storageDock4")
            warehouse.queueStorageDock4.dequeue();
        else if (startLocation === "receiveBuffer")
            warehouse.queueReceiveBuffer.dequeue();
        warehouse.queueDispatchBuffer.dequeue();


        let durationMove2 = calculateMoveToDuration(startLocation, newLocation);

        console.log("package id:" + packageId);

        // move the robot arm to the new location
        if (newLocation === "storageDock1") {
            console.log("doing goStorageDock1()");
            await goStorageDock1(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock1.topIndex + 1);
            warehouse.queueStorageDock1.enqueue(packageId);
        } else if (newLocation === "storageDock2") {
            console.log("doing goStorageDock2()");
            await goStorageDock2(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock2.topIndex + 1);
            warehouse.queueStorageDock2.enqueue(packageId);
        } else if (newLocation === "storageDock3") {
            console.log("doing goStorageDock3()");
            await goStorageDock3(durationMove2);
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock3.topIndex + 1);
            warehouse.queueStorageDock3.enqueue(packageId);
        } else if (newLocation === "storageDock4") {
            console.log("doing goStorageDock4()");
            await goStorageDock4(durationMove2);
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
        {"location": "storageDock1", "topIndex": warehouse.queueStorageDock1.topIndex},
        {"location": "storageDock2", "topIndex": warehouse.queueStorageDock2.topIndex},
        {"location": "storageDock3", "topIndex": warehouse.queueStorageDock3.topIndex},
        {"location": "storageDock4", "topIndex": warehouse.queueStorageDock4.topIndex}
    ];
    // remove data for current location
    let queuesReduced = queues.filter(object => {
        return object.location !== currentLocation
    });

    let min = (a, f) => a.reduce((m, x) => m[f] < x[f] ? m : x);
    newLocation = min(queuesReduced, "topIndex")["location"];

    return newLocation;

}

async function processTask(task) {
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
                    console.log("load task " + task.offerId + " successfully finished, calling control app /dispatchFinished");

                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    let axiosPromise = axios.get("http://" + config.controlAppUrl + "/dispatchFinished", {
                        params: {offerId: tasksQueue[0].offerId},
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

            console.log("tasks queue:" + JSON.stringify(tasksQueue));

            // first check if the package is actually in the storage
            // check each of six docks where the package could potentially be stored
            if ((itemIndex = warehouse.queueStorageDock1.items.indexOf(task.packageId)) !== -1) {
                // package is in the storage dock D1
                console.log("package is in the storage dock D1");
                let currentTopPackageIndex = warehouse.queueStorageDock1.topIndex;
                console.log("packageId: " + task.packageId);

                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("storageDock1", currentTopPackageIndex);
                    await move("storageDock1", currentTopPackageIndex - 1);
                    await move("storageDock1", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("storageDock1", currentTopPackageIndex);
                    await move("storageDock1", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("storageDock1", currentTopPackageIndex);
                }
                await unload("storageDock1", warehouse.queueStorageDock1.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                await axios.get(config.controlAppUrl + "/dispatchFinished", {
                    params: {offerId: tasksQueue[0].offerId}
                });


            } else if ((itemIndex = warehouse.queueStorageDock2.items.indexOf(task.packageId)) !== -1) {
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
                    params: {offerId: tasksQueue[0].offerId}
                });

            } else if (warehouse.queueStorageDock3.items.indexOf(task.packageId) !== -1) {
                // package is in the storage dock D3
                console.log("package is in the storage dock D3");
                console.log("packageId: " + task.packageId);
                console.log("storageDock3 items: " + JSON.stringify(warehouse.queueStorageDock3.items));
                let itemIndex = warehouse.queueStorageDock3.items.indexOf(task.packageId);
                console.log("itemIndex:" + itemIndex);
                let currentTopPackageIndex = warehouse.queueStorageDock3.topIndex;
                console.log("currentTopPackageIndex:" + currentTopPackageIndex);
                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    console.log("move 3 packages");
                    await move("storageDock3", currentTopPackageIndex);
                    await move("storageDock3", currentTopPackageIndex - 1);
                    await move("storageDock3", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    console.log("move 2 packages");
                    await move("storageDock3", currentTopPackageIndex);
                    await move("storageDock3", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    console.log("move 1 package");
                    await move("storageDock3", currentTopPackageIndex);
                }
                await unload("storageDock3", warehouse.queueStorageDock3.topIndex);

                //send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                await axios.get(config.controlAppUrl + "/dispatchFinished", {
                    params: {offerId: tasksQueue[0].offerId}
                });

            } else if ((itemIndex = warehouse.queueStorageDock4.items.indexOf(task.packageId)) !== -1) {
                // package is in the storage dock D4
                console.log("package is in the storage dock D4");
                console.log("packageId: " + itemIndex);
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
                    params: {offerId: tasksQueue[0].offerId}
                });

            } else if ((itemIndex = warehouse.queueReceiveBuffer.items.indexOf(task.packageId)) !== -1) {
                // package is in the receive buffer
                console.log("package is in the receive buffer");
                console.log("packageId: " + itemIndex);

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
                    params: {offerId: tasksQueue[0].offerId}
                });

            } else if ((itemIndex = warehouse.queueDispatchBuffer.items.indexOf(task.packageId)) !== -1) {
                // package is in the dispatch buffer
                console.log("package is in the dispatch buffer");
                console.log("packageId: " + itemIndex);

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
                    params: {offerId: tasksQueue[0].offerId}
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
    }
}

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
            reqObject.offerId = "internal-move";
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
            reqObject.offerId = "internal-move";
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
    processTask,
    checkReceiveBuffer,
    checkDispatchBuffer
}