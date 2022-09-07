import {createRequire} from "module";

const require = createRequire(import.meta.url);
const fs = require("fs");

import {
    queueDispatchBuffer,
    queueDispatchDock,
    queueReceiveBuffer,
    queueReceiveDock,
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
    queueRobot,
} from "./robotmotion.js";

function stateWarehouse() {
    if (queueStorageDock1.topIndexA !== 0) {
        console.log(queueStorageDock1);
    }
    if (queueStorageDock2.topIndexB !== 0) {
        console.log(queueStorageDock2);
    }
    if (queueStorageDock3.topIndexF !== 0) {
        console.log(queueStorageDock3);
    }
    if (queueStorageDock4.topIndexE !== 0) {
        console.log(queueStorageDock4);
    }
    if (queueReceiveBuffer.topIndexC !== 0) {
        console.log(queueReceiveBuffer);
    }
    if (queueReceiveDock.topIndexD !== 0) {
        console.log(queueReceiveDock);
    }
    if (queueDispatchBuffer.topIndexG !== 0) {
        console.log(queueDispatchBuffer);
    }
    if (queueDispatchDock.topIndexH !== 0) {
        console.log(queueDispatchDock);
    }
    if (queueRobot.topIndexR !== 0) {
        console.log(queueRobot);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 250);
    });
}

function resetWarehouse() {
    const warehouse = require("./warehouse.json");
    queueRobot.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock1.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock2.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock3.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueStorageDock4.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchBuffer.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueDispatchDock.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveBuffer.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
    queueReceiveDock.dequeue();
    // }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 100);
    });
}

