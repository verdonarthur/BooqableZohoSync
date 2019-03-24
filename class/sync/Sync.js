const logger = require('../utils/Logger')

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
            if (!systemObjects)
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
                        logger.info('update : ' + JSON.stringify(object))
                    } else { logger.info('latest change already sync for :' + JSON.stringify(object)) }
                } else {
                    await object.save()
                    logger.info('latest change already sync for :' + JSON.stringify(object))
                }
            }
        } catch (err) {
            logger.error(err)
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
                    logger.info("Begin sync From Zoho")
                    await this.syncFromZoho()
                    logger.info("Begin sync to Booqable")
                    await this.syncToBooqable()
                    logger.info("Begin sync From Booqable")
                    await this.syncFromBooqable()
                    logger.info("Begin sync to Zoho")
                    await this.syncToZoho()
                    break;

                case SYSTEM.BOOQABLE:
                    logger.info("Begin sync From Booqable")
                    await this.syncFromBooqable()
                    logger.info("Begin sync to Zoho")
                    await this.syncToZoho()
                    logger.info("Begin sync From Zoho")
                    await this.syncFromZoho()
                    logger.info("Begin sync to Booqable")
                    await this.syncToBooqable()
                    break;

                default:
                    break;
            }
        } catch (err) {
            logger.error(err)
            return err
        }
    }
}