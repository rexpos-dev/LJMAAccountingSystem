import { ToAuditReport } from "./to-audit-report";
import { useDialog } from "../layout/dialog-provider";

export function ToAuditReportDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <ToAuditReport />
    );
}
