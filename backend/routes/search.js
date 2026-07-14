var express = require('express');
var router = express.Router();

var search_controller = require('../controllers/searchController')


router.route("/search/test").get(search_controller.test);
router.route("/search").post(search_controller.search);



module.exports = router;
