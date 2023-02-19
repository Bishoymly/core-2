class TypeSystem {
  init(types) {
    console.log("processing types");

    this.types = {};
    // register types by name
    for (var i = 0; i < types.length; i++) {
      const type = types[i];
      this.types[type.name] = type;
    }

    // process properties
    for (var i = 0; i < types.length; i++) {
      const type = types[i];
      type.calculatedProperties = this.getProperties(type.name);
      this.calculateUILayout(type.calculatedProperties);
    }

    for (var i = 0; i < types.length; i++) {
      const type = types[i];
      type.calculatedMethods = this.getMethods(type.name);
    }
  }

  parseMethod(methodName, code, type, isExpression) {
    let func = isExpression
      ? "(function " +
        methodName +
        "(id," +
        String(
          type.calculatedProperties
            ?.filter((p) => p.name !== "default")
            .map((p) => p.name)
        ) +
        "){ return " +
        code +
        ";})"
      : "(async function " +
        methodName +
        "(id," +
        String(
          type.calculatedProperties
            ?.filter((p) => p.name !== "default")
            .map((p) => p.name)
        ) +
        "){ " +
        code +
        "})";

    return eval(func);
  }

  createMethod(methodName, code, type, isExpression) {
    try {
      return this.parseMethod(methodName, code, type, isExpression);
    } catch (error) {
      console.warn("Error processing method " + type.name + "." + methodName);
      console.warn(error);
    }
  }

  callMethod(obj, methodName, typeName) {
    const type = this.types[typeName];
    return type.calculatedMethods[methodName]?.call(
      obj,
      obj.id,
      ...type.calculatedProperties?.map((p) => obj[p.name])
    );
  }

  hasMethod(methodName, typeName) {
    return (
      this.types[typeName]?.calculatedMethods &&
      this.types[typeName]?.calculatedMethods[methodName] !== undefined
    );
  }

  getProperties(typeName) {
    if (this.types[typeName]?.inheritFrom) {
      let props = this.getProperties(this.types[typeName].inheritFrom);
      if (this.types[typeName].properties) {
        return props.concat(this.types[typeName].properties);
      } else {
        return props;
      }
    } else {
      if (this.types[typeName]?.properties) {
        return this.types[typeName].properties;
      } else {
        return [];
      }
    }
  }

  calculateUILayout(properties) {
    let startIndex = -1;
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      property.layoutWidth = 12;
      if (!property.groupWithPreviousField) {
        if (startIndex >= 0 && i != startIndex) {
          this.setLayoutWidth(properties, startIndex, i - startIndex);
        }
        startIndex = i;
      }
    }

    if (startIndex >= 0 && startIndex != properties.length) {
      this.setLayoutWidth(
        properties,
        startIndex,
        properties.length - startIndex
      );
    }
  }

  setLayoutWidth(properties, startIndex, count) {
    if (count > 1) {
      console.log(properties);
      console.log(`start at ${startIndex} for count ${count}`);
      let layoutWidth = Math.floor(12 / count);
      for (let i = startIndex; i < startIndex + count; i++) {
        properties[i].layoutWidth = layoutWidth;
      }
    }
  }

  getMethods(typeName) {
    let type = this.types[typeName];
    let calculatedMethods = {};

    if (this.types[typeName]?.inheritFrom) {
      const inheritFrom = this.types[typeName].inheritFrom;
      const inheritFromType = this.types[inheritFrom];

      // inherit methods from parent then override them if they exist on the current type
      calculatedMethods = this.getMethods(inheritFrom);

      // inherit defaults from parent type
      for (const key in inheritFromType) {
        if (
          Object.hasOwnProperty.call(inheritFromType, key) &&
          !Object.hasOwnProperty.call(type, key)
        ) {
          const element = inheritFromType[key];
          type[key] = element;
        }
      }
    }

    // properties Expressions
    if (type.calculatedProperties) {
      const props = type.calculatedProperties.filter(
        (p) =>
          p.expression !== undefined &&
          p.expression !== null &&
          p.expression !== ""
      );
      for (const i in props) {
        const p = props[i];
        calculatedMethods[p.name + "Expression"] = this.createMethod(
          p.name + "Expression",
          p.expression,
          type,
          true
        );
      }
    }

    // displayAs
    if (
      type.displayAs !== undefined &&
      type.displayAs !== null &&
      type.displayAs !== ""
    ) {
      calculatedMethods["displayAs"] = this.createMethod(
        "displayAs",
        type.displayAs,
        type,
        true
      );
    }

    // idAs
    if (type.idAs !== undefined && type.idAs !== null && type.idAs !== "") {
      calculatedMethods["idAs"] = this.createMethod(
        "idAs",
        type.idAs,
        type,
        true
      );
    }

    // process methods
    if (type.methods) {
      for (var m = 0; m < type.methods.length; m++) {
        const method = type.methods[m];
        calculatedMethods[method.name] = this.createMethod(
          method.name,
          method.code,
          type,
          false
        );
      }
    }

    return calculatedMethods;
  }

  isOfType(typeName, isOfType) {
    if (typeName == isOfType) {
      return true;
    } else {
      let parent = this.types[typeName]?.inheritFrom;
      if (
        parent !== undefined &&
        parent !== null &&
        this.isOfType(parent, isOfType)
      ) {
        return true;
      }
    }

    return false;
  }

  autoCalculateFields(item, typeName) {
    if (Array.isArray(item)) {
      for (const i in item) {
        const record = item[i];
        this.autoCalculateFields(record, typeName);
      }
    } else {
      const type = this.types[typeName];
      if (type && type.calculatedProperties) {
        const props = type.calculatedProperties.filter(
          (p) =>
            p.expression !== undefined &&
            p.expression !== null &&
            p.expression !== ""
        );

        for (const i in props) {
          const p = props[i];

          try {
            item[p.name] = this.callMethod(
              item,
              p.name + "Expression",
              typeName
            );
          } catch (error) {
            console.warn("Error calculating " + p.name + " in ");
            console.warn(item);
            console.warn(error);
          }
        }

        const properties = type.calculatedProperties.filter(
          (p) => p.isArray !== true
        );
        for (const i in properties) {
          const p = properties[i];
          if (item[p.name]) {
            this.autoCalculateFields(item[p.name], p.type);
          }
        }
      }
    }
  }

  labelForType(typeName) {
    const display = this.types[typeName].display;
    if (display && display.trim() != "") {
      return display;
    } else {
      return this.types[typeName].name;
    }
  }

  labelFor(property) {
    if (property.display && property.display.trim() != "") {
      return property.display;
    } else {
      return property.name;
    }
  }

  display(obj, typeName) {
    if (obj) {
      if (this.hasMethod("displayAs", typeName)) {
        return this.callMethod(obj, "displayAs", typeName);
      } else if (typeof obj === "object") {
        return JSON.stringify(obj);
      } else {
        return obj.toString();
      }
    }
  }

  align(typeName) {
    if (this.types[typeName].align) {
      return this.types[typeName].align;
    } else {
      return "left";
    }
  }

  id(obj, typeName) {
    if (obj) {
      if (this.hasMethod("idAs", typeName)) {
        return this.callMethod(obj, "idAs", typeName);
      } else {
        return obj.id;
      }
    }
  }
}

module.exports = new TypeSystem();
