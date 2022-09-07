import {createRequire} from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
let Promise = require("es6-promise").Promise;

const jetmaxUbuntuServerIpAddress = "localhost:3000";

//QUEUES
import {
    QueueA,
    QueueB,
    QueueC,
    QueueD,
    QueueE,
    QueueF,
    QueueG,
    QueueH,
    QueueRobot,
} from "./queuelifo.js";

const queueStorageDock1 = new QueueA();
const queueStorageDock2 = new QueueB();
const queueReceiveBuffer = new QueueC();
const queueReceiveDock = new QueueD();
const queueStorageDock4 = new QueueE();
const queueStorageDock3 = new QueueF();
const queueDispatchBuffer = new QueueG();
const queueDispatchDock = new QueueH();
const queueRobot = new QueueRobot();

//Warehouse
import {saveWarehouse, stateWarehouse} from "./warehouse.js";

let localisation = 0;

// MOTION FUNCTIONS

//GO Reset
async function goReset() {
    localisation = 0;
    let X = 0;
    let Y = -162.94;
    let Z = 212.8;
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO A
async function goStorageD1() {
    localisation = 1;
    let X = -115;
    let Y = 70;
    let Z = 215;
    if (queueStorageDock1.topIndexA === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("STORAGE DOCK 1 IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO B
async function goStorageD2() {
    localisation = 2;
    let X = -115;
    let Y = -20;
    let Z = 215;
    if (queueStorageDock2.topIndexB === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("STORAGE DOCK 2 IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO F
async function goStorageD3() {
    localisation = 6;
    let X = 115;
    let Y = -20;
    let Z = 215;
    if (queueStorageDock3.topIndexF === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("STORAGE DOCK 3 IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO E
async function goStorageD4() {
    localisation = 5;
    let X = 115;
    let Y = 65;
    let Z = 215;
    if (queueStorageDock4.topIndexE === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("STORAGE DOCK 4 IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO C
async function goReceiveBuffer() {
    localisation = 3;
    let X = -125;
    let Y = -110;
    let Z = 215;
    if (queueReceiveBuffer.topIndexC === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("RECEIVE BUFFER IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO G
async function goDispatchBuffer() {
    localisation = 7;
    let X = 125;
    let Y = -110;
    let Z = 215;
    if (queueDispatchBuffer.topIndexG === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("DISPATCH BUFFER IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO D
async function goReceiveDock() {
    localisation = 4;
    let X = -125; //TODO
    let Y = -200; //TODO
    let Z = 215; //TODO
    if (queueReceiveDock.topIndexD === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("RECEIVE DOCK IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//GO H
async function goDispatchDock() {
    localisation = 8;
    let X = 125; //TODO
    let Y = -200; //TODO
    let Z = 215; //TODO
    if (queueDispatchDock.topIndexH === 4 && queueRobot.topIndexR === 1) {
        await saveWarehouse();
        await suctionOFF();
        await goReset();
        throw new Error("DISPATCH DOCK IS FULL! TASK ABORTED");
    }
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/moveTo", {
        params: {msg: {x: X, y: Y, z: Z}},
    });
    await saveWarehouse();
    await stateWarehouse();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

//SUCTION ON
async function suctionON() {
    await goDown();
    if (queueReceiveBuffer.topIndexC === 4 && localisation === 4) {
        await saveWarehouse();
        await goReset();
        throw new Error("RECEIVE BUFFER IS FULL! TASK ABORTED");
    }
    if (
        queueStorageDock1.topIndexA === 4 &&
        queueStorageDock2.topIndexB === 4 &&
        queueStorageDock3.topIndexE === 4 &&
        queueStorageDock4.topIndexF === 4 &&
        localisation === 3
    ) {
        await saveWarehouse();
        await goReset();
        throw new Error("STORAGE IS FULL! TASK ABORTED");
    }
    if (queueDispatchDock.topIndexH === 4 && localisation === 7) {
        await saveWarehouse();
        await goReset();
        throw new Error("DISPATCH DOCK IS FULL! TASK ABORTED");
    }
    // await ReadSaveWarehouse();
    await goGrab();
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
        params: {msg: {data: true}},
    });
    if (queueRobot.topIndexR === 1) {
        await saveWarehouse();
        throw new Error("The JetMaxRobot already has an item");
    } else {
        if (localisation === 1 && queueRobot.topIndexR === 0) {
            if (queueStorageDock1.topIndexA === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goStorageD1();
            queueRobot.enqueue(queueStorageDock1.dequeue());
        }
        if (localisation === 2 && queueRobot.topIndexR === 0) {
            if (queueStorageDock2.topIndexB === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goStorageD2();
            queueRobot.enqueue(queueStorageDock2.dequeue());
        }
        if (localisation === 3 && queueRobot.topIndexR === 0) {
            if (queueReceiveBuffer.topIndexC === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goReceiveBuffer();
            queueRobot.enqueue(queueReceiveBuffer.dequeue());
        }
        if (localisation === 4 && queueRobot.topIndexR === 0) {
            if (queueReceiveDock.topIndexD === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goReceiveDock();
            queueRobot.enqueue(queueReceiveDock.dequeue());
        }
        if (localisation === 5 && queueRobot.topIndexR === 0) {
            if (queueStorageDock4.topIndexE === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goStorageD4();
            queueRobot.enqueue(queueStorageDock4.dequeue());
        }
        if (localisation === 6 && queueRobot.topIndexR === 0) {
            if (queueStorageDock3.topIndexF === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goStorageD3();
            queueRobot.enqueue(queueStorageDock3.dequeue());
        }
        if (localisation === 7 && queueRobot.topIndexR === 0) {
            if (queueDispatchBuffer.topIndexG === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goDispatchBuffer();
            queueRobot.enqueue(queueDispatchBuffer.dequeue());
        }
        if (localisation === 8 && queueRobot.topIndexR === 0) {
            if (queueDispatchDock.topIndexH === 0) {
                await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
                    params: {msg: {data: false}},
                });
                await saveWarehouse();
                throw new Error("There is no item here");
            }
            await goDispatchDock();
            queueRobot.enqueue(queueDispatchDock.dequeue());
        }
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    }
}

//SUCTION OFF
async function suctionOFF() {
    await goDown();
    // await ReadSaveWarehouse();

    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/suction", {
        params: {msg: {data: false}},
    });
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
        params: {msg: {x: 0, y: 0, z: 50}},
    });
    if (queueRobot.topIndexR === 0) {
        await saveWarehouse();
        await goReset();
        throw new Error("There is no item in the robot");
    } else {
        if (localisation === 0 && queueRobot.topIndexR === 1) {
            queueRobot.dequeue();
        }
        if (localisation === 1 && queueRobot.topIndexR === 1) {
            await goStorageD1();
            queueStorageDock1.enqueue(queueRobot.dequeue());
        }
        if (localisation === 2 && queueRobot.topIndexR === 1) {
            await goStorageD2();
            queueStorageDock2.enqueue(queueRobot.dequeue());
        }
        if (localisation === 3 && queueRobot.topIndexR === 1) {
            await goReceiveBuffer();
            queueReceiveBuffer.enqueue(queueRobot.dequeue());
        }
        if (localisation === 4 && queueRobot.topIndexR === 1) {
            await goReceiveDock();
            queueReceiveDock.enqueue(queueRobot.dequeue());
        }
        if (localisation === 5 && queueRobot.topIndexR === 1) {
            await goStorageD4();
            queueStorageDock4.enqueue(queueRobot.dequeue());
        }
        if (localisation === 6 && queueRobot.topIndexR === 1) {
            await goStorageD3();
            queueStorageDock3.enqueue(queueRobot.dequeue());
        }
        if (localisation === 7 && queueRobot.topIndexR === 1) {
            await goDispatchBuffer();
            queueDispatchBuffer.enqueue(queueRobot.dequeue());
        }
        if (localisation === 8 && queueRobot.topIndexR === 1) {
            await goDispatchDock();
            queueDispatchDock.enqueue(queueRobot.dequeue());
        }
        await saveWarehouse();
        await stateWarehouse();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, 1000);
        });
    }
}

function getLocation() {
    console.log(localisation);
}

//GO DOWN
async function goDown() {
    // getLocation();
    // queueRobot.topIndexR;
    // queueStorageDock1.topIndexA;
    // queueStorageDock2.topIndexB;
    // queueStorageDock3.topIndexF;
    // queueStorageDock4.topIndexE;
    // queueReceiveBuffer.topIndexC;
    // queueDispatchBuffer.topIndexG;
    // queueDispatchDock.topIndexH;
    // A
    if (
        (localisation === 1 && queueStorageDock1.topIndexA === 0) ||
        (localisation === 2 && queueStorageDock2.topIndexB === 0) ||
        (localisation === 3 && queueReceiveBuffer.topIndexC === 0) ||
        (localisation === 4 && queueReceiveDock.topIndexD === 0) ||
        (localisation === 5 && queueStorageDock4.topIndexE === 0) ||
        (localisation === 6 && queueStorageDock3.topIndexF === 0) ||
        (localisation === 7 && queueDispatchBuffer.topIndexG === 0) ||
        (localisation === 8 && queueDispatchDock.topIndexH === 0)
    ) {
        await moveDown(1);
    }
    if (
        (localisation === 1 && queueStorageDock1.topIndexA === 1) ||
        (localisation === 2 && queueStorageDock2.topIndexB === 1) ||
        (localisation === 3 && queueReceiveBuffer.topIndexC === 1) ||
        (localisation === 4 && queueReceiveDock.topIndexD === 1) ||
        (localisation === 5 && queueStorageDock4.topIndexE === 1) ||
        (localisation === 6 && queueStorageDock3.topIndexF === 1) ||
        (localisation === 7 && queueDispatchBuffer.topIndexG === 1) ||
        (localisation === 8 && queueDispatchDock.topIndexH === 1)
    ) {
        await moveDown(1);
    }
    if (
        (localisation === 1 && queueStorageDock1.topIndexA === 2) ||
        (localisation === 2 && queueStorageDock2.topIndexB === 2) ||
        (localisation === 3 && queueReceiveBuffer.topIndexC === 2) ||
        (localisation === 4 && queueReceiveDock.topIndexD === 2) ||
        (localisation === 5 && queueStorageDock4.topIndexE === 2) ||
        (localisation === 6 && queueStorageDock3.topIndexF === 2) ||
        (localisation === 7 && queueDispatchBuffer.topIndexG === 2) ||
        (localisation === 8 && queueDispatchDock.topIndexH === 2)
    ) {
        await moveDown(2);
    }
    if (
        (localisation === 1 && queueStorageDock1.topIndexA === 3) ||
        (localisation === 2 && queueStorageDock2.topIndexB === 3) ||
        (localisation === 3 && queueReceiveBuffer.topIndexC === 3) ||
        (localisation === 4 && queueReceiveDock.topIndexD === 3) ||
        (localisation === 5 && queueStorageDock4.topIndexE === 3) ||
        (localisation === 6 && queueStorageDock3.topIndexF === 3) ||
        (localisation === 7 && queueDispatchBuffer.topIndexG === 3) ||
        (localisation === 8 && queueDispatchDock.topIndexH === 3)
    ) {
        await moveDown(3);
    }
    if (
        (localisation === 1 && queueStorageDock1.topIndexA === 4) ||
        (localisation === 2 && queueStorageDock2.topIndexB === 4) ||
        (localisation === 3 && queueReceiveBuffer.topIndexC === 4) ||
        (localisation === 4 && queueReceiveDock.topIndexD === 4) ||
        (localisation === 5 && queueStorageDock4.topIndexE === 4) ||
        (localisation === 6 && queueStorageDock3.topIndexF === 4) ||
        (localisation === 7 && queueDispatchBuffer.topIndexG === 4) ||
        (localisation === 8 && queueDispatchDock.topIndexH === 4)
    ) {
        await moveDown(4);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

// MOVE DOWN
async function moveDown(index) {

    let z = 0;
    if (index === 1)
        z = -133;
    else if (index === 2)
        z = -126;
    else if (index === 3)
        z = -116;
    else if (index === 4)
        z = -106;

    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
        params: {msg: {x: 0, y: 0, z: this.z}},
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

async function goGrab() {
    await axios.get("http://" + jetmaxUbuntuServerIpAddress + "/basic/move", {
        params: {msg: {x: 0, y: 0, z: -20}},
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 1000);
    });
}

export {
    goDown,
    getLocation,
    goReset,
    goStorageD1,
    goStorageD2,
    goStorageD3,
    goStorageD4,
    goDispatchBuffer,
    goDispatchDock,
    goReceiveBuffer,
    goReceiveDock,
    suctionOFF,
    suctionON,
    localisation,
    queueDispatchBuffer,
    queueDispatchDock,
    queueReceiveBuffer,
    queueReceiveDock,
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
    queueRobot,
    QueueA,
    QueueB,
    QueueC,
    QueueD,
    QueueE,
    QueueF,
    QueueG,
    QueueH,
    QueueRobot,
};
