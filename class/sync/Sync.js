const SYSTEM = { ZOHO: 1, BOOQABLE: 2 }


module.exports = class Sync {
    static get SYSTEM() { return SYSTEM }

    constructor() {
    }

    /**
     * Generic method to sync a Type of record from the system in param
     * @param {*} TheTypeClass 
     * @param {*} system 
     */
    async syncFrom(TheTypeClass, system = SYSTEM.ZOHO) {
        let isInDB, object, lastUpdateSystem, lastUpdateDB, systemObjects

        try {
            switch (system) {
                case SYSTEM.ZOHO:
                    systemObjects = await TheTypeClass.getAllFromZoho()
                    break;
                case SYSTEM.BOOQABLE:
                    systemObjects = await TheTypeClass.getAllFromBooqable()
                    break;
            }

            // if empty
            if(!systemObjects)
                return

            for (let systemObject of systemObjects) {
                switch (system) {
                    case SYSTEM.ZOHO:
                        object = TheTypeClass.fromZoho(systemObject)
                        isInDB = await TheTypeClass.findByZohoID(object.zohoID)
                        break;
                    case SYSTEM.BOOQABLE:
                        object = TheTypeClass.fromBooqable(systemObject)
                        isInDB = await TheTypeClass.findByBooqableID(object.booqableID)
                        break;
                }

                if (isInDB) {
                    switch (system) {
                        case SYSTEM.ZOHO:
                            lastUpdateSystem = new Date(object.zohoLastUpdate)
                            break;
                        case SYSTEM.BOOQABLE:
                            lastUpdateSystem = new Date(object.booqableLastUpdate)
                            break;
                    }

                    lastUpdateDB = new Date(isInDB.createdAt)

                    if (lastUpdateDB < lastUpdateSystem) {
                        isInDB.setFieldToSync(object)

                        await isInDB.save()
                        console.log('update : ', object)
                    } else { console.log('latest change already sync') }
                } else {
                    await object.save()
                    console.log('add new : ', object)
                }
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }

    /**
     * Generic method to save a Type record to the system in params
     * @param {*} TheTypeClass 
     * @param {*} system
     */
    async syncTo(TheTypeClass, system) {
        let localDBTypes = await TheTypeClass.find()

        for (let localType of localDBTypes) {
            switch (system) {
                case SYSTEM.ZOHO:
                    await localType.saveToZoho()
                    break;
                case SYSTEM.BOOQABLE:
                    await localType.saveToBooqable()
                    break;
            }

        }
    }

    /**
     * Will sync local database with zoho latest change
     */
    async syncFromZoho(TheTypeClass) {
        return await this.syncFrom(TheTypeClass, SYSTEM.ZOHO)
    }

    /**
     * sync local change to zoho
     */
    async syncToZoho(TheTypeClass) {
        return await this.syncTo(TheTypeClass, SYSTEM.ZOHO)
    }

    /**
     * sync local change from booqable latest change
     */
    async syncFromBooqable(TheTypeClass) {
        return await this.syncFrom(TheTypeClass, SYSTEM.BOOQABLE)
    }

    /**
     * sync local change to booqable
     */
    async syncToBooqable(TheTypeClass) {
        return await this.syncTo(TheTypeClass, SYSTEM.BOOQABLE)
    }

    /**
     * 
     * @param {*} priority 
     */
    async completeSync(priority) {
        try {
            switch (priority) {
                case SYSTEM.ZOHO:
                    console.log("=========== ZOHO PRIORITY ===========\n")
                    console.log("----------- FROM ZOHO SYNC -----------\n")
                    await this.syncFromZoho()
                    console.log("----------- TO BOOQABLE SYNC -----------\n")
                    await this.syncToBooqable()
                    console.log("----------- FROM BOOQABLE SYNC -----------\n")
                    await this.syncFromBooqable()
                    console.log("----------- TO ZOHO SYNC -----------\n")
                    await this.syncToZoho()
                    break;

                case SYSTEM.BOOQABLE:
                    console.log("=========== ZOHO PRIORITY ===========\n")
                    console.log("----------- FROM BOOQABLE SYNC -----------\n")
                    await this.syncFromBooqable()
                    console.log("----------- TO ZOHO SYNC -----------\n")
                    await this.syncToZoho()
                    console.log("----------- FROM ZOHO SYNC -----------\n")
                    await this.syncFromZoho()
                    console.log("----------- TO BOOQABLE SYNC -----------\n")
                    await this.syncToBooqable()
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }
}