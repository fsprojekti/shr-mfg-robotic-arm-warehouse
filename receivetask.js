import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
const config = require("../Test/config.json");

var Promise = require("es6-promise").Promise;
var async = require("async");
const express = require("express");

import {
  goReset,
  goReceiveBuffer,
  goReceiveDock,
  suctionOFF,
  suctionON,
  queueReceiveDock,
} from "./robotmotion.js";
import { newReceiveWarehouse, readWarehouse } from "./warehouse.js";

async function receiveTask() {
  await readWarehouse();
  await newReceiveWarehouse();
  await goReset();
  while (queueReceiveDock.topIndexD > 0) {
    await goReceiveDock();
    await suctionON();
    // await goReceiveDock();
    await goReceiveBuffer();
    await suctionOFF();
  }
  await goReset();
}

receiveTask();

export { receiveTask };
