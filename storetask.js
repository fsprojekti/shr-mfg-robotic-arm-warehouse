import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
const config = require("../Test/config.json");

var Promise = require("es6-promise").Promise;
var async = require("async");
const express = require("express");
import { readWarehouse } from "./warehouse.js";

import {
  goReset,
  goReceiveBuffer,
  suctionOFF,
  suctionON,
  queueReceiveBuffer,
  queueReceiveDock,
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
