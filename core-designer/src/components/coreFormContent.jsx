import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { FormHelperText, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import InlineGrid from "./inlineGrid";
import Components from "../fields/Components";
import typeSystem from "core/type-system";
import produce from "immer";

export default function CoreFormContent({
  prefix,
  mode,
  validationErrors,
  defaultValue,
  type,
  onChange,
}) {
  const [value, setValue] = useState(defaultValue ?? {});

  const handleValueChange = async (p, v) => {
    const newValue = produce(value, (val) => {
      val[p] = v;
      typeSystem.autoCalculateFields(val, type.name);
    });

    if (newValue !== value) {
      setValue(newValue);
      onChange(newValue);
    }
  };

  const renderProperty = (property) => {
    const t = typeSystem.types[property.type];

    let p = property;
    if (t) {
      p = calculatePropertyFromType(property, t);
      if (typeSystem.isOfType(p.type, "Object") || p.isArray) {
        return (
          <Grid container item key={prefix + p.name}>
            <Stack width={"100%"}>
              <Typography component="h2" variant="h6" gutterBottom>
                {typeSystem.labelFor(p)}
              </Typography>
              <FormHelperText>{p.helpText}</FormHelperText>
              {p.isArray ? (
                <InlineGrid
                  type={t}
                  property={p}
                  validationErrors={validationErrors}
                  defaultData={value[p.name] ?? []}
                  onChange={(e) => handleValueChange(p.name, e)}
                ></InlineGrid>
              ) : (
                <CoreFormContent
                  type={t}
                  mode={mode}
                  defaultValue={p.name === "" ? value : value[p.name] ?? {}}
                  prefix={prefix + p.name + "."}
                  validationErrors={validationErrors}
                  onChange={(e) => handleValueChange(p.name, e)}
                ></CoreFormContent>
              )}
            </Stack>
          </Grid>
        );
      }
    }

    const control = calculateUIControl(p);
    return React.createElement(Components[control], {
      key: prefix + p.name,
      value: p.name === "" ? value : value[p.name],
      error: validationErrors[prefix + p.name],
      property: p,
      onChange: (e) => handleValueChange(p.name, e),
    });
  };

  const calculateUIControl = (property) => {
    if (property.uiControl && property.uiControl !== "") {
      return property.uiControl;
    }

    switch (property.type) {
      case "String":
        return "Text";
      case "Number":
        return "Number";
      case "Date":
        return "DatePicker";
      case "Boolean":
        return "Checkbox";
      default:
        return "Text";
    }
  };

  const calculatePropertyFromType = (p, t) => {
    const result = {};
    for (const key in t) {
      result[key] = t[key];
    }
    for (const key in p) {
      result[key] = p[key];
    }

    return result;
  };

  return (
    <Grid container item spacing={2}>
      {type.calculatedProperties && type.calculatedProperties.length > 0
        ? type.calculatedProperties
            .filter((p) => p.hideFromForm !== true)
            .map((p) => renderProperty(p))
        : renderProperty({
            name: "",
            display: "",
            type: type,
          })}
    </Grid>
  );
}
