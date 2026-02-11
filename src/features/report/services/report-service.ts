import api from "@/shared/configs/axios.config";
import { PageResponse } from "@/shared/models/page-response";
import { Report } from "../models/report";

export class ReportService {
   
    public static async createReport(report : Report) : Promise<Report> {
        try {
            const response = await api.post("/reports", report);
            return response.data;
        } catch (error) {
            throw error ; 
        }
    }

    public static async getMyReports(page: number, limit: number) : Promise<PageResponse<Report>> {
        try {
            const response = await api.get("/reports/my-reports", {
                params: {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            throw error ;
        }
    }

}
