import { Edit, SimpleForm, TextInput, required, email } from "react-admin";

export const CustomerEdit = () => (
  <Edit redirect="list">
    <SimpleForm>
      <TextInput source="name" label="Name" validate={required()} />
      <TextInput source="email" label="Email" validate={email()} />
    </SimpleForm>
  </Edit>
);
