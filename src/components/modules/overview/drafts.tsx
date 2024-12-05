import dayjs from "dayjs";
import Icon from "../../ui/icon";
import useRequest from "../../../hooks/use-request";
import { getAllDrafts } from "../../../assets/api/user";

export default function Drafts({ drafts }) {
  const { response } = useRequest(getAllDrafts, {}, true);
  console.log(drafts);

  return (
    <div className="app-overview__drafts">
      <div className="app-overview__drafts__header">
        <Icon name="sidebar.draft" />
        <h1>Drafts</h1>

        <a href="#">
          View all
          <Icon name="diagonal-arrow" />
        </a>
      </div>

      {response?.data?.length ? (
        <>
          {response?.data?.map((draft) => (
            <div key={draft?.id} className="app-overview__draft">
              <div>
                <p>{draft.workDescription}</p>
                <span>
                  {draft?.contractor ? (
                    <>
                      {" "}
                      <strong>
                        {draft?.contractor?.firstname}{" "}
                        {draft?.contractor?.lastname}
                      </strong>{" "}
                      •{" "}
                    </>
                  ) : null}{" "}
                  {dayjs().format("DD/MM/YYYY")}
                </span>
              </div>

              <Icon name="diagonal-arrow" />
            </div>
          ))}
        </>
      ) : (
        <div className="base-empty" style={{ margin: "50px auto" }}>
          <img src="/svgs/document.svg" />
          <p>No drafts available yet</p>
        </div>
      )}
    </div>
  );
}
