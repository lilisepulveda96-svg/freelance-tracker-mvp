import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const CustomerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Name" />
      <EmailField source="email" label="Email" />
      <DateField source="created_at" label="Created At" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
