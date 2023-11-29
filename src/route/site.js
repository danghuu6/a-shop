const express = require('express');
const router = express.Router();

const siteController = require('./../controller/SiteController')

router.get('/health-check', siteController.healthCheck);

module.exports = router;