function readWarehouse() {
    const warehouse = require("./warehouse.json");
    let read = {
        Robot: {
            itemID1: queueRobot.items[0],
        },
        StorageDock1: {
            itemID1: queueStorageDock1.items[0],
            itemID2: queueStorageDock1.items[1],
            itemID3: queueStorageDock1.items[2],
            itemID4: queueStorageDock1.items[3],
        },
        StorageDock2: {
            itemID1: queueStorageDock2.items[0],
            itemID2: queueStorageDock2.items[1],
            itemID3: queueStorageDock2.items[2],
            itemID4: queueStorageDock2.items[3],
        },
        StorageDock3: {
            itemID1: queueStorageDock3.items[0],
            itemID2: queueStorageDock3.items[1],
            itemID3: queueStorageDock3.items[2],
            itemID4: queueStorageDock3.items[3],
        },
        StorageDock4: {
            itemID1: queueStorageDock4.items[0],
            itemID2: queueStorageDock4.items[1],
            itemID3: queueStorageDock4.items[2],
            itemID4: queueStorageDock4.items[3],
        },
        DispatchBuffer: {
            itemID1: queueDispatchBuffer.items[0],
            itemID2: queueDispatchBuffer.items[1],
            itemID3: queueDispatchBuffer.items[2],
            itemID4: queueDispatchBuffer.items[3],
        },
        DispatchDock: {
            itemID1: queueDispatchDock.items[0],
            itemID2: queueDispatchDock.items[1],
            itemID3: queueDispatchDock.items[2],
            itemID4: queueDispatchDock.items[3],
        },
        ReceiveBuffer: {
            itemID1: queueReceiveBuffer.items[0],
            itemID2: queueReceiveBuffer.items[1],
            itemID3: queueReceiveBuffer.items[2],
            itemID4: queueReceiveBuffer.items[3],
        },
        ReceiveDock: {
            itemID1: queueReceiveDock.items[0],
            itemID2: queueReceiveDock.items[1],
            itemID3: queueReceiveDock.items[2],
            itemID4: queueReceiveDock.items[3],
        },
    };
    if (warehouse.Robot.itemID1 !== undefined) {
        queueRobot.enqueue(warehouse.Robot.itemID1);
    }
    if (warehouse.StorageDock1.itemID1 !== undefined) {
        queueStorageDock1.enqueue(warehouse.StorageDock1.itemID1);
    }
    if (warehouse.StorageDock1.itemID2 !== undefined) {
        queueStorageDock1.enqueue(warehouse.StorageDock1.itemID2);
    }
    if (warehouse.StorageDock1.itemID3 !== undefined) {
        queueStorageDock1.enqueue(warehouse.StorageDock1.itemID3);
    }
    if (warehouse.StorageDock1.itemID4 !== undefined) {
        queueStorageDock1.enqueue(warehouse.StorageDock1.itemID4);
    }
    if (warehouse.StorageDock2.itemID1 !== undefined) {
        queueStorageDock2.enqueue(warehouse.StorageDock2.itemID1);
    }
    if (warehouse.StorageDock2.itemID2 !== undefined) {
        queueStorageDock2.enqueue(warehouse.StorageDock2.itemID2);
    }
    if (warehouse.StorageDock2.itemID3 !== undefined) {
        queueStorageDock2.enqueue(warehouse.StorageDock2.itemID3);
    }
    if (warehouse.StorageDock2.itemID4 !== undefined) {
        queueStorageDock2.enqueue(warehouse.StorageDock2.itemID4);
    }
    if (warehouse.StorageDock3.itemID1 !== undefined) {
        queueStorageDock3.enqueue(warehouse.StorageDock3.itemID1);
    }
    if (warehouse.StorageDock3.itemID2 !== undefined) {
        queueStorageDock3.enqueue(warehouse.StorageDock3.itemID2);
    }
    if (warehouse.StorageDock3.itemID3 !== undefined) {
        queueStorageDock3.enqueue(warehouse.StorageDock3.itemID3);
    }
    if (warehouse.StorageDock3.itemID4 !== undefined) {
        queueStorageDock3.enqueue(warehouse.StorageDock3.itemID4);
    }
    if (warehouse.StorageDock4.itemID1 !== undefined) {
        queueStorageDock4.enqueue(warehouse.StorageDock4.itemID1);
    }
    if (warehouse.StorageDock4.itemID2 !== undefined) {
        queueStorageDock4.enqueue(warehouse.StorageDock4.itemID2);
    }
    if (warehouse.StorageDock4.itemID3 !== undefined) {
        queueStorageDock4.enqueue(warehouse.StorageDock4.itemID3);
    }
    if (warehouse.StorageDock4.itemID4 !== undefined) {
        queueStorageDock4.enqueue(warehouse.StorageDock4.itemID4);
    }
    if (warehouse.DispatchBuffer.itemID1 !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.DispatchBuffer.itemID1);
    }
    if (warehouse.DispatchBuffer.itemID2 !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.DispatchBuffer.itemID2);
    }
    if (warehouse.DispatchBuffer.itemID3 !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.DispatchBuffer.itemID3);
    }
    if (warehouse.DispatchBuffer.itemID4 !== undefined) {
        queueDispatchBuffer.enqueue(warehouse.DispatchBuffer.itemID4);
    }
    if (warehouse.DispatchDock.itemID1 !== undefined) {
        queueDispatchDock.enqueue(warehouse.DispatchDock.itemID1);
    }
    if (warehouse.DispatchDock.itemID2 !== undefined) {
        queueDispatchDock.enqueue(warehouse.DispatchDock.itemID2);
    }
    if (warehouse.DispatchDock.itemID3 !== undefined) {
        queueDispatchDock.enqueue(warehouse.DispatchDock.itemID3);
    }
    if (warehouse.DispatchDock.itemID4 !== undefined) {
        queueDispatchDock.enqueue(warehouse.DispatchDock.itemID4);
    }
    if (warehouse.ReceiveBuffer.itemID1 !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.ReceiveBuffer.itemID1);
    }
    if (warehouse.ReceiveBuffer.itemID2 !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.ReceiveBuffer.itemID2);
    }
    if (warehouse.ReceiveBuffer.itemID3 !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.ReceiveBuffer.itemID3);
    }
    if (warehouse.ReceiveBuffer.itemID4 !== undefined) {
        queueReceiveBuffer.enqueue(warehouse.ReceiveBuffer.itemID4);
    }
    if (warehouse.ReceiveDock.itemID1 !== undefined) {
        queueReceiveDock.enqueue(warehouse.ReceiveDock.itemID1);
    }
    if (warehouse.ReceiveDock.itemID2 !== undefined) {
        queueReceiveDock.enqueue(warehouse.ReceiveDock.itemID2);
    }
    if (warehouse.ReceiveDock.itemID3 !== undefined) {
        queueReceiveDock.enqueue(warehouse.ReceiveDock.itemID3);
    }
    if (warehouse.ReceiveDock.itemID4 !== undefined) {
        queueReceiveDock.enqueue(warehouse.ReceiveDock.itemID4);
    }
    fs.writeFile("warehouse.json", JSON.stringify(read), function (erreur) {
        if (erreur) {
            console.log(erreur);
        }
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            // resolve("resolved");
            resolve(read);
        }, 100);
    });
}

