import {
  goReset,
  goReceiveBuffer,
  goDispatchBuffer,
  suctionOFF,
  suctionON,
  goStorageD2,
  goStorageD1,
  localisation,
  goStorageD3,
  goStorageD4,
} from "./robotmotion.js";

import { readWarehouse, saveWarehouse } from "./warehouse.js";

import {
  queueDispatchBuffer,
  queueReceiveBuffer,
  queueStorageDock1,
  queueStorageDock2,
  queueStorageDock3,
  queueStorageDock4,
  queueRobot,
} from "./robotmotion.js";

const argv = process.argv.slice(2);

async function swapTask() {
  await readWarehouse();
  let queueStorageDock1Sort = [queueStorageDock1.items[0],
    queueStorageDock1.items[1],
    queueStorageDock1.items[2],
    queueStorageDock1.items[3]];
  let queueStorageDock2Sort = [queueStorageDock2.items[0],
    queueStorageDock2.items[1],
    queueStorageDock2.items[2],
    queueStorageDock2.items[3]];
  let queueStorageDock3Sort = [queueStorageDock3.items[0],
    queueStorageDock3.items[1],
    queueStorageDock3.items[2],
    queueStorageDock3.items[3]];
  let queueStorageDock4Sort = [queueStorageDock4.items[0],
    queueStorageDock4.items[1],
    queueStorageDock4.items[2],
    queueStorageDock4.items[3]];
  if (argv[0] === "--swap") {
    if (argv[1] === undefined) {
      console.log("Please, choose between 'SD1' / 'SD2' / 'SD3' / 'SD4'");
      await saveWarehouse();
    }
    if (
      argv[1] !== undefined &&
      argv[1] !== "SD1" &&
      argv[1] !== "SD2" &&
      argv[1] !== "SD3" &&
      argv[1] !== "SD4"
    ) {
      console.log(
        "Sorry, this storage doesn't exist. Please, choose between :"
      );
      console.log("'SD1' for Storage Dock 1");
      console.log("'SD2' for Storage Dock 2");
      console.log("'SD3' for Storage Dock 3");
      console.log("'SD4' for Storage Dock 4");
      await saveWarehouse();
    }
    //SWAP STORAGE DOCK 1
    if (argv[1] === "SD1") {
      queueStorageDock1Sort.sort();
      console.log(queueStorageDock1.items);
      console.log(queueStorageDock1Sort);
      if (
        queueStorageDock1.items[0] === queueStorageDock1Sort[0] &&
        queueStorageDock1.items[1] === queueStorageDock1Sort[1] &&
        queueStorageDock1.items[2] === queueStorageDock1Sort[2] &&
        queueStorageDock1.items[3] === queueStorageDock1Sort[3]
      ) {
        console.log("Storage dock 1 is already optimized");
      } else if (
        queueReceiveBuffer.topIndexC === 0 &&
        queueDispatchBuffer.topIndexG === 0
      ) {
        if (queueStorageDock1.items[0] !== queueStorageDock1Sort[0]) {
          while (queueStorageDock1.topIndexA !== 0) {
            await goStorageD1();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock1Sort[0]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD1();
          await suctionOFF();
          while (queueStorageDock1.items[1] !== queueStorageDock1Sort[1]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock1Sort[1]) {
              await goStorageD1();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock1.items[2] !== queueStorageDock1Sort[2]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock1Sort[2] ||
              queueDispatchBuffer.items[1] === queueStorageDock1Sort[2] ||
              queueDispatchBuffer.items[0] === queueStorageDock1Sort[2]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock1Sort[2]) {
              await goStorageD1();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock1.items[3] !== queueStorageDock1Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock1Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock1Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock1Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock1Sort[3]) {
              await goStorageD1();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        // if 1 already ok
        if (
          queueStorageDock1.items[0] === queueStorageDock1Sort[0] &&
          queueStorageDock1.items[1] !== queueStorageDock1Sort[1]
        ) {
          while (queueStorageDock1.topIndexA !== 1) {
            await goStorageD1();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock1Sort[1]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD1();
          await suctionOFF();
          while (queueStorageDock1.items[2] !== queueStorageDock1Sort[2]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock1Sort[2]) {
              await goStorageD1();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock1.items[3] !== queueStorageDock1Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock1Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock1Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock1Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock1Sort[3]) {
              await goStorageD1();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        //if 1 and 2 already ok
        if (
          queueStorageDock1.items[0] === queueStorageDock1Sort[0] &&
          queueStorageDock1.items[1] === queueStorageDock1Sort[1] &&
          queueStorageDock1.items[2] !== queueStorageDock1Sort[2]
        ) {
          while (queueStorageDock1.topIndexA !== 2) {
            await goStorageD1();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock1Sort[2]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD1();
          await suctionOFF();
          await goReceiveBuffer();
          await suctionON();
          await goStorageD1();
          await suctionOFF();
          await goReset();
        }
      } else {
        console.log(
          "Swap impossible, there is no place to swap. Receive and Dispatch Buffer must be empty"
        );
      }
    }
    //SWAP STORAGE DOCK 2
    if (argv[1] === "SD2") {
      queueStorageDock2Sort.sort();
      console.log(queueStorageDock2.items);
      console.log(queueStorageDock2Sort);
      if (
        queueStorageDock2.items[0] === queueStorageDock2Sort[0] &&
        queueStorageDock2.items[1] === queueStorageDock2Sort[1] &&
        queueStorageDock2.items[2] === queueStorageDock2Sort[2] &&
        queueStorageDock2.items[3] === queueStorageDock2Sort[3]
      ) {
        console.log("Storage dock 2 is already optimized");
      } else if (
        queueReceiveBuffer.topIndexC === 0 &&
        queueDispatchBuffer.topIndexG === 0
      ) {
        if (queueStorageDock2.items[0] !== queueStorageDock2Sort[0]) {
          while (queueStorageDock2.topIndexB !== 0) {
            await goStorageD2();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock2Sort[0]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD2();
          await suctionOFF();
          while (queueStorageDock2.items[1] !== queueStorageDock2Sort[1]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock2Sort[1]) {
              await goStorageD2();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock2.items[2] !== queueStorageDock2Sort[2]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock2Sort[2] ||
              queueDispatchBuffer.items[1] === queueStorageDock2Sort[2] ||
              queueDispatchBuffer.items[0] === queueStorageDock2Sort[2]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock2Sort[2]) {
              await goStorageD2();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock2.items[3] !== queueStorageDock2Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock2Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock2Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock2Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock2Sort[3]) {
              await goStorageD2();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        // if 1 already ok
        if (
          queueStorageDock2.items[0] === queueStorageDock2Sort[0] &&
          queueStorageDock2.items[1] !== queueStorageDock2Sort[1]
        ) {
          while (queueStorageDock2.topIndexB !== 1) {
            await goStorageD2();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock2Sort[1]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD2();
          await suctionOFF();
          while (queueStorageDock2.items[2] !== queueStorageDock2Sort[2]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock2Sort[2]) {
              await goStorageD2();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock2.items[3] !== queueStorageDock2Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock2Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock2Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock2Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock2Sort[3]) {
              await goStorageD2();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        //if 1 and 2 already ok
        if (
          queueStorageDock2.items[0] === queueStorageDock2Sort[0] &&
          queueStorageDock2.items[1] === queueStorageDock2Sort[1] &&
          queueStorageDock2.items[2] !== queueStorageDock2Sort[2]
        ) {
          while (queueStorageDock2.topIndexB !== 2) {
            await goStorageD2();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock2Sort[2]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD2();
          await suctionOFF();
          await goReceiveBuffer();
          await suctionON();
          await goStorageD2();
          await suctionOFF();
          await goReset();
        }
      } else {
        console.log(
          "Swap impossible, there is no place to swap. Receive and Dispatch Buffer must be empty"
        );
      }
    }
    //SWAP STORAGE DOCK 3
    if (argv[1] === "SD3") {
      queueStorageDock3Sort.sort();
      console.log(queueStorageDock3.items);
      console.log(queueStorageDock3Sort);
      if (
        queueStorageDock3.items[0] === queueStorageDock3Sort[0] &&
        queueStorageDock3.items[1] === queueStorageDock3Sort[1] &&
        queueStorageDock3.items[2] === queueStorageDock3Sort[2] &&
        queueStorageDock3.items[3] === queueStorageDock3Sort[3]
      ) {
        console.log("Storage dock 3 is already optimized");
      } else if (
        queueReceiveBuffer.topIndexC === 0 &&
        queueDispatchBuffer.topIndexG === 0
      ) {
        if (queueStorageDock3.items[0] !== queueStorageDock3Sort[0]) {
          while (queueStorageDock3.topIndexF !== 0) {
            await goStorageD3();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock3Sort[0]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD3();
          await suctionOFF();
          while (queueStorageDock3.items[1] !== queueStorageDock3Sort[1]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock3Sort[1]) {
              await goStorageD3();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock3.items[2] !== queueStorageDock3Sort[2]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock3Sort[2] ||
              queueDispatchBuffer.items[1] === queueStorageDock3Sort[2] ||
              queueDispatchBuffer.items[0] === queueStorageDock3Sort[2]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock3Sort[2]) {
              await goStorageD3();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock3.items[3] !== queueStorageDock3Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock3Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock3Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock3Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock3Sort[3]) {
              await goStorageD3();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        // if 1 already ok
        if (
          queueStorageDock3.items[0] === queueStorageDock3Sort[0] &&
          queueStorageDock3.items[1] !== queueStorageDock3Sort[1]
        ) {
          while (queueStorageDock3.topIndexF !== 1) {
            await goStorageD3();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock3Sort[1]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD3();
          await suctionOFF();
          while (queueStorageDock3.items[2] !== queueStorageDock3Sort[2]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock3Sort[2]) {
              await goStorageD3();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock3.items[3] !== queueStorageDock3Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock3Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock3Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock3Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock3Sort[3]) {
              await goStorageD3();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        //if 1 and 2 already ok
        if (
          queueStorageDock3.items[0] === queueStorageDock3Sort[0] &&
          queueStorageDock3.items[1] === queueStorageDock3Sort[1] &&
          queueStorageDock3.items[2] !== queueStorageDock3Sort[2]
        ) {
          while (queueStorageDock3.topIndexF !== 2) {
            await goStorageD3();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock3Sort[2]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD3();
          await suctionOFF();
          await goReceiveBuffer();
          await suctionON();
          await goStorageD3();
          await suctionOFF();
          await goReset();
        }
      } else {
        console.log(
          "Swap impossible, there is no place to swap. Receive and Dispatch Buffer must be empty"
        );
      }
    }
    //SWAP STORAGE DOCK 4
    if (argv[1] === "SD4") {
      queueStorageDock4Sort.sort();
      console.log(queueStorageDock4.items);
      console.log(queueStorageDock4Sort);
      if (
        queueStorageDock4.items[0] === queueStorageDock4Sort[0] &&
        queueStorageDock4.items[1] === queueStorageDock4Sort[1] &&
        queueStorageDock4.items[2] === queueStorageDock4Sort[2] &&
        queueStorageDock4.items[3] === queueStorageDock4Sort[3]
      ) {
        console.log("Storage dock 4 is already optimized");
      } else if (
        queueReceiveBuffer.topIndexC === 0 &&
        queueDispatchBuffer.topIndexG === 0
      ) {
        if (queueStorageDock4.items[0] !== queueStorageDock4Sort[0]) {
          while (queueStorageDock4.topIndexE !== 0) {
            await goStorageD4();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock4Sort[0]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD4();
          await suctionOFF();
          while (queueStorageDock4.items[1] !== queueStorageDock4Sort[1]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock4Sort[1]) {
              await goStorageD4();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock4.items[2] !== queueStorageDock4Sort[2]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock4Sort[2] ||
              queueDispatchBuffer.items[1] === queueStorageDock4Sort[2] ||
              queueDispatchBuffer.items[0] === queueStorageDock4Sort[2]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock4Sort[2]) {
              await goStorageD4();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock4.items[3] !== queueStorageDock4Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock4Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock4Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock4Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock4Sort[3]) {
              await goStorageD4();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        // if 1 already ok
        if (
          queueStorageDock4.items[0] === queueStorageDock4Sort[0] &&
          queueStorageDock4.items[1] !== queueStorageDock4Sort[1]
        ) {
          while (queueStorageDock4.topIndexE !== 1) {
            await goStorageD4();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock4Sort[1]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD4();
          await suctionOFF();
          while (queueStorageDock4.items[2] !== queueStorageDock4Sort[2]) {
            await goReceiveBuffer();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock4Sort[2]) {
              await goStorageD4();
              await suctionOFF();
            } else {
              await goDispatchBuffer();
              await suctionOFF();
            }
          }
          while (queueStorageDock4.items[3] !== queueStorageDock4Sort[3]) {
            if (
              queueDispatchBuffer.items[2] === queueStorageDock4Sort[3] ||
              queueDispatchBuffer.items[1] === queueStorageDock4Sort[3] ||
              queueDispatchBuffer.items[0] === queueStorageDock4Sort[3]
            ) {
              await goDispatchBuffer();
              await suctionON();
            } else {
              await goReceiveBuffer();
              await suctionON();
            }
            if (queueRobot.items[0] === queueStorageDock4Sort[3]) {
              await goStorageD4();
              await suctionOFF();
            } else if (localisation === 3) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goReset();
        }
        //if 1 and 2 already ok
        if (
          queueStorageDock4.items[0] === queueStorageDock4Sort[0] &&
          queueStorageDock4.items[1] === queueStorageDock4Sort[1] &&
          queueStorageDock4.items[2] !== queueStorageDock4Sort[2]
        ) {
          while (queueStorageDock4.topIndexE !== 2) {
            await goStorageD4();
            await suctionON();
            if (queueRobot.items[0] === queueStorageDock4Sort[2]) {
              await goDispatchBuffer();
              await suctionOFF();
            } else {
              await goReceiveBuffer();
              await suctionOFF();
            }
          }
          await goDispatchBuffer();
          await suctionON();
          await goStorageD4();
          await suctionOFF();
          await goReceiveBuffer();
          await suctionON();
          await goStorageD4();
          await suctionOFF();
          await goReset();
        }
      } else {
        console.log(
          "Swap impossible, there is no place to swap. Receive and Dispatch Buffer must be empty"
        );
      }
    }
  }
  await saveWarehouse();
}

swapTask();

export { swapTask };