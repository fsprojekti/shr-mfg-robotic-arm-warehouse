import {
    goDispatchDock,
    goReceiveDock,
    goReset,
    queueDispatchDock, suctionOFF, suctionON,
} from "./robotmotion.js";
import {readWarehouse} from "./warehouse.js";

async function unload() {
    await readWarehouse();
    await goReset();
    await goDispatchDock();
    await suctionON();
    await goLoad();
    await suctionOFF();
    await goReset();
}

unload();

export {unload};
