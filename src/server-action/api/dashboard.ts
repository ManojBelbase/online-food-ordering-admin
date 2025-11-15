import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../config/ApiGateway";

export type DashboardPeriod = "today" | "week" | "month" | "all";

export interface DashboardResponse {
  success: boolean;
  period: string;
  data: {
    overview: {
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      totalFoodItems: number;
      totalCategories: number;
    };
    revenue: {
      today: number;
      thisWeek: number;
      thisMonth: number;
      lastMonth: number;
      growth: {
        percentage: number;
        isPositive: boolean;
      };
    };
    orders: {
      today: number;
      thisWeek: number;
      thisMonth: number;
      lastMonth: number;
      growth: {
        percentage: number;
        isPositive: boolean;
      };
      byStatus: {
        pending?: number;
        accepted?: number;
        preparing?: number;
        ready?: number;
        completed?: number;
        cancelled?: number;
      };
    };
    topSellingItems: Array<{
      _id: string;
      name: string;
      image: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }>;
    paymentMethods: Array<{
      method: string;
      count: number;
      revenue: number;
    }>;
    trends: {
      dailyRevenue: Array<{
        date: string;
        revenue: number;
        orderCount: number;
      }>;
      hourlyDistribution: Array<{
        hour: number;
        orderCount: number;
        revenue: number;
      }>;
    };
    categoryPerformance: Array<{
      categoryId: string;
      categoryName: string;
      totalQuantity: number;
      totalRevenue: number;
      orderCount: number;
    }>;
    recentOrders: Array<{
      orderId: string;
      customerName: string;
      customerEmail: string;
      totalAmount: number;
      orderStatus: string;
      paymentMethod: string;
      itemCount: number;
      createdAt: string;
    }>;
  };
}

export const useDashboardData = (period: DashboardPeriod = "all", enabled: boolean = true) => {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: async () => {
      const response = await apiClient.get<DashboardResponse>(
        "/restaurant/dashboard",
        {
          params: { period },
        }
      );
      return response.data;
    },
    enabled,
    staleTime: 30000, // Cache for 30 seconds
  });
};

