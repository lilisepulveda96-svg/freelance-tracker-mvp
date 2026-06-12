import { Admin, Resource } from "react-admin";
import "./App.css";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { CustomerList } from "./resources/customers/CustomerList";
import { CustomerCreate } from "./resources/customers/CustomerCreate";
import { CustomerEdit } from "./resources/customers/CustomerEdit";
import { ProjectList } from "./resources/projects/ProjectList";
import { ProjectCreate } from "./resources/projects/ProjectCreate";
import { ProjectEdit } from "./resources/projects/ProjectEdit";
import { TrackerPage } from "./resources/time-logs/TrackerPage";
import TimerIcon from "@mui/icons-material/Timer";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import { Dashboard } from "./resources/dashboard-metrics/Dashboard";
import { darkTheme, lightTheme } from "./theme/theme";

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
      theme={lightTheme}
      darkTheme={darkTheme}
    >
      <Resource
        name="customers"
        list={CustomerList}
        create={CustomerCreate}
        edit={CustomerEdit}
        icon={PeopleIcon}
      />
      <Resource
        name="projects"
        list={ProjectList}
        create={ProjectCreate}
        edit={ProjectEdit}
        icon={FolderIcon}
      />
      <Resource name="time-logs" list={TrackerPage} icon={TimerIcon} />
    </Admin>
  );
}

export default App;
