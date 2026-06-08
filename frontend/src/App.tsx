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

function App() {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource
        name="customers"
        list={CustomerList}
        create={CustomerCreate}
        edit={CustomerEdit}
      />
      <Resource
        name="projects"
        list={ProjectList}
        create={ProjectCreate}
        edit={ProjectEdit}
      />
    </Admin>
  );
}

export default App;
