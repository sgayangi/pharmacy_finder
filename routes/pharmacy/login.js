// view customer info
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../../views/pharmacy/login.html'));
});

module.exports = router;