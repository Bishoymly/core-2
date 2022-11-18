import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CoreEntity from "./components/coreEntity";
import DashboardContent from "./components/dashboard";

const theme = createTheme();
const type = {
  name: "address",
  display: "Address",
  type: "Object",
  api: "CRUD",
  properties: [
    {
      name: "street",
      display: "Street Line 1",
      type: "String",
      default: "",
      example: "123 Main Street",
      required: true,
    },
    {
      name: "street2",
      display: "Street Line 2",
      type: "String",
    },
    {
      name: "city",
      display: "City",
      type: "String",
      default: "",
      example: "New York",
      required: true,
    },
    {
      name: "state",
      display: "State",
      type: "state",
      default: "",
      example: "NY",
      required: true,
      allowMultiSelect: false,
    },
    {
      name: "zipCode",
      display: "Zip Code",
      type: "Number",
      default: "",
      example: "10030",
      required: true,
    },
    {
      name: "dateCreated",
      display: "Date Created",
      type: "Date",
      default: "",
      required: true,
    },
  ],
  displayAs: "{street1}{street2}, {city}, {state.code} {zipCode}",
};

export default function Main() {
  return <DashboardContent type={type}></DashboardContent>;
}
