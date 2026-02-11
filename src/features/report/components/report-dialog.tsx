"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ReportService } from "../services/report-service";
import { toast } from "sonner";
import { cn } from "@/shared/utils";
import { ReportType } from "../models/report-type";
import { ReportTypeLabels } from "../models/report-type-labels";
import { Report } from "../models/report";

interface ReportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    targetId: number;
    targetType:  "post" | "comment" | "user";
}

export function ReportDialog({ 
    isOpen, 
    onOpenChange, 
    targetId, 
    targetType 
}: ReportDialogProps) {
    const [selectedType, setSelectedType] = useState<ReportType | null>(null);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getTargetText = () => {
        switch (targetType) {
            case 'post': return 'bài viết';
            case 'comment': return 'bình luận';
            case 'user': return 'người dùng';
            default: return 'nội dung';
        }
    };

    const handleSubmit = async () => {
        if (!selectedType) {
            toast.error("Vui lòng chọn loại báo cáo");
            return;
        }

        try {
            setIsSubmitting(true);
            const reportPayload : Report = {
                description : reason,
                reportType : selectedType,
                reportedEntityId : targetId,
                reportedEntityType : targetType
            }
            
            await ReportService.createReport(reportPayload);
            
            toast.success("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ sớm xem xét.");
            onOpenChange(false);
            // Reset state
            setSelectedType(null);
            setReason("");
        } catch (error) {
            toast.error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Báo cáo</DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Tại sao bạn báo cáo {getTargetText()} này?
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-4">
                    {(Object.keys(ReportTypeLabels) as ReportType[]).map((type) => (
                        <div 
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50",
                                selectedType === type ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200"
                            )}
                        >
                            <Label className="cursor-pointer font-medium">
                                {ReportTypeLabels[type]}
                            </Label>
                            <div className={cn(
                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                selectedType === type ? "border-blue-500" : "border-gray-300"
                            )}>
                                {selectedType === type && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                        </div>
                    ))}

                    {selectedType === ReportType.OTHER && (
                        <div className="mt-2 space-y-2">
                            <Label htmlFor="reason">Lý do chi tiết (tùy chọn)</Label>
                            <Textarea
                                id="reason"
                                placeholder="Nhập thêm lý do báo cáo..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!selectedType || isSubmitting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
