import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { Report } from "../models/report";

export class ReportService {
   
    public static async createReport(report : Report) : Promise<Report> {
        const response = await api.post("/reports", report);
        return response.data;
    }

    public static async getMyReports(page: number, limit: number) : Promise<PageResponse<Report>> {
        const response = await api.get("/reports/my-reports", {
            params: {
                page,
                limit
            }
        });
        return response.data;
    }

    public static async deleteReport(id: number) : Promise<void> {
        await api.delete(`/reports/${id}`);
    }

    public static async updateReport(report: Report) : Promise<Report> {
        const response = await api.put("/reports", report);
        return response.data;
    }

    public static async getAllReports(
        page: number, 
        limit: number, 
        keyword?: string,
        type?: string,
        status?: string
    ) : Promise<PageResponse<Report>> {
        const response = await api.get("/reports", {
            params: {
                page,
                limit,
                ...(keyword && { keyword }),
                ...(type && { type }),
                ...(status && { status })
            }
        });
        return response.data;
    }
}
