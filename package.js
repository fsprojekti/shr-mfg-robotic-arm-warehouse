import {createRequire} from "module";
const require = createRequire(import.meta.url);

export class Package {
    constructor(id, timeLimit) {
        this.packageId = id;
        this.storageTimeLimit = timeLimit;
    }
}
