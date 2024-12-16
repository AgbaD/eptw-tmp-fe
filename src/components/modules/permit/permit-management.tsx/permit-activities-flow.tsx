import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "../../../ui/dropdown";
import Header from "../../../ui/page/header";
import Search from "../../../ui/page/search";
import Button from "../../../ui/button";

import { useState } from "preact/hooks";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "../../../ui/table";

import { useIDContext } from "../../../../context/id.context";

import useRequest from "../../../../hooks/use-request";
import { route } from "preact-router";
import { getAllPermits } from "../../../../assets/api/user";
import { useUserContext } from "../../../../context/user.context";

export default function ActivitiesFlow({}: any) {
  const [selectedWorkType, setSelectedWorkType] = useState("All Work Types");
  const work_types = ["All Work Types", "COLD_WORK", "HOT_WORK"];

  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const statusOptions = [
    "All Status",
    "NOT_STARTED",
    "REVALIDATION_INITIATED",
    "CLOSURE_INITIATED",
  ];

  const { setID } = useIDContext();
  const { profile } = useUserContext();

  const { response, isLoading } = useRequest(getAllPermits, {}, true);

  const handleItemClick = (item) => {
    setID(item.id);

    route("/process-permits");
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const [searchTerm, setSearchTerm] = useState("");

  const activities = response?.data || [];

  const filteredActivities = activities.filter((permit) => {
    const ptwID = permit.publicId;
    const type = permit.type;
    const workArea = permit.workArea?.toLowerCase() || "";
    const entrustedCompany = permit.entrustedCompany?.name.toLowerCase() || "";

    // Apply filters for searchTerm, selectedLocation, and selectedWorkType
    const matchesSearchTerm =
      ptwID.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      workArea.includes(searchTerm.toLowerCase()) ||
      entrustedCompany.includes(searchTerm.toLowerCase()) ||
      searchTerm === "";

    const matchesWorkType =
      selectedWorkType === "All Work Types" || permit.type === selectedWorkType;

    const matchesStatus =
      selectedStatus === "All Status" || permit.status === selectedStatus;

    const matchesProfileAndAuthority =
      profile?.id &&
      permit.permitRoles?.[profile.id] &&
      permit.permitRoles[profile.id] === permit.currentAuthority;

    return (
      matchesSearchTerm &&
      matchesWorkType &&
      matchesStatus &&
      matchesProfileAndAuthority
    );
  });

  return (
    <>
      <Header title="Activities" />

      <div className="app-section__header">
        <Search placeholder="Search" onSearch={setSearchTerm} />
        <br />

        <div className="app-section__filters ">
          <span className="base-date-filter--secondary">Filter by:</span>
          <div className="sm-grid-cols-2 app-section__filters">
            <Dropdown className="base-dropdown__dropdown-wrapper">
              <DropdownTrigger>{selectedStatus}</DropdownTrigger>
              <DropdownContent>
                {statusOptions.map((status) => (
                  <div
                    key={status}
                    className={"base-dropdown__option"}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </div>
                ))}
              </DropdownContent>
            </Dropdown>

            <Dropdown className="base-dropdown__dropdown-wrapper">
              <DropdownTrigger>{selectedWorkType}</DropdownTrigger>
              <DropdownContent>
                {work_types.map((type) => (
                  <div
                    key={type}
                    className={"base-dropdown__option"}
                    onClick={() => setSelectedWorkType(type)}
                  >
                    {type}
                  </div>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="app-section">
        <div className="app-section__lg-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PTW ID.</TableCell>
                <TableCell>Work Type</TableCell>
                <TableCell>Work To Be Performed</TableCell>
                <TableCell>Work Location</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status / Authority</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredActivities
                .filter(
                  (data) =>
                    data.status !== "CLOSED" &&
                    data.status !== "CANCELED" &&
                    data.status !== "APPROVED"
                )
                .map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.publicId}</TableCell>
                    <TableCell>{data.type}</TableCell>

                    <TableCell>
                      {truncateText(data.workDescription, 45)}
                    </TableCell>
                    <TableCell>
                      <span>
                        {data.workArea} / {data.location?.locationArea}
                      </span>
                    </TableCell>
                    <TableCell>{data.entrustedCompany?.name}</TableCell>
                    <TableCell>
                      <h6
                        className={`${
                          data.status === "Draft"
                            ? "draft-status"
                            : "others-status"
                        }`}
                      >
                        {data.status} / {data.currentAuthority}
                      </h6>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleItemClick(data)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="app-section__sm-table">
          <Table>
            <TableBody>
              {filteredActivities
                .filter(
                  (data) =>
                    data.status !== "CLOSED" &&
                    data.status !== "CANCELED" &&
                    data.status !== "APPROVED"
                )
                .map((dataItem) => (
                  <div
                    key={dataItem.id}
                    className="container"
                    onClick={() => handleItemClick(dataItem)}
                  >
                    <div
                      className="location-flex"
                      onClick={() => handleItemClick(dataItem)}
                    >
                      <p>{dataItem.publicId}</p>
                      <h6 className={"gray"}>{dataItem.type}</h6>
                    </div>
                    <p>{truncateText(dataItem.workDescription, 45)}</p>
                    <div className="location-flex">
                      <div className="items-center">
                        <p className={"gray"}>Status / Authority:</p>
                        <h6
                          className={` ${
                            dataItem.status === "Draft"
                              ? "draft-status"
                              : "others-status"
                          }`}
                        >
                          {dataItem.status} / {dataItem.currentAuthority}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
            </TableBody>
          </Table>
        </div>

        {!filteredActivities.length && (
          <div className="base-empty">
            <img src="/svgs/document.svg" />
            <p>
              {isLoading
                ? "Fetching permits, please wait..."
                : "No permits yet"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
