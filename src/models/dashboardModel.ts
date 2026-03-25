export type DashboardResponse = {
  totalCashIn: number;
  totalCashOut: number;
  totalSales: number;
  totalRestocks: number;
  totalLoans: number;
  totalReturns: number;
};

export type DashboardParams = {
  startDate: string;
  endDate: string;
};
