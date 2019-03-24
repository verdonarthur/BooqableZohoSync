const express = require('express')
const router = express.Router()

const logger = require('../class/utils/Logger')


router.get('/', (req, res, next) => {
    const options = {
        from: new Date() - (24 * 60 * 60 * 1000),
        until: new Date(),
        limit: 30,
        start: 0,
        order: 'desc',
      };

      logger.query(options, function (err, results) {
        if (err) {
          res.status(500).send(err)
        }
      
        res.send(results)
      });      
    

})


module.exports = router