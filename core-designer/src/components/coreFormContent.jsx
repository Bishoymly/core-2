import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { FormHelperText, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import InlineGrid from "./inlineGrid";
import Components from "../fields/Components";
import InlineFormList from "./inlineFormList";
import typeSystem from "core/type-system";

export default function CoreFormContent({
  prefix,
  mode,
  validationErrors,
  defaultValue,
  type,
  onChange,
}) {
  const [value, setValue] = useState(defaultValue ?? {});

  const handleValueChange = (p, v) => {
    let newValue = { ...value };
    newValue[p] = v;
    setValue(newValue);
    if (onChange) onChange(newValue);
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
                {p.display}
              </Typography>
              <FormHelperText>{p.helpText}</FormHelperText>
              {p.isArray ? (
                typeSystem.isOfType(p.type, "Object") ? (
                  <InlineGrid
                    type={t}
                    property={p}
                    data={value[p.name] ?? []}
                    onChange={(e) => handleValueChange(p.name, e)}
                  ></InlineGrid>
                ) : (
                  <InlineFormList
                    type={t}
                    property={p}
                    data={value[p.name] ?? []}
                    onChange={(e) => handleValueChange(p.name, e)}
                  ></InlineFormList>
                )
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
