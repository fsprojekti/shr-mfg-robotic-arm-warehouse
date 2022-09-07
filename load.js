import {
    goReceiveDock,
    goReset,
    suctionON,
    suctionOFF,
    queueDispatchDock, goReceiveBuffer,
} from "./robotmotion.js";
import {readWarehouse} from "./warehouse.js";

async function load() {
    await readWarehouse();
    await goReset();
    await goReceiveDock();
    await suctionON();
    await goReceiveBuffer();
    await suctionOFF();
    await goReset();
}

load();

export {load};
