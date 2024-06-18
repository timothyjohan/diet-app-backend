const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.send('GET request to the syndigo')
})

router.get('/autocomplete', (req, res) => {
    const {query} = req.query
    res.send('GET request to the homepage')
})

module.exports = router