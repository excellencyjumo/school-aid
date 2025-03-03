const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

exports.createSummary = catchAsync(async (req, res, next) => {
  const { filename, content } = req.body;
  const userId = req.user.id;

  const summary = await prisma.summary.create({
    data: {
      filename,
      content,
      userId
    }
  });

  responseHandler.success(res, 201, { summary });
});

exports.getSummaries = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const summaries = await prisma.summary.findMany({
    where: { userId },
    select: {
      id: true,
      filename: true,
      createdAt: true,
      updatedAt: true
    }
  });

  responseHandler.success(res, 200, {
    results: summaries.length,
    data: {
      summaries
    }
  });
});

exports.getSummaryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const summary = await prisma.summary.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!summary) {
    return next(new AppError('No summary found with that ID', 404));
  }

  responseHandler.success(res, 200, { summary });
});

exports.updateSummary = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { filename, content } = req.body;
  const userId = req.user.id;

  const summary = await prisma.summary.updateMany({
    where: {
      id,
      userId
    },
    data: {
      filename,
      content
    }
  });

  if (summary.count === 0) {
    return next(new AppError('No summary found with that ID', 404));
  }

  responseHandler.success(res, 200, {
    summary: {
      summary: {
        id,
        filename,
        content
      }
    }
  });
});

exports.deleteSummary = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const summary = await prisma.summary.deleteMany({
    where: {
      id,
      userId
    }
  });

  if (summary.count === 0) {
    return next(new AppError('No summary found with that ID', 404));
  }

  responseHandler.success(res, 204, null);
});