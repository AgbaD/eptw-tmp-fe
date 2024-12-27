import "../../../index.scss";
import "../../../../registration/index.scss";

import { RoleProvider } from "../../../../../../context/role.context";

import { Link } from "preact-router";

import { capitalize } from "../../../../../../assets/utils";
import UpdateTimeDate from "./adjust-time-date";
import Button from "../../../../../ui/button";
import { useState } from "preact/hooks";

import {
  PermitProvider,
  useAuthorizingActivityContext,
} from "../../../../../../context/authorizing-activity-context";
import AuthWorkHazards from "./authorizing-auth/work-hazards";
import AuthPersonalProtectiveEquipment from "./authorizing-auth/auth-personal-protective";
import AuthFireFightingEquipment from "./authorizing-auth/auth-firefighting";
import AuthDocuments from "./authorizing-auth/auth-document-uploads";
import AuthFinalUpload from "./authorizing-auth/auth-final-upload";
import AuthMechanicalIsolation from "./authorizing-auth/auth-mechanical-isolation";
import AuthElectricalIsolation from "./authorizing-auth/auth-electrical";
import AuthProcessSubmit from "./auth-submit";
import ViewPermitDetails from "./view-permit-details";
function Module() {
  const { state } = useAuthorizingActivityContext();
  const stateAsString = state.toStrings()[0];
  const currentIdx = STEPS.indexOf(stateAsString) + 1;

  const stateMeta = STEPS.includes(stateAsString)
    ? { title: capitalize(stateAsString.replace("_", " ")) }
    : null;

  const [isModalOpen, setModalOpen] = useState(false);

  const handleViewPermitDetails = (value: boolean) => {
    setModalOpen(value);
    console.log(isModalOpen);
  };
  return (
    <div className="app-create-permit app-register">
      <div className="app-register__nav-wrapper app-container-wrapper">
        <div className="app-container app-register__nav">
          <Link href="/">
            <img
              src="/svgs/logo.eptw.svg"
              alt="eptw_logo"
              className={"permit-logo"}
            />
          </Link>

          <h5>Process Permit</h5>

          <div className="">
            <Button
              variant="purple"
              onClick={() => handleViewPermitDetails(true)}
            >
              Permit Details
            </Button>
          </div>
        </div>
      </div>

      <div className="app-register__content-wrapper app-container-wrapper ">
        <div className="app-register__content app-container">
          {!state.matches("submit") && (
            <>
              <div className="app-register__content__header app-create-permit__header">
                <h3>
                  {stateMeta?.title
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <p>
                  Step {currentIdx} of {STEPS.length - 1}
                </p>
              </div>
              <div className="app-register__progress-bar">
                <span
                  style={{
                    width: `${(currentIdx / STEPS.length - 1) * 100}%`,
                  }}
                ></span>
              </div>
            </>
          )}

          {state.matches("work_hazards") && <AuthWorkHazards />}
          {state.matches("personal_protective_equipment") && (
            <AuthPersonalProtectiveEquipment />
          )}
          {state.matches("firefighting_equipment") && (
            <AuthFireFightingEquipment />
          )}
          {state.matches("selected_documents") && <AuthDocuments />}
          {state.matches("document_uploads") && <AuthFinalUpload />}
          {state.matches("mechanical_precaution") && (
            <AuthMechanicalIsolation />
          )}
          {state.matches("electrical_precaution") && (
            <AuthElectricalIsolation />
          )}
          {state.matches("adjust_date_time") && <UpdateTimeDate />}
          {state.matches("submit") && <AuthProcessSubmit />}
        </div>

        <img src="/svgs/auth-blur.svg" alt="auth-blur" />
      </div>

      <div className="">
        {isModalOpen && (
          <ViewPermitDetails setModalOpen={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
}

const STEPS = [
  "work_hazards",
  "personal_protective_equipment",
  "firefighting_equipment",
  "selected_documents",
  "document_uploads",
  "mechanical_precaution",
  "electrical_precaution",
  "adjust_date_time",
  "submit",
];

export default function ProcessAuthorizingPermit({}: any) {
  return (
    <PermitProvider>
      <RoleProvider>
        <Module />
      </RoleProvider>
    </PermitProvider>
  );
}

export const ROLE_CONFIG = {
  authorizingAuth: [
    "work_hazards",
    "personal_protective_equipment",
    "firefighting_equipment",
    "selected_documents",
    "document_uploads",
    "mechanical_precaution",
    "electrical_precaution",
    "adjust_date_time",
    "submit",
  ],
};
