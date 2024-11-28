import useTabs from "../../../../hooks/use-tabs";
import Header from "../../../ui/page/header";

import ReusableTabs from "../../../ui/resuableTabs";
import WorkAuthoriesFlow from "./work-authories-flow";
import PermitActionHistory from "./permit-action-history";
import OnsiteNotes from "./onsite-notes-comments";

export default function PermitManagementDetails({}: any) {
  const { tabs, activeTab } = useTabs([
    "PTW Details",
    "Action History",
    "Onsite Notes & Comments",
  ]);

  const counts = {
    // "All Permits": 120,
    // "Issuing Auth": 60,
    // "HSE Auth": 60,
    // "Authorizing Auth": 60,
    // "Safety Off": 60,
    // Approved: 60,
    // Rejected: 60,
  };

  return (
    <>
      <Header title="Workflow" />

      <ReusableTabs {...{ tabs, counts, className: "app-permit__tabs" }} />

      {activeTab === "PTW Details" && <WorkAuthoriesFlow />}
      {activeTab === "Action History" && <PermitActionHistory />}
      {activeTab === "Onsite Notes & Comments" && <OnsiteNotes />}
    </>
  );
}
