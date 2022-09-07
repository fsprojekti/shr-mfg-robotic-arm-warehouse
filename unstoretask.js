import {createRequire} from "module";
import {
    goDispatchBuffer,
    goReset,
    goStorageD1,
    goStorageD2,
    goStorageD3,
    goStorageD4,
    queueDispatchBuffer,
    queueStorageDock1,
    queueStorageDock2,
    queueStorageDock3,
    queueStorageDock4,
    suctionOFF,
    suctionON,
} from "./robotmotion.js";
import {goStorage} from "./stackingalgorithm.js";
import {readWarehouse, saveWarehouse} from "./warehouse.js";

const require = createRequire(import.meta.url);
const warehouse = require("./warehouse.json");

const argv = process.argv.slice(2);

async function unstoretask() {
    await readWarehouse();
    if (queueDispatchBuffer.topIndexG === 4) {
        await goReset();
        await saveWarehouse();
        throw new Error(
            "Dispatch Buffer is already full ! Unstore is impossible for now !"
        );
    }
    if (argv[0] === "--get") {
        if (argv[1] === undefined) {
            console.log("Please, enter an ID");
            await saveWarehouse();
        }
        if (
            argv[1] !== warehouse.StorageDock1.itemID1 &&
            argv[1] !== warehouse.StorageDock1.itemID2 &&
            argv[1] !== warehouse.StorageDock1.itemID3 &&
            argv[1] !== warehouse.StorageDock1.itemID4 &&
            argv[1] !== warehouse.StorageDock2.itemID1 &&
            argv[1] !== warehouse.StorageDock2.itemID2 &&
            argv[1] !== warehouse.StorageDock2.itemID3 &&
            argv[1] !== warehouse.StorageDock2.itemID4 &&
            argv[1] !== warehouse.StorageDock3.itemID1 &&
            argv[1] !== warehouse.StorageDock3.itemID2 &&
            argv[1] !== warehouse.StorageDock3.itemID3 &&
            argv[1] !== warehouse.StorageDock3.itemID4 &&
            argv[1] !== warehouse.StorageDock4.itemID1 &&
            argv[1] !== warehouse.StorageDock4.itemID2 &&
            argv[1] !== warehouse.StorageDock4.itemID3 &&
            argv[1] !== warehouse.StorageDock4.itemID4
        ) {
            console.log("Sorry, this ID isn't in the storage. Please try another ID");
            await saveWarehouse();
        }
        if (
            (argv[1] === warehouse.StorageDock1.itemID4 &&
                queueStorageDock1.topIndexA === 4) ||
            (argv[1] === warehouse.StorageDock1.itemID3 &&
                queueStorageDock1.topIndexA === 3) ||
            (argv[1] === warehouse.StorageDock1.itemID2 &&
                queueStorageDock1.topIndexA === 2) ||
            (argv[1] === warehouse.StorageDock1.itemID1 &&
                queueStorageDock1.topIndexA === 1)
        ) {
            console.log(
                "Item #ID:" + argv[1] + " from Storage Dock 1, go to Dispatch Buffer."
            );
            await goStorageD1();
            await suctionON();
            await goDispatchBuffer();
            await suctionOFF();
            await goReset();
        }
        if (
            (argv[1] === warehouse.StorageDock1.itemID3 &&
                queueStorageDock1.topIndexA === 4) ||
            (argv[1] === warehouse.StorageDock1.itemID2 &&
                queueStorageDock1.topIndexA === 3) ||
            (argv[1] === warehouse.StorageDock1.itemID1 &&
                queueStorageDock1.topIndexA === 2)
        ) {
            console.log(
                "Item #ID:" + argv[1] + " from Storage Dock 1, go to Dispatch Buffer."
            );
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goDispatchBuffer();
            await suctionOFF();
            await goReset();
        }
        if (
            (argv[1] === warehouse.StorageDock1.itemID2 &&
                queueStorageDock1.topIndexA === 4) ||
            (argv[1] === warehouse.StorageDock1.itemID1 &&
                queueStorageDock1.topIndexA === 3)
        ) {
            console.log(
                "Item #ID:" + argv[1] + " from Storage Dock 1, go to Dispatch Buffer."
            );
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goDispatchBuffer();
            await suctionOFF();
            await goReset();
        }
        if (
            argv[1] === warehouse.StorageDock1.itemID1 &&
            queueStorageDock1.topIndexA === 4
        ) {
            console.log(
                "Item #ID:" + argv[1] + " from Storage Dock 1, go to Dispatch Buffer."
            );
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goStorage();
            await suctionOFF();
            await goStorageD1();
            await suctionON();
            await goDispatchBuffer();
            await suctionOFF();
            await goReset();
        }
    }
    //STORAGE DOCK 2
    if (
        (argv[1] === warehouse.StorageDock2.itemID4 &&
            queueStorageDock2.topIndexB === 4) ||
        (argv[1] === warehouse.StorageDock2.itemID3 &&
            queueStorageDock2.topIndexB === 3) ||
        (argv[1] === warehouse.StorageDock2.itemID2 &&
            queueStorageDock2.topIndexB === 2) ||
        (argv[1] === warehouse.StorageDock2.itemID1 &&
            queueStorageDock2.topIndexB === 1)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 2, go to Dispatch Buffer."
        );
        await goStorageD2();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock2.itemID3 &&
            queueStorageDock2.topIndexB === 4) ||
        (argv[1] === warehouse.StorageDock2.itemID2 &&
            queueStorageDock2.topIndexB === 3) ||
        (argv[1] === warehouse.StorageDock2.itemID1 &&
            queueStorageDock2.topIndexB === 2)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 2, go to Dispatch Buffer."
        );
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock2.itemID2 &&
            queueStorageDock2.topIndexB === 4) ||
        (argv[1] === warehouse.StorageDock2.itemID1 &&
            queueStorageDock2.topIndexB === 3)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 2, go to Dispatch Buffer."
        );
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        argv[1] === warehouse.StorageDock2.itemID1 &&
        queueStorageDock2.topIndexB === 4
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 2, go to Dispatch Buffer."
        );
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD2();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    //STORAGE DOCK 3
    if (
        (argv[1] === warehouse.StorageDock3.itemID4 &&
            queueStorageDock3.topIndexF === 4) ||
        (argv[1] === warehouse.StorageDock3.itemID3 &&
            queueStorageDock3.topIndexF === 3) ||
        (argv[1] === warehouse.StorageDock3.itemID2 &&
            queueStorageDock3.topIndexF === 2) ||
        (argv[1] === warehouse.StorageDock3.itemID1 &&
            queueStorageDock3.topIndexF === 1)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 3, go to Dispatch Buffer."
        );
        await goStorageD3();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock3.itemID3 &&
            queueStorageDock3.topIndexF === 4) ||
        (argv[1] === warehouse.StorageDock3.itemID2 &&
            queueStorageDock3.topIndexF === 3) ||
        (argv[1] === warehouse.StorageDock3.itemID1 &&
            queueStorageDock3.topIndexF === 2)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 3, go to Dispatch Buffer."
        );
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock3.itemID2 &&
            queueStorageDock3.topIndexF === 4) ||
        (argv[1] === warehouse.StorageDock3.itemID1 &&
            queueStorageDock3.topIndexF === 3)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 3, go to Dispatch Buffer."
        );
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        argv[1] === warehouse.StorageDock3.itemID1 &&
        queueStorageDock3.topIndexF === 4
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 3, go to Dispatch Buffer."
        );
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD3();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    //SOTRAG DOCK 4
    if (
        (argv[1] === warehouse.StorageDock4.itemID4 &&
            queueStorageDock4.topIndexE === 4) ||
        (argv[1] === warehouse.StorageDock4.itemID3 &&
            queueStorageDock4.topIndexE === 3) ||
        (argv[1] === warehouse.StorageDock4.itemID2 &&
            queueStorageDock4.topIndexE === 2) ||
        (argv[1] === warehouse.StorageDock4.itemID1 &&
            queueStorageDock4.topIndexE === 1)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 4, go to Dispatch Buffer."
        );
        await goStorageD4();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock4.itemID3 &&
            queueStorageDock4.topIndexE === 4) ||
        (argv[1] === warehouse.StorageDock4.itemID2 &&
            queueStorageDock4.topIndexE === 3) ||
        (argv[1] === warehouse.StorageDock4.itemID1 &&
            queueStorageDock4.topIndexE === 2)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 4, go to Dispatch Buffer."
        );
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        (argv[1] === warehouse.StorageDock4.itemID2 &&
            queueStorageDock4.topIndexE === 4) ||
        (argv[1] === warehouse.StorageDock4.itemID1 &&
            queueStorageDock4.topIndexE === 3)
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 4, go to Dispatch Buffer."
        );
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
    if (
        argv[1] === warehouse.StorageDock4.itemID1 &&
        queueStorageDock4.topIndexE === 4
    ) {
        console.log(
            "Item #ID:" + argv[1] + " from Storage Dock 4, go to Dispatch Buffer."
        );
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goStorage();
        await suctionOFF();
        await goStorageD4();
        await suctionON();
        await goDispatchBuffer();
        await suctionOFF();
        await goReset();
    }
}

unstoretask();

export {unstoretask};