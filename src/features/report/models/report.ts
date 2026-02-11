import { ReportStatus } from "./report-status";
import { ReportType } from "./report-type";

export interface Report {
    id ? : number;
    reporterId? : number;
    reporterUsername? : string;
    status ?: ReportStatus;
    createdAt ?: string;
    
    description : string;
    reportType? : ReportType;
    reportedEntityId? : number;
    reportedEntityType? : "post" | "comment" | "user";
}

export { ReportType };
