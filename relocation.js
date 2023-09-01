
import {warehouse} from "./index.js";

// find the best location for a package move from the reception buffer
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

    // CURRENT STRATEGY: select a dock with a minimum number of packages
    // TODO: other parameters to consider:
    // - package current location
    // - package processing time
    // - package unload deadline time
    // - anything else?


    let min = (a, f) => a.reduce((m, x) => m[f] < x[f] ? m : x);
    newLocation = min(queuesReduced, "topIndex")["location"];

    return newLocation;
}

export {
    findNewLocation
}