import { Response } from "express";
import { checkUser } from "./authService";
import { prisma } from "../config/db";
import { successResponse } from "../utils/response";
import { DashboardParams, DashboardResponse } from "../models/dashboardModel";

const dashboardService = async (
  userId: number,
  req: DashboardParams,
  res: Response,
) => {
  await checkUser(userId, res);

  const startDate = new Date(`${req.startDate}T00:00:00.000Z`);
  const endDate = new Date(`${req.endDate}T23:59:59.999Z`);

  const dateFilter = {
    createdAt: {
      ...(req.startDate && { gte: startDate }),
      ...(req.endDate && { lte: endDate }),
    },
  };

  const [cashIn, cashOut, sales, restocks, loans, returns] = await Promise.all([
    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "IN",
        ...dateFilter,
      },
    }),

    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "OUT",
        ...dateFilter,
      },
    }),

    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "IN",
        category: "SALE",
        ...dateFilter,
      },
    }),

    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "OUT",
        category: "RESTOCK",
        ...dateFilter,
      },
    }),

    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "OUT",
        category: "LOAN",
        ...dateFilter,
      },
    }),

    prisma.cashFlow.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "IN",
        category: "RETURN",
        ...dateFilter,
      },
    }),
  ]);

  return successResponse<DashboardResponse>(
    res,
    "Success",
    {
      totalCashIn: cashIn._sum.amount ?? 0,
      totalCashOut: cashOut._sum.amount ?? 0,
      totalSales: sales._sum.amount ?? 0,
      totalRestocks: restocks._sum.amount ?? 0,
      totalLoans: loans._sum.amount ?? 0,
      totalReturns: returns._sum.amount ?? 0,
    },
    200,
  );
};

export { dashboardService };