function saveWarehouse() {
    const warehouse = require("./warehouse.json");

    let save = {
        Robot: {
            itemID1: queueRobot.items[0],
        },
        StorageDock1: {
            itemID1: queueStorageDock1.items[0],
            itemID2: queueStorageDock1.items[1],
            itemID3: queueStorageDock1.items[2],
            itemID4: queueStorageDock1.items[3],
        },
        StorageDock2: {
            itemID1: queueStorageDock2.items[0],
            itemID2: queueStorageDock2.items[1],
            itemID3: queueStorageDock2.items[2],
            itemID4: queueStorageDock2.items[3],
        },
        StorageDock3: {
            itemID1: queueStorageDock3.items[0],
            itemID2: queueStorageDock3.items[1],
            itemID3: queueStorageDock3.items[2],
            itemID4: queueStorageDock3.items[3],
        },
        StorageDock4: {
            itemID1: queueStorageDock4.items[0],
            itemID2: queueStorageDock4.items[1],
            itemID3: queueStorageDock4.items[2],
            itemID4: queueStorageDock4.items[3],
        },
        DispatchBuffer: {
            itemID1: queueDispatchBuffer.items[0],
            itemID2: queueDispatchBuffer.items[1],
            itemID3: queueDispatchBuffer.items[2],
            itemID4: queueDispatchBuffer.items[3],
        },
        DispatchDock: {
            itemID1: queueDispatchDock.items[0],
            itemID2: queueDispatchDock.items[1],
            itemID3: queueDispatchDock.items[2],
            itemID4: queueDispatchDock.items[3],
        },
        ReceiveBuffer: {
            itemID1: queueReceiveBuffer.items[0],
            itemID2: queueReceiveBuffer.items[1],
            itemID3: queueReceiveBuffer.items[2],
            itemID4: queueReceiveBuffer.items[3],
        },
        ReceiveDock: {
            itemID1: queueReceiveDock.items[0],
            itemID2: queueReceiveDock.items[1],
            itemID3: queueReceiveDock.items[2],
            itemID4: queueReceiveDock.items[3],
        },
    };
    //ROBOT
    if (queueRobot.items[0] !== undefined) {
        warehouse.Robot.itemID1 = queueRobot.items[0];
    }
    //STORAGE 1
    if (queueStorageDock1.items[0] !== undefined) {
        warehouse.StorageDock1.itemID1 = queueStorageDock1.items[0];
    }
    if (queueStorageDock1.items[1] !== undefined) {
        warehouse.StorageDock1.itemID1 = queueStorageDock1.items[1];
    }
    if (queueStorageDock1.items[2] !== undefined) {
        warehouse.StorageDock1.itemID1 = queueStorageDock1.items[2];
    }
    if (queueStorageDock1.items[3] !== undefined) {
        warehouse.StorageDock1.itemID1 = queueStorageDock1.items[3];
    }
    //STORAGE 2
    if (queueStorageDock2.items[0] !== undefined) {
        warehouse.StorageDock2.itemID1 = queueStorageDock2.items[0];
    }
    if (queueStorageDock2.items[1] !== undefined) {
        warehouse.StorageDock2.itemID1 = queueStorageDock2.items[1];
    }
    if (queueStorageDock2.items[2] !== undefined) {
        warehouse.StorageDock2.itemID1 = queueStorageDock2.items[2];
    }
    if (queueStorageDock2.items[3] !== undefined) {
        warehouse.StorageDock2.itemID1 = queueStorageDock2.items[3];
    }
    //STORAGE 3
    if (queueStorageDock3.items[0] !== undefined) {
        warehouse.StorageDock3.itemID1 = queueStorageDock3.items[0];
    }
    if (queueStorageDock3.items[1] !== undefined) {
        warehouse.StorageDock3.itemID1 = queueStorageDock3.items[1];
    }
    if (queueStorageDock3.items[2] !== undefined) {
        warehouse.StorageDock3.itemID1 = queueStorageDock3.items[2];
    }
    if (queueStorageDock3.items[3] !== undefined) {
        warehouse.StorageDock3.itemID1 = queueStorageDock3.items[3];
    }
    //STORAGE 4
    if (queueStorageDock4.items[0] !== undefined) {
        warehouse.StorageDock4.itemID1 = queueStorageDock4.items[0];
    }
    if (queueStorageDock4.items[1] !== undefined) {
        warehouse.StorageDock4.itemID1 = queueStorageDock4.items[1];
    }
    if (queueStorageDock4.items[2] !== undefined) {
        warehouse.StorageDock4.itemID1 = queueStorageDock4.items[2];
    }
    if (queueStorageDock4.items[3] !== undefined) {
        warehouse.StorageDock4.itemID1 = queueStorageDock4.items[3];
    }
    //RECEIVE BUFFER
    if (queueReceiveBuffer.items[0] !== undefined) {
        warehouse.ReceiveBuffer.itemID1 = queueReceiveBuffer.items[0];
    }
    if (queueReceiveBuffer.items[1] !== undefined) {
        warehouse.ReceiveBuffer.itemID1 = queueReceiveBuffer.items[1];
    }
    if (queueReceiveBuffer.items[2] !== undefined) {
        warehouse.ReceiveBuffer.itemID1 = queueReceiveBuffer.items[2];
    }
    if (queueReceiveBuffer.items[3] !== undefined) {
        warehouse.ReceiveBuffer.itemID1 = queueReceiveBuffer.items[3];
    }
    //RECEIVE DOCK
    if (queueReceiveDock.items[0] !== undefined) {
        warehouse.ReceiveDock.itemID1 = queueReceiveDock.items[0];
    }
    if (queueReceiveDock.items[1] !== undefined) {
        warehouse.ReceiveDock.itemID1 = queueReceiveDock.items[1];
    }
    if (queueReceiveDock.items[2] !== undefined) {
        warehouse.ReceiveDock.itemID1 = queueReceiveDock.items[2];
    }
    if (queueReceiveDock.items[3] !== undefined) {
        warehouse.ReceiveDock.itemID1 = queueReceiveDock.items[3];
    }
    //DISPATCH BUFFER
    if (queueDispatchBuffer.items[0] !== undefined) {
        warehouse.DispatchBuffer.itemID1 = queueDispatchBuffer.items[0];
    }
    if (queueDispatchBuffer.items[1] !== undefined) {
        warehouse.DispatchBuffer.itemID1 = queueDispatchBuffer.items[1];
    }
    if (queueDispatchBuffer.items[2] !== undefined) {
        warehouse.DispatchBuffer.itemID1 = queueDispatchBuffer.items[2];
    }
    if (queueDispatchBuffer.items[3] !== undefined) {
        warehouse.DispatchBuffer.itemID1 = queueDispatchBuffer.items[3];
    }
    //DISPATCH DOCK
    if (queueDispatchDock.items[0] !== undefined) {
        warehouse.DispatchDock.itemID1 = queueDispatchDock.items[0];
    }
    if (queueDispatchDock.items[1] !== undefined) {
        warehouse.DispatchDock.itemID1 = queueDispatchDock.items[1];
    }
    if (queueDispatchDock.items[2] !== undefined) {
        warehouse.DispatchDock.itemID1 = queueDispatchDock.items[2];
    }
    if (queueDispatchDock.items[3] !== undefined) {
        warehouse.DispatchDock.itemID1 = queueDispatchDock.items[3];
    }

    // fs.writeFile("warehouse.json", JSON.stringify(save), function (erreur) {
    //     if (erreur) {
    //         console.log(erreur);
    //     }
    // });
    return new Promise((resolve) => {
        setTimeout(() => {
            // resolve("resolved");
            resolve(save);
        }, 100);
    });
}

// queueReceiveBuffer.enqueue(JSON.stringify(ID.ReceiveBufferitemID)); //recevoir les données enregistré
function newReceiveWarehouse() {
    queueReceiveDock.enqueue("new item 1 : no #ID");
    queueReceiveDock.enqueue("new item 2 : no #ID");
    queueReceiveDock.enqueue("new item 3 : no #ID");
    queueReceiveDock.enqueue("new item 4 : no #ID");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("resolved");
        }, 100);
    });
}

export {
    resetWarehouse,
    newReceiveWarehouse,
    stateWarehouse,
    saveWarehouse,
    readWarehouse,
};
