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
  queueDispatchDock,
} from "./robotmotion.js";
import { newReceiveWarehouse, readWarehouse } from "./warehouse.js";

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
