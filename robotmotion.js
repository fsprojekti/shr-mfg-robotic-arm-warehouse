import { group } from "console";
import { read } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
const config = require("../Test/config.json");

var Promise = require("es6-promise").Promise;
var async = require("async");
const express = require("express");

const jetmaxUbuntServerIpAddress = "localhost:3000";

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
} from "../Main/queuelifo.js";

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
import { readWarehouse, saveWarehouse, stateWarehouse } from "./warehouse.js";

var localisation = 0;

// MOTION FUNCTIONS

//GO Reset
function goReset() {
  localisation = 0;
  var X = 0;
  var Y = -162.94;
  var Z = 212.8;
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 3000);
  });
}

//GO A
async function goStorageD1() {
  localisation = 1;
  var X = -115;
  var Y = 70;
  var Z = 215;
  if (queueStorageDock1.topIndexA == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("STORAGE DOCK 1 IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO B
async function goStorageD2() {
  localisation = 2;
  var X = -115;
  var Y = -20;
  var Z = 215;
  if (queueStorageDock2.topIndexB == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("STORAGE DOCK 2 IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO F
async function goStorageD3() {
  localisation = 6;
  var X = 115;
  var Y = -20;
  var Z = 215;
  if (queueStorageDock3.topIndexF == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("STORAGE DOCK 3 IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO E
async function goStorageD4() {
  localisation = 5;
  var X = 115;
  var Y = 65;
  var Z = 215;
  if (queueStorageDock4.topIndexE == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("STORAGE DOCK 4 IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO C
async function goReceiveBuffer() {
  localisation = 3;
  var X = -125;
  var Y = -110;
  var Z = 215;
  if (queueReceiveBuffer.topIndexC == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("RECEIVE BUFFER IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO G
async function goDispatchBuffer() {
  localisation = 7;
  var X = 125;
  var Y = -110;
  var Z = 215;
  if (queueDispatchBuffer.topIndexG == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("DISPATCH BUFFER IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO D
async function goReceiveDock() {
  localisation = 4;
  var X = -125;
  var Y = -200;
  var Z = 215;
  if (queueReceiveDock.topIndexD == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("RECEIVE DOCK IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//GO H
async function goDispatchDock() {
  localisation = 8;
  var X = 125;
  var Y = -200;
  var Z = 215;
  if (queueDispatchDock.topIndexH == 4 && queueRobot.topIndexR == 1) {
    await saveWarehouse();
    await suctionOFF();
    await goReset();
    throw new Error("DISPATCH DOCK IS ALREADY FULL !!! TASK ABORDED");
  }
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/moveTo", {
    params: { msg: { x: X, y: Y, z: Z } },
  });
  saveWarehouse();
  stateWarehouse();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

//SUCTION ON
async function suctionON() {
  await goDown();
  if (queueReceiveBuffer.topIndexC == 4 && localisation == 4) {
    await saveWarehouse();
    await goReset();
    throw new Error("RECEIVE BUFFER IS ALREADY FULL !!! TASK ABORDED");
  }
  if (
    queueStorageDock1.topIndexA == 4 &&
    queueStorageDock2.topIndexB == 4 &&
    queueStorageDock3.topIndexE == 4 &&
    queueStorageDock4.topIndexF == 4 &&
    localisation == 3
  ) {
    await saveWarehouse();
    await goReset();
    throw new Error("STORAGE IS ALREADY FULL !!! TASK ABORDED");
  }
  if (queueDispatchDock.topIndexH == 4 && localisation == 7) {
    await saveWarehouse();
    await goReset();
    throw new Error("DISPATCH DOCK IS ALREADY FULL !!! TASK ABORDED");
  }
  // await ReadSaveWarehouse();
  await goGrab();
  await axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
    params: { msg: { data: true } },
  });
  if (queueRobot.topIndexR === 1) {
    await saveWarehouse();
    throw new Error("The JetMAXRobot have already an item");
  } else {
    if (localisation === 1 && queueRobot.topIndexR === 0) {
      if (queueStorageDock1.topIndexA === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goStorageD1();
      queueRobot.enqueue(queueStorageDock1.dequeue());
    }
    if (localisation === 2 && queueRobot.topIndexR === 0) {
      if (queueStorageDock2.topIndexB === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goStorageD2();
      queueRobot.enqueue(queueStorageDock2.dequeue());
    }
    if (localisation === 3 && queueRobot.topIndexR === 0) {
      if (queueReceiveBuffer.topIndexC === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goReceiveBuffer();
      queueRobot.enqueue(queueReceiveBuffer.dequeue());
    }
    if (localisation === 4 && queueRobot.topIndexR === 0) {
      if (queueReceiveDock.topIndexD === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goReceiveDock();
      queueRobot.enqueue(queueReceiveDock.dequeue());
    }
    if (localisation === 5 && queueRobot.topIndexR === 0) {
      if (queueStorageDock4.topIndexE === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goStorageD4();
      queueRobot.enqueue(queueStorageDock4.dequeue());
    }
    if (localisation === 6 && queueRobot.topIndexR === 0) {
      if (queueStorageDock3.topIndexF === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goStorageD3();
      queueRobot.enqueue(queueStorageDock3.dequeue());
    }
    if (localisation === 7 && queueRobot.topIndexR === 0) {
      if (queueDispatchBuffer.topIndexG === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
        });
        await saveWarehouse();
        throw new Error("There is no item here");
      }
      await goDispatchBuffer();
      queueRobot.enqueue(queueDispatchBuffer.dequeue());
    }
    if (localisation === 8 && queueRobot.topIndexR === 0) {
      if (queueDispatchDock.topIndexH === 0) {
        axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
          params: { msg: { data: false } },
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
      }, 1500);
    });
  }
}

//SUCTION OFF
async function suctionOFF() {
  await goDown();
  // await ReadSaveWarehouse();

  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/suction", {
    params: { msg: { data: false } },
  });
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: 50 } },
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
      }, 1500);
    });
  }
}

function getLocation() {
  console.log(localisation);
}

//GO DOWN
async function goDown() {
  // getLocation();
  queueRobot.topIndexR;
  queueStorageDock1.topIndexA;
  queueStorageDock2.topIndexB;
  queueStorageDock3.topIndexF;
  queueStorageDock4.topIndexE;
  queueReceiveBuffer.topIndexC;
  queueDispatchBuffer.topIndexG;
  queueDispatchDock.topIndexH;
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
    DownIndex1();
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
    DownIndex1();
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
    DownIndex2();
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
    DownIndex3();
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
    DownIndex4();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 3000);
  });
}

function DownIndex1() {
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: -133 } },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
} // INDEX = 1

function DownIndex2() {
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: -126 } },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
} // INDEX = 2

function DownIndex3() {
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: -116 } },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
} //INDEX = 3

function DownIndex4() {
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: -106 } },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
} //INDEX = 4

function goGrab() {
  axios.get("http://" + jetmaxUbuntServerIpAddress + "/basic/move", {
    params: { msg: { x: 0, y: 0, z: -20 } },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
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
