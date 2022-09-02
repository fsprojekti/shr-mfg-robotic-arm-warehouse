import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axios = require("axios").default;
const config = require("../Test/config.json");

var Promise = require("es6-promise").Promise;
var async = require("async");
const express = require("express");

import {
  goReset,
  suctionOFF,
  suctionON,
  queueDispatchBuffer,
  goDispatchBuffer,
  goDispatchDock,
} from "./robotmotion.js";
import { readWarehouse } from "./warehouse.js";

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

export { dispatchTask };
