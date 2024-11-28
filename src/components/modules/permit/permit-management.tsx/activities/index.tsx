import useTabs from "../../../../../hooks/use-tabs";
import ReusableTabs from "../../../../ui/resuableTabs";
import Icon from "../../../../ui/icon";
import Header from "../../../../ui/page/header";
import PerformingAuthActivities from "./performing-auth-activities";
import IssuingAuthorities from "../workflows/issuing-authority";
import HSEAuthority from "../workflows/hse-authority";
import AuthAuthority from "../workflows/auth-authority";
import PerfAuthSupervisor from "../workflows/perf-auth-supervisor";
import { route } from "preact-router";

import SafetyOfficer from "../workflows/safety-officer";
import IssuAuthSupervisor from "../workflows/issu-auth-supervisor";

import { useIDContext } from "../../../../../context/id.context";
import { useState, useEffect } from "preact/hooks";
import { createRequest } from "../../../../../assets/api";

export default function ProcessPermitsIndex({ type: string }: any) {
  const { valueID, setID } = useIDContext();
  const id = valueID;

  const [permitDetails, setPermitDetails] = useState({});
  useEffect(() => {
    async function getPermitDetails() {
      const permitResponse = await createRequest(`/permit/${id}`, "GET");
      const permitData = permitResponse[0].data;
      setPermitDetails(permitData);
      setID(permitData.id);
    }

    getPermitDetails();
  }, [valueID]);

  const { tabs, activeTab } = useTabs([
    "Performing Auth.",
    "Issuing Auth",
    "HSE Auth",
    "Authorizing Auth",
    "Perf. Auth. Supervisor",
    "Safety Officer",
    "Issuing. Auth. Supervisor",
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

  const handleNavigate = (data) => {
    switch (data.currentAuthority) {
      case "ISSUING":
        route("/activities-process");
        break;
      case "HSE":
        route("/activities-process/hse");
        break;
      case "AUTHORIZING":
        route("/activities-process/auth");
        break;
      case "PERFORMING_SUPERVISOR":
        route("/activities-process/perf-supervisor");
        break;
      case "SAFETY_OFFICER":
        route("/activities-process/safety-officer");
        break;
      case "ISSUING_SUPERVISOR":
        route("/activities-process/issu-supervisor");
        break;
      default:
        route("/activities-process");
        break;
    }
  };
  return (
    <>
      {" "}
      <Header title="Activities" />
      <br />
      <div className={"app-permit__sections"}>
        <div className="actions">
          <div className="print">
            <div>
              <h4>Process Permit</h4>
              <p>Click the button to process / approve of this permit</p>{" "}
            </div>

            <button
              className={"flex-center"}
              onClick={() => handleNavigate(permitDetails)}
            >
              <Icon name="process" />
              Process Permit
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className={"app-authorities"}>
        <ReusableTabs
          {...{ tabs, counts, className: "app-authorities__tabs" }}
        />

        <div className="app-authorities__content">
          {activeTab === "Performing Auth." && (
            <PerformingAuthActivities response={permitDetails} />
          )}
          {activeTab === "Issuing Auth" && (
            <IssuingAuthorities response={permitDetails} />
          )}
          {activeTab === "HSE Auth" && <HSEAuthority />}
          {activeTab === "Authorizing Auth" && <AuthAuthority />}
          {activeTab === "Perf. Auth. Supervisor" && <PerfAuthSupervisor />}
          {activeTab === "Safety Officer" && <SafetyOfficer />}
          {activeTab === "Issuing. Auth. Supervisor" && <IssuAuthSupervisor />}
        </div>
      </div>
    </>
  );
}
