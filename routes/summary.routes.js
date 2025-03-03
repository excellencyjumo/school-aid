const router = require('express').Router();
const summaryController = require('../controllers/summary.controller');
const catchAsync = require('../utils/catchAsync');
const { authenticateUser } = require('../middlewares/auth');

router.use(catchAsync(authenticateUser));

router.post('/', catchAsync(summaryController.createSummary));
router.get('/', catchAsync(summaryController.getSummaries));
router.get('/:id', catchAsync(summaryController.getSummaryById));
router.patch('/:id', catchAsync(summaryController.updateSummary));
router.delete('/:id', catchAsync(summaryController.deleteSummary));

module.exports = router;