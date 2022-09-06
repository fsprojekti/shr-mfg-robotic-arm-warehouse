
import {
  goReset,
  queueDispatchDock,
} from "./robotmotion.js";
import { readWarehouse } from "./warehouse.js";

async function unload() {
  await readWarehouse();
  await goReset();
  while (queueDispatchDock.topIndexH > 0) {
    queueDispatchDock.dequeue();
  }
  await goReset();
}

unload();

export { unload };
