import { Link, useRouter } from "preact-router";
import Match from "preact-router/match";
import Icon from "../icon";
import { useUserContext } from "../../../context/user.context";

export default function Sidebar() {
  // const { profile } = useUserContext();

  return (
    <div className="app-layout__sidebar">
      <div className="app-layout__sidebar__logo">
        <img src="/svgs/logo.sidebar.svg" />
      </div>

      <div className="app-layout__sidebar__nav">
        {/* <div className="app-layout__sidebar__nav__profile">
          <div className="avatar">{profile.firstname[0]}</div>
          <div className="text">
            <p>
              {profile.firstname} {profile.lastname}
            </p>
            <p>{profile.email}</p>
          </div>
        </div> */}

        {ROUTES.map((group) => (
          <div className="app-layout__sidebar__nav__links">
            {group.title ? <p>{group.title}</p> : null}

            {group.pages.map((page) => (
              <NavLink {...{ page }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavLink({ page }) {
  const [{ url }] = useRouter();
  const { logout } = useUserContext();
  const isHomePage = page.path === "/";

  if (!page.path) {
    return (
      <button onClick={logout}>
        <div className="icons-container">
          <div className="icons">
            <Icon name={page.iconName} />
            <Icon name={page.iconName} />
          </div>
        </div>
        {page.label}
      </button>
    );
  }

  return (
    <Match path={page.path}>
      {({ matches }: any) => (
        <Link
          className={
            matches || (url.startsWith(page.path) && !isHomePage)
              ? "active"
              : "inactive"
          }
          href={page.path}
        >
          <div className="icons-container">
            <div className="icons">
              <Icon name={page.iconName} />
              <Icon name={page.iconName} />
            </div>
          </div>

          {page.label}
        </Link>
      )}
    </Match>
  );
}

const ROUTES = [
  {
    title: "",
    pages: [
      {
        path: "/",
        label: "Overview",
        iconName: "sidebar.overview",
      },
      {
        path: "/auditories",
        label: "Audits",
        iconName: "sidebar.activity",
      },
      {
        path: "/analytics",
        label: "Analytics & Reports",
        iconName: "sidebar.reports",
      },
    ],
  },
  {
    title: "Permit Management",
    pages: [
      // {
      //   path: "/permit-management",
      //   label: "Permit Approvals",
      //   iconName: "sidebar.permit",
      // },
      // {
      //   path: "/permit-renewals",
      //   label: "Permit Renewals",
      //   iconName: "sidebar.permit-renewals",
      // },
      // {
      //   path: "/permit-suspensions",
      //   label: "Work Suspension",
      //   iconName: "sidebar.work-suspension",
      // },
      // {
      //   path: "/permit-completions",
      //   label: "Work Completion",
      //   iconName: "sidebar.work-completion",
      // },
      {
        path: "/permit-drafts",
        label: "Drafts",
        iconName: "sidebar.draft",
      },
      {
        path: "/permit-workflows",
        label: "Workflow",
        iconName: "sidebar.permit",
      },
      {
        path: "/permit-activities",
        label: "Activities",
        iconName: "sidebar.permit-renewals",
      },
      {
        path: "/permit-monitoring",
        label: "Monitoring",
        iconName: "sidebar.work-suspension",
      },
      {
        path: "/permit-storage",
        label: "Storage",
        iconName: "sidebar.work-completion",
      },
    ],
  },
  {
    title: "User Management",
    pages: [
      {
        path: "/roles",
        label: "Roles & Permissions",
        iconName: "sidebar.roles",
      },
      {
        path: "/locations",
        label: "Locations",
        iconName: "sidebar.location",
      },
      {
        path: "/users",
        label: "Users",
        iconName: "sidebar.users",
      },
    ],
  },
  {
    title: "",
    pages: [
      {
        path: "/profile",
        label: "Profile",
        iconName: "sidebar.profile",
      },
      {
        path: "",
        label: "Logout",
        iconName: "sidebar.logout",
      },
    ],
  },
] as const;
