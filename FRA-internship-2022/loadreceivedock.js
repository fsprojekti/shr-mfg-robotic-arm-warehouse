import {
    goReset,
    goReceiveBuffer,
    goReceiveDock,
    suctionOFF,
    suctionON,
    queueReceiveDock,
} from "./robotmotion.js";
import {newReceiveWarehouse, readWarehouse} from "./warehouse.js";

async function loadTask() {
    await readWarehouse();
    await newReceiveWarehouse();
    await goReset();
    while (queueReceiveDock.topIndexD > 0) {
        await goReceiveDock();
        await suctionON();
        await goReceiveBuffer();
        await suctionOFF();
    }
    await goReset();
}

receiveTask();

export {receiveTask};
