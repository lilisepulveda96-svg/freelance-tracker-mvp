import { Admin, Resource } from "react-admin";
import "./App.css";
import { authProvider } from "./providers/authProvider";

function App() {
  return (
    <Admin authProvider={authProvider}>
      <Resource name="test" />
    </Admin>
  );
}

export default App;
