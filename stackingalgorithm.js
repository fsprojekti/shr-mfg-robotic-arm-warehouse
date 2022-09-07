import {createRequire} from "module";

const require = createRequire(import.meta.url);
let Promise = require("es6-promise").Promise;

import {
    goStorageD1,
    goStorageD2,
    goStorageD3,
    goStorageD4,
    localisation,
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
} from "./robotmotion.js";

//Travel Time optimisation & Storage optimisation
function goStorage() {
    if (localisation < 5) {
        if (queueStorageDock2.topIndexB < 4 && localisation !== 2) {
            goStorageD2();
        } else if (queueStorageDock1.topIndexA < 4 && localisation !== 1) {
            goStorageD1();
        } else if (queueStorageDock3.topIndexE < 4 && localisation !== 6) {
            goStorageD3();
        } else if (queueStorageDock4.topIndexE < 4 && localisation !== 5) {
            goStorageD4();
        }
    }
    if (localisation > 4) {
        if (queueStorageDock3.topIndexF < 4 && localisation !== 6) {
            goStorageD3();
        } else if (queueStorageDock4.topIndexE < 4 && localisation !== 5) {
            goStorageD4();
        } else if (queueStorageDock2.topIndexB < 4 && localisation !== 2) {
            goStorageD2();
        } else if (queueStorageDock1.topIndexA < 4 && localisation !== 1) {
            goStorageD1();
        }
    }
    if (
        queueStorageDock1.topIndexA === 4 &&
        queueStorageDock2.topIndexB === 4 &&
        queueStorageDock3.topIndexF === 4 &&
        queueStorageDock4.topIndexE === 4
    ) {
        throw new Error("All storages are full");
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 5000);
    });
}

export {goStorage};
