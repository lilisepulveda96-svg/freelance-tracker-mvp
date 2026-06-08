import { Admin, Resource, ListGuesser } from "react-admin";
import "./App.css";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

function App() {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="customers" list={ListGuesser} />
      <Resource name="projects" list={ListGuesser} />
    </Admin>
  );
}

export default App;
