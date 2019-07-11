const router = require('express').Router()
const _ = require('../helpers')

const showShopPage = (res, pageName) => {
  _.showPage(res, `shop/${pageName}.html`)
}

router.get('/', (req, res, next) => {
  console.log('/')
  showShopPage(res, 'main')
})

router.get('/buy-product', (req, res, next) => {
  showShopPage(res, 'buy-product')
})

router.post('/api/buy-product', (req, res, next) => {
  console.log(req.body)
})

module.exports = router

