import {
    goReset,
    suctionOFF,
    suctionON,
    queueDispatchBuffer,
    goDispatchBuffer,
    goDispatchDock,
} from "./robotmotion.js";
import {readWarehouse} from "./warehouse.js";

async function dispatchTask() {
    await readWarehouse();
    await goReset();
    while (queueDispatchBuffer.topIndexG > 0) {
        await goDispatchBuffer();
        await suctionON();
        await goDispatchDock();
        await suctionOFF();
    }
    await goReset();
}

dispatchTask();

export {dispatchTask};
