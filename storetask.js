import { readWarehouse } from "./warehouse.js";

import {
  goReset,
  goReceiveBuffer,
  suctionOFF,
  suctionON,
  queueReceiveBuffer,
} from "./robotmotion.js";

import { goStorage } from "./stackingalgorithm.js";

async function storeTask() {
  await readWarehouse();
  await goReset();
  while (queueReceiveBuffer.topIndexC > 0) {
    await goReceiveBuffer();
    await suctionON();
    await goStorage();
    await suctionOFF();
  }
  await goReset();
}

storeTask();

export { storeTask };
