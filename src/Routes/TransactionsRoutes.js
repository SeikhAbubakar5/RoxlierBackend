const express = require('express');
const router = express.Router();
const transactionCont = require('../Controllers/TransactionsCont');

//search and pagination
router.get('/transactions', transactionCont.getTransactions);

//statistics-specific month
router.get('/statistics', transactionCont.getStatistics);

//price range statistics
router.get('/price-range', transactionCont.getPriceRange);

//category statistics
router.get('/category', transactionCont.getCategory);

// combined data
router.get('/combined', transactionCont.getCombined);

module.exports = router;
