import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { DashboardParams } from "../models/dashboardModel";
import { dashboardService } from "../services/dashboardService";

const dashboardController = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    } as DashboardParams;

    const response = dashboardService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

export { dashboardController };
