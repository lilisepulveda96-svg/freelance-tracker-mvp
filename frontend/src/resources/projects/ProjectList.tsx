import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  EditButton,
  DeleteButton,
  SelectField,
} from "react-admin";

const statusChoices = [
  { id: "active", name: "Active" },
  { id: "paused", name: "Paused" },
  { id: "completed", name: "Completed" },
  { id: "archived", name: "Archived" },
];

export const ProjectList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Name" />
      <ReferenceField
        source="customer_id"
        reference="customers"
        label="Customer"
      >
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="status" label="Status" choices={statusChoices} />
      <NumberField
        source="hourly_rate"
        label="Hourly Rate"
        options={{ style: "currency", currency: "USD" }}
      />
      <DateField source="created_at" label="Created At" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
