import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  required,
  number,
  minValue,
} from "react-admin";
import { Box } from "@mui/material";

const statusChoices = [
  { id: "active", name: "Active" },
  { id: "paused", name: "Paused" },
  { id: "completed", name: "Completed" },
  { id: "archived", name: "Archived" },
];

export const ProjectEdit = () => (
  <Edit redirect="list">
    <SimpleForm>
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <TextInput
          source="name"
          label="Name"
          validate={required("Required")}
          helperText="e.g. Website Redesign"
          sx={{ flex: 7 }}
        />
        <ReferenceInput source="customer_id" reference="customers">
          <SelectInput
            label="Customer"
            optionText="name"
            helperText="Optional"
            sx={{ flex: 3 }}
          />
        </ReferenceInput>
      </Box>
      <TextInput
        source="description"
        label="Description"
        multiline
        rows={3}
        helperText="Optional"
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <NumberInput
          source="hourly_rate"
          label="Hourly Rate (USD)"
          validate={[
            number("Invalid"),
            minValue(0, "Min 0"),
            required("Required"),
          ]}
          helperText="e.g. 75"
          sx={{ flex: 7 }}
        />
        <SelectInput
          source="status"
          label="Status"
          choices={statusChoices}
          sx={{ flex: 3 }}
        />
      </Box>
    </SimpleForm>
  </Edit>
);
