import {createRequire} from "module";
// define require because this app is now defined as a "module" type
const require = createRequire(import.meta.url);
import axios from "axios";
import pkg from "es6-promise";

const {Promise} = pkg

import {warehouse, tasksQueue, setBusy} from "./index.js";
import {go, suctionON, suctionOFF} from "./motion.js";
import {findNewLocation} from "./relocation.js"
import {Package} from "./package.js";

const config = require('./config/config.json');

// add timestamps in front of all log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

// load a package from the reception dock to the reception buffer
async function load(packageId, storageTimeLimit, receiveBufferIndex) {

    try {
        // move from last position to the reset position (in case the previous run of the program ended unexpectedly)
        await go("", "reset");
        // move to the reception dock position on XY plane
        await go("reset", "receiveDockCamera");
        // move down to the package and turn on the suction
        // "packageIndex" for suctionOn() function is 5, because the first move is to the reception dock = robot car
        await suctionON(5, config.receiveDockLocationCamera.x, config.receiveDockLocationCamera.y);
        // move to the reception buffer on XY plane
        await go("receiveDock", "receiveBuffer");
        // move down and turn off the suction to release the package
        await suctionOFF(receiveBufferIndex, config.receiveBufferLocation.x, config.receiveBufferLocation.y, config.receiveBufferLocation.z);

        // put the package to the reception buffer queue
        warehouse.queueReceiveBuffer.enqueue(new Package(packageId, storageTimeLimit));
        // print the current state of the warehouse to the console and also save the date to the JSON file
        await warehouse.stateWarehouse();
        await warehouse.saveWarehouse();
        // move to the reset position
        await go("", "reset");

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

// unload a package, from any of the storage docks, reception buffer or dispatch buffer to the dispatch dock = robot car
async function unload(startLocation, packageIndex) {

    console.log("starting an unload from: (" + startLocation + ", " + packageIndex + ")");
    let suctionONx, suctionONy;

    try {
        // move from last position to the reset position (in case the previous run of the program ended unexpectedly)
        await go("", "reset");
        // move to the starting position of the unload task
        // NOTE: as the first part of this task relies on detection of the april tag, this movement is made relatively to the camera position
        if (startLocation === "storageDock1Camera") {
            await go("reset", startLocation);
            suctionONx = config.storageDock1LocationCamera.x;
            suctionONy = config.storageDock1LocationCamera.y;
        } else if (startLocation === "storageDock2Camera") {
            await go("reset", startLocation);
            suctionONx = config.storageDock2LocationCamera.x;
            suctionONy = config.storageDock2LocationCamera.y;
        } else if (startLocation === "storageDock3Camera") {
            await go("reset", startLocation);
            suctionONx = config.storageDock3LocationCamera.x;
            suctionONy = config.storageDock3LocationCamera.y;
        } else if (startLocation === "storageDock4Camera") {
            await go("reset", startLocation);
            suctionONx = config.storageDock4LocationCamera.x;
            suctionONy = config.storageDock4LocationCamera.y;
        } else if (startLocation === "receiveBufferCamera") {
            await go("reset", startLocation);
            suctionONx = config.receiveBufferLocationCamera.x;
            suctionONy = config.receiveBufferLocationCamera.y;
        } else if (startLocation === "dispatchBufferCamera") {
            await go("reset", startLocation);
            suctionONx = config.dispatchBufferLocationCamera.x;
            suctionONy = config.dispatchBufferLocationCamera.y;
        }

        // move down to the package and turn on the suction
        await suctionON(packageIndex, suctionONx, suctionONy);

        // remove the package from the start location dock
        if (startLocation === "storageDock1Camera")
            warehouse.queueStorageDock1.dequeue();
        else if (startLocation === "storageDock2Camera")
            warehouse.queueStorageDock2.dequeue();
        else if (startLocation === "storageDock3Camera")
            warehouse.queueStorageDock3.dequeue();
        else if (startLocation === "storageDock4Camera")
            warehouse.queueStorageDock4.dequeue();
        else if (startLocation === "receiveBufferCamera")
            warehouse.queueReceiveBuffer.dequeue();
        else if (startLocation === "dispatchBufferCamera")
            warehouse.queueDispatchBuffer.dequeue();

        // print the current state of the warehouse to the console and also save the date to the JSON file
        await warehouse.stateWarehouse();
        await warehouse.saveWarehouse();

        // move to the end location dock
        // NOTE: this part does not consider the april tag location, therefore this move is made relatively to the suction cup location and not the camera location
        await go(startLocation, "dispatchDockCamera");
        // move down and turn off the suction to release the package
        // "packageIndex" of suctionOFF() is 5, because the end location is dispatch dock = robot car
        await suctionOFF(5, config.dispatchDockLocationCamera.x, config.dispatchDockLocationCamera.y, "unload");
        // move to the reset position
        await go("dispatchDock", "reset");

        return new Promise((resolve) => {
            resolve("done");
        });
    } catch
        (error) {
        console.log("error executing the unload task");
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}

// move a package from one dock to another
// the starting location can be any of the 4 storage docks or one of the 2 buffer docks
async function move(startLocation, packageIndex) {

    console.log("starting a move from: (" + startLocation + ", " + packageIndex + ")");

    let suctionONx, suctionONy;
    let suctionOFFx, suctionOFFy;

    // find the end location for the move task
    // NOTE: currently this method selects the least occupied dock
    let newLocation = await findNewLocation(startLocation);
    console.log("selected new location: " + newLocation);

    // get the id of the package that needs to be moved
    let packageId;
    if (startLocation === "storageDock1Camera") {
        packageId = warehouse.queueStorageDock1.items[packageIndex];
    } else if (startLocation === "storageDock2Camera") {
        packageId = warehouse.queueStorageDock2.items[packageIndex];
    } else if (startLocation === "storageDock3Camera") {
        packageId = warehouse.queueStorageDock3.items[packageIndex];
    } else if (startLocation === "storageDock4Camera") {
        packageId = warehouse.queueStorageDock4.items[packageIndex];
    } else if (startLocation === "receiveBufferCamera") {
        packageId = warehouse.queueReceiveBuffer.items[packageIndex];
    } else if (startLocation === "dispatchBufferCamera") {
        packageId = warehouse.queueDispatchBuffer.items[packageIndex];
    } else
        console.log("move() error: undefined start location");

    try {
        // move from last position to the reset position (in case the previous run of the program ended unexpectedly)
        console.log("doing goReset()");
        await go("", "reset");
        // move to the start location of the move task
        // NOTE: as the first part of this task relies on detection of the april tag, this movement is made relatively to the camera position
        if (startLocation === "storageDock1Camera") {
            console.log("doing goStorageDock1()");
            await go("reset", startLocation);
            suctionONx = config.storageDock1LocationCamera.x;
            suctionONy = config.storageDock1LocationCamera.y;
        } else if (startLocation === "storageDock2Camera") {
            console.log("doing goStorageDock2()");
            await go("reset", startLocation);
            suctionONx = config.storageDock2LocationCamera.x;
            suctionONy = config.storageDock2LocationCamera.y;
        } else if (startLocation === "storageDock3Camera") {
            console.log("doing goStorageDock3()");
            await go("reset", startLocation);
            suctionONx = config.storageDock3LocationCamera.x;
            suctionONy = config.storageDock3LocationCamera.y;
        } else if (startLocation === "storageDock4Camera") {
            console.log("doing goStorageDock4()");
            await go("reset", startLocation);
            suctionONx = config.storageDock4LocationCamera.x;
            suctionONy = config.storageDock4LocationCamera.y;
        } else if (startLocation === "receiveBufferCamera") {
            console.log("doing goReceiveBuffer()");
            await go("reset", startLocation);
            suctionONx = config.receiveBufferLocationCamera.x;
            suctionONy = config.receiveBufferLocationCamera.y;
        } else if (startLocation === "dispatchBufferCamera") {
            console.log("doing goDispatchBuffer()");
            await go("reset", startLocation);
            suctionONx = config.dispatchBufferLocationCamera.x;
            suctionONy = config.dispatchBufferLocationCamera.y;
        }

        console.log("doing suctionON()");
        // move down to the package and turn the suction ON
        // packageIndex is the index of the package in the start location dock
        await suctionON(packageIndex, suctionONx, suctionONy);

        let pack;
        // remove the package from the start location queue
        if (startLocation === "storageDock1Camera") {
            pack = warehouse.queueStorageDock1.items[warehouse.queueStorageDock1.topIndex];
            warehouse.queueStorageDock1.dequeue();
        }
        else if (startLocation === "storageDock2Camera") {
            pack = warehouse.queueStorageDock2.items[warehouse.queueStorageDock2.topIndex];
            warehouse.queueStorageDock2.dequeue();
        }
        else if (startLocation === "storageDock3Camera") {
            pack = warehouse.queueStorageDock3.items[warehouse.queueStorageDock3.topIndex];
            warehouse.queueStorageDock3.dequeue();
        }
        else if (startLocation === "storageDock4Camera") {
            pack = warehouse.queueStorageDock4.items[warehouse.queueStorageDock4.topIndex];
            warehouse.queueStorageDock4.dequeue();
        }
        else if (startLocation === "receiveBufferCamera") {
            pack = warehouse.queueReceiveBuffer.items[warehouse.queueReceiveBuffer.topIndex];
            warehouse.queueReceiveBuffer.dequeue();
        }
        else if (startLocation === "dispatchBufferCamera") {
            pack = warehouse.queueDispatchBuffer.items[warehouse.queueDispatchBuffer.topIndex];
            warehouse.queueDispatchBuffer.dequeue();
        }
        // print the state of the warehouse to the console and also save the data to the JSON file
        await warehouse.stateWarehouse();
        await warehouse.saveWarehouse();

        console.log("package id:" + packageId);

        // move to the new location on XY plane, move down and turn the suction OFF to release the package
        if (newLocation === "storageDock1") {
            console.log("doing goStorageDock1()");
            await go(startLocation, newLocation);
            suctionOFFx = config.storageDock1Location.x;
            suctionOFFy = config.storageDock1Location.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock1.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueStorageDock1.enqueue(pack);
        } else if (newLocation === "storageDock2") {
            console.log("doing goStorageDock2()");
            await go(startLocation, newLocation);
            suctionOFFx = config.storageDock2Location.x;
            suctionOFFy = config.storageDock2Location.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock2.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueStorageDock2.enqueue(pack);
        } else if (newLocation === "storageDock3") {
            console.log("doing goStorageDock3()");
            await go(startLocation, newLocation);
            suctionOFFx = config.storageDock3Location.x;
            suctionOFFy = config.storageDock3Location.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock3.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueStorageDock3.enqueue(pack);
        } else if (newLocation === "storageDock4") {
            console.log("doing goStorageDock4()");
            await go(startLocation, newLocation);
            suctionOFFx = config.storageDock4Location.x;
            suctionOFFy = config.storageDock4Location.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueStorageDock4.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueStorageDock4.enqueue(pack);
        } else if (newLocation === "receiveBuffer") {
            console.log("doing receiveBuffer()");
            await go(startLocation, newLocation);
            suctionOFFx = config.receiveBufferLocation.x;
            suctionOFFy = config.receiveBufferLocation.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueReceiveBuffer.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueReceiveBuffer.enqueue(pack);
        } else if (newLocation === "dispatchBuffer") {
            console.log("doing dispatchBuffer()");
            await go(startLocation, newLocation);
            suctionOFFx = config.dispatchBufferLocation.x;
            suctionOFFy = config.dispatchBufferLocation.y;
            console.log("doing suctionOFF()");
            await suctionOFF(warehouse.queueDispatchBuffer.topIndex + 1, suctionOFFx, suctionOFFy);
            warehouse.queueDispatchBuffer.enqueue(pack);
        }

        // print the state of the warehouse to the console and also save the data to the JSON file
        await warehouse.stateWarehouse();
        await warehouse.saveWarehouse();

        // move to the reset location
        console.log("doing goReset()");
        await go(newLocation, "reset");

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

// process tasks in the tasksQueue on FIFO principle
async function processTask(task) {
    // process the load task
    if (task.mode === "load") {
        console.log("task mode is load");
        // first check if the reception buffer is full
        if (warehouse.queueReceiveBuffer.getSize() === 4) {
            console.log("error, receive buffer is full, load task not performed");
            setBusy(false);
        }
        // receive buffer is not full, proceed with the load task
        else {
            console.log("calling the load() task...");
            let loadPromise = load(task.packageId, task.storageTimeLimit, warehouse.queueReceiveBuffer.topIndex + 1);
            loadPromise.then(
                (data) => {
                    console.log(data);
                    console.log("load task " + task.offerId + " successfully finished, calling control app /dispatchFinished");

                    // remove the task from the q
                    tasksQueue.shift();
                    console.log("tasks queue after load: " + JSON.stringify(tasksQueue));
                    // set the warehouse to not busy
                    setBusy(false);
                    // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                    // let axiosPromise = axios.get("http://" + config.controlAppUrl + "/dispatchFinished", {
                    //     params: {offerId: tasksQueue[0].offerId},
                    // });
                    // axiosPromise.then(
                    //     (data) => {
                    //         console.log(data);
                    //         console.log("/dispatchFinished successfully called, removing a task from the queue")
                    //         tasksQueue.shift();
                    //         console.log("tasks queue after load: " + JSON.stringify(tasksQueue));
                    //         setBusy(false);
                    //         // check if the reception buffer is too full and create a move task (or tasks)
                    //         checkReceiveBuffer();
                    //     },
                    //     (error) => {
                    //         console.log("error calling control app, task remains in the queue");
                    //         console.log(error);
                    //         setBusy(false);
                    //     }
                    // )
                },
                (error) => {
                    console.log("error while doing the LOAD task, task remains in the queue");
                    // if some error occurs, set the warehouse to not busy to enable the next task to be processed
                    setBusy(false);
                    console.log(error);
                }
            )
        }
        // process the unload task
    } else if (task.mode === "unload") {

        console.log("task mode is unload");
        let itemIndex;
        let packageFound = true;

        try {
            console.log("tasks queue:" + JSON.stringify(tasksQueue));
            // first check if the package is actually in the storage
            // check each of six docks where the package could potentially be stored
            if ((itemIndex = warehouse.queueStorageDock1.items.indexOf(task.packageId)) !== -1) {
                // package is in the storage dock 1
                console.log("package is in the storage dock 1");
                let currentTopPackageIndex = warehouse.queueStorageDock1.topIndex;
                console.log("packageId: " + task.packageId);

                // check if the package is at the top of the dock
                // if not, generate a move task(s) for packages that are above the package
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("storageDock1Camera", currentTopPackageIndex);
                    await move("storageDock1Camera", currentTopPackageIndex - 1);
                    await move("storageDock1Camera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("storageDock1Camera", currentTopPackageIndex);
                    await move("storageDock1Camera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("storageDock1Camera", currentTopPackageIndex);
                }
                await unload("storageDock1Camera", warehouse.queueStorageDock1.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else if ((itemIndex = warehouse.queueStorageDock2.items.indexOf(task.packageId)) !== -1) {
                // package is in the storage dock 2
                console.log("package is in the storage dock 2");
                let currentTopPackageIndex = warehouse.queueStorageDock2.topIndex;

                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("storageDock2Camera", currentTopPackageIndex);
                    await move("storageDock2Camera", currentTopPackageIndex - 1);
                    await move("storageDock2Camera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("storageDock2Camera", currentTopPackageIndex);
                    await move("storageDock2Camera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("storageDock2Camera", currentTopPackageIndex);
                }
                await unload("storageDock2Camera", warehouse.queueStorageDock2.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else if (warehouse.queueStorageDock3.items.indexOf(task.packageId) !== -1) {
                // package is in the storage dock 3
                console.log("package is in the storage dock 3");
                // console.log("packageId: " + task.packageId);
                // console.log("storageDock3 items: " + JSON.stringify(warehouse.queueStorageDock3.items));
                // let itemIndex = warehouse.queueStorageDock3.items.indexOf(task.packageId);
                // console.log("itemIndex:" + itemIndex);
                let currentTopPackageIndex = warehouse.queueStorageDock3.topIndex;
                console.log("currentTopPackageIndex:" + currentTopPackageIndex);
                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    console.log("move 3 packages");
                    await move("storageDock3Camera", currentTopPackageIndex);
                    await move("storageDock3Camera", currentTopPackageIndex - 1);
                    await move("storageDock3Camera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    console.log("move 2 packages");
                    await move("storageDock3Camera", currentTopPackageIndex);
                    await move("storageDock3Camera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    console.log("move 1 package");
                    await move("storageDock3Camera", currentTopPackageIndex);
                }
                await unload("storageDock3Camera", warehouse.queueStorageDock3.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else if ((itemIndex = warehouse.queueStorageDock4.items.indexOf(task.packageId)) !== -1) {
                // package is in the storage dock 4
                console.log("package is in the storage dock 4");
                console.log("packageId: " + itemIndex);
                let currentTopPackageIndex = warehouse.queueStorageDock4.topIndex;
                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("storageDock4Camera", currentTopPackageIndex);
                    await move("storageDock4Camera", currentTopPackageIndex - 1);
                    await move("storageDock4Camera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("storageDock4Camera", currentTopPackageIndex);
                    await move("storageDock4Camera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("storageDock4Camera", currentTopPackageIndex);
                }
                await unload("storageDock4Camera", warehouse.queueStorageDock4.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else if ((itemIndex = warehouse.queueReceiveBuffer.items.indexOf(task.packageId)) !== -1) {
                // package is in the reception buffer
                console.log("package is in the receive buffer");
                console.log("packageId: " + itemIndex);

                let currentTopPackageIndex = warehouse.queueReceiveBuffer.topIndex;
                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("receiveBufferCamera", currentTopPackageIndex);
                    await move("receiveBufferCamera", currentTopPackageIndex - 1);
                    await move("receiveBufferCamera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("receiveBufferCamera", currentTopPackageIndex);
                    await move("receiveBufferCamera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("receiveBufferCamera", currentTopPackageIndex);
                }
                await unload("receiveBufferCamera", warehouse.queueReceiveBuffer.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else if ((itemIndex = warehouse.queueDispatchBuffer.items.indexOf(task.packageId)) !== -1) {
                // package is in the dispatch buffer
                console.log("package is in the dispatch buffer");
                console.log("packageId: " + itemIndex);

                let currentTopPackageIndex = warehouse.queueDispatchBuffer.topIndex;
                // check if the package is at the top of the dock
                if ((currentTopPackageIndex - itemIndex) === 3) {
                    // move 3 packages
                    await move("dispatchBufferCamera", currentTopPackageIndex);
                    await move("dispatchBufferCamera", currentTopPackageIndex - 1);
                    await move("dispatchBufferCamera", currentTopPackageIndex - 2);
                } else if ((currentTopPackageIndex - itemIndex) === 2) {
                    // move 2 packages
                    await move("dispatchBufferCamera", currentTopPackageIndex);
                    await move("dispatchBufferCamera", currentTopPackageIndex - 1);
                } else if ((currentTopPackageIndex - itemIndex) === 1) {
                    // move 1 package
                    await move("dispatchBufferCamera", currentTopPackageIndex);

                }
                await unload("dispatchBufferCamera", warehouse.queueDispatchBuffer.topIndex);

                // send HTTP GET to the robot cars control app /dispatchFinished API endpoint
                // await axios.get(config.controlAppUrl + "/dispatchFinished", {
                //     params: {offerId: tasksQueue[0].offerId}
                // });

            } else {
                packageFound = false;
                console.log("error, the package is not in the warehouse")
                // if the package is not in the warehouse, remove the task from the queue and set the warehouse to not busy to enable the next task to be processed
                tasksQueue.shift();
                setBusy(false);
            }

            if (!packageFound) {
                console.log("the unload task successfully finished, removing the task from the queue")
                // remove the task from the queue
                tasksQueue.shift();
                console.log("tasks queue after unload: " + JSON.stringify(tasksQueue));
                // set the warehouse state to not busy
                setBusy(false);
            }

        } catch (error) {
            console.log("error while doing the UNLOAD task, task remains in the queue");
            console.log(error);
            // if some error occurred, set the warehouse to not busy to enable the next task to be processed
            setBusy(false);
        }
        // process the move task
    } else if (task.mode === "move") {

        let promiseMove = move(task.packageDock, task.dockPosition)
        promiseMove.then(() => {
            console.log("the move task successfully finished, removing the task from the queue")
            // remove the task from the queue and set the warehouse state to not busy
            tasksQueue.shift();
            console.log("tasks queue after move: " + JSON.stringify(tasksQueue));
            setBusy(false);

        }, (error) => {
            console.log("error while doing the move task, task remains in the queue");
            // set the warehouse state to not busy
            setBusy(false);
            console.log(error);
        })
    }
}

// check if receive buffer is too full and generate move task
// packages are moved if more than a pre-specified number of packages are currently in the queue
function checkReceiveBuffer() {

    let receiveCounter = 0;
    console.log("checking receive buffer  ...");
    // console.log(warehouse);
    let i;
    for (i = warehouse.queueReceiveBuffer.getSize(); i > config.maxReceiveBufferSizeForMove; i--) {

        // check if a task with this packageId and packageDock === receiveBuffer and dockPosition === (i-1)
        //      is already in the queue
        if (tasksQueue.find(task => task.packageId === warehouse.queueReceiveBuffer.items[i - 1].packageId &&
            task.packageDock === "receiveBufferCamera" &&
            task.dockPosition === (i - 1)) !== undefined) {
            console.log("a move task for this packageId is already in the queue");
        } else {
            // create a request object for package in position 3 (index === 2) and add it to the queue
            console.log(warehouse.queueReceiveBuffer.items[i - 1]);
            let reqObject = {}
            reqObject.offerId = "internal-move";
            reqObject.packageId = warehouse.queueReceiveBuffer.items[i - 1].packageId;
            reqObject.packageDock = "receiveBufferCamera";
            reqObject.dockPosition = i - 1;
            reqObject.mode = "move";
            tasksQueue.push(reqObject);
            receiveCounter++;
        }
    }
    console.log("there are no packages to move from receive buffer");

    if (receiveCounter !== 0) {
        console.log(receiveCounter + " moves from receiveBuffer added to the tasksQueue");
    }
}

// check if receive buffer is too full and generate a move task
// packages are moved if more than a pre-specified number of packages are currently in the queue
function checkDispatchBuffer() {

    let dispatchCounter = 0;
    let i;
    for (i = warehouse.queueDispatchBuffer.getSize(); i > config.maxDispatchBufferSizeForMove; i--) {
        // check if a task with this packageId and packageDock === dispatchBuffer and dockPosition === (i-1)
        //      is already in the queue
        if (tasksQueue.find(task => task.packageId === warehouse.queueDispatchBuffer.items[i - 1].packageId &&
            task.packageDock === "receiveBuffer" &&
            task.dockPosition === (i - 1)) !== undefined) {

            console.log("a move task for this packageId is already in the queue");
        } else {
            // create a request object for package in position 3 (index === 2) and add it to the queue
            let reqObject = {}
            reqObject.offerId = "internal-move";
            reqObject.packageId = warehouse.queueDispatchBuffer.items[i - 1].packageId;
            reqObject.packageDock = "dispatchBufferCamera";
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

// check if any of the package's storage time limit has expired
// if yes, generate a request and send it to the car control application
function checkPackages() {

    console.log("checking packages' storage time limits  ...");
    // console.log(warehouse);

    let currentTime = Date.now();
    let packageId = -1;
    let sourceLocation = 5; // current location = master warehouse
    let targetLocation = 5; // master warehouse location
    let offerId = -999;

    for (let i = 0; i < warehouse.queueStorageDock1.items.length; i ++ ) {
        if (warehouse.queueStorageDock1.items[i].storageTimeLimit + 5*60*1000 > currentTime) {
            console.log("storage time limit for package " + warehouse.queueStorageDock1.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueStorageDock1.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }
    for (let i = 0; i < warehouse.queueStorageDock2.items.length; i ++ ) {
        if (warehouse.queueStorageDock2.items[i].storageTimeLimit + 5*60*1000 < currentTime) {
            console.log("storage time limit for package " + warehouse.queueStorageDock2.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueStorageDock2.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }
    for (let i = 0; i < warehouse.queueStorageDock3.items.length; i ++ ) {
        if (warehouse.queueStorageDock3.items[i].storageTimeLimit + 5*60*1000 < currentTime) {
            console.log("storage time limit for package " + warehouse.queueStorageDock3.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueStorageDock3.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }
    for (let i = 0; i < warehouse.queueStorageDock4.items.length; i ++ ) {
        if (warehouse.queueStorageDock4.items[i].storageTimeLimit + 5*60*1000 < currentTime) {
            console.log("storage time limit for package " + warehouse.queueStorageDock4.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueStorageDock4.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }
    for (let i = 0; i < warehouse.queueReceiveBuffer.items.length; i ++ ) {
        if (warehouse.queueReceiveBuffer.items[i].storageTimeLimit + 5*60*1000 < currentTime) {
            console.log("storage time limit for package " + warehouse.queueReceiveBuffer.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueReceiveBuffer.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }
    for (let i = 0; i < warehouse.queueDispatchBuffer.items.length; i ++ ) {
        if (warehouse.queueDispatchBuffer.items[i].storageTimeLimit + 5*60*1000 < currentTime) {
            console.log("storage time limit for package " + warehouse.queueDispatchBuffer.items[i].packageId + " has expired. The package will be removed from the warehouse.");
            packageId = warehouse.queueDispatchBuffer.items[i].packageId;

            // send HTTP GET to the robot cars control app /request API endpoint
            let axiosPromise = axios.get("http://" + config.controlAppUrl + "/request", {
                params: {packageId: packageId, offerId: offerId, source: sourceLocation, target: targetLocation},
            });
            axiosPromise.then(
                (data) => {
                    console.log(data);
                    console.log("/request successfully called")
                },
                (error) => {
                    console.log("error calling control app");
                    console.log(error);
                }
            )
        }
    }

    if(packageId !== -1) {


    }
}

export {
    processTask,
    checkReceiveBuffer,
    checkDispatchBuffer,
    checkPackages
}