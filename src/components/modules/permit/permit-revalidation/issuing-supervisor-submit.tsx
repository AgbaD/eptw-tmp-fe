import { useEffect, useState } from "react";
import Button from "../../../ui/button";
import { route } from "preact-router";

import { toast } from "../../../ui/toast";
import { usePermitDetails } from "../../../../context/permit-details.context";

import useRequest from "../../../../hooks/use-request";
import { approveRevalidationIssuingSupervisor } from "../../../../assets/api/permit";

import { useIssuingSupervisorRevalidationContext } from "../../../../context/issuing-supervisor-revalidation-context";

export default function IssuingRevalidationSubmit() {
  const { state } = useIssuingSupervisorRevalidationContext();
  const { makeRequest } = useRequest(approveRevalidationIssuingSupervisor);

  const [loading, setLoading] = useState(false);

  const { permit } = usePermitDetails();
  useEffect(() => {
    async function submitForm() {
      setLoading(true);
      const payload = {
        permitId: permit?.id,
        revalidateWorkAreaConfirmation:
          state.context.verification?.revalidateWorkAreaConfirmation,
        toolBoxLeaderIdentity:
          state.context.tool_kit_time?.toolBoxLeaderIdentity,
        toolBoxPosition: state.context.tool_kit_time?.toolBoxPosition,
        issuingAuthoritySupervisorTimeAdjustment:
          state.context.tool_kit_time?.startTime === "" ? false : true,
        startTime:
          //   state.context.tool_kit_time?.startTime
          "1970-01-01T00:00:00Z",

        // formatDateForBackend(
        //     state.context.tool_kit_time?.startTime || ""
        //   )
        documents: {
          toolBoxStockDocType: "MANUAL",
          toolBoxStockDoc: "...",
          radiographyCertType: "MANUAL",
          radiographyCert: "...",
          confinedSpaceCertType: "MANUAL",
          confinedSpaceCert: "...",
          gasTestingCertType: "MANUAL",
          gasTestingCert: "...",
        },
      };

      const [_, error] = await makeRequest(payload);
      if (error) {
        setLoading(false);
        return toast({
          variant: "error",
          message:
            error.message ??
            "Failed to revalidate this permit, please try again",
        });
      }
      route("/permit-activities");
      toast({
        variant: "success",
        message: "Permit Revalidation successful",
      });
      setLoading(false);
    }

    submitForm();
  }, [state]);

  return (
    <div className="app-register__form">
      {loading ? (
        <>
          <div className="app-submit-screen">
            <div className="">
              <div className="flex center">
                <img src="/svgs/successful.svg" />
              </div>

              <div className="flex-center">
                <div className="">
                  <p>Approving Permit ....</p>
                  <span>Please be patient as we approve this permit.</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="app-submit-screen">
            <div className="">
              <div className="flex center">
                <img src="/svgs/successful.svg" />
              </div>

              <div className="flex-center">
                <div className="">
                  <p>Permit Approved</p>
                  <span>You have successfully approved this permit.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="app-submit-screen">
            <div className="app-register__form-footer">
              <Button
                variant="tertiary"
                type="button"
                onClick={() => route("/process-permits")}
              >
                Home
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={() => route("/process-permits")}
              >
                View Permit
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
