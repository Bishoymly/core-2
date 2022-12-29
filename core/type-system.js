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
        "(type,id," +
        String(type.properties?.map((p) => p.name)) +
        "){ return " +
        code +
        ";})"
      : "(async function " +
        methodName +
        "(type,id," +
        String(type.properties?.map((p) => p.name)) +
        "){ " +
        code +
        "})";

    return eval(func);
  }

  createMethod(methodName, code, type, isExpression) {
    try {
      return this.parseMethod(
        methodName,
        code,
        type,
        isExpression
      );
    } catch (error) {
      console.warn("Error processing method " + type.name + "." + methodName);
      console.warn(error);
    }
  }

  callMethod(obj, methodName, typeName) {
    const type = this.types[typeName];
    return type.calculatedMethods[methodName]?.call(
      obj,
      typeName,
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

  getMethods(typeName) {
    let type = this.types[typeName];
    let calculatedMethods = {};

    if (this.types[typeName]?.inheritFrom) {
      // inherit methods from parent then override them if they exist on the current type
      calculatedMethods = this.getMethods(this.types[typeName].inheritFrom);
    }

    // properties Expressions
    if (type.properties) {
      const props = type.properties.filter(
        (p) =>
          p.expression !== undefined &&
          p.expression !== null &&
          p.expression !== ""
      );
      for (const i in props) {
        const p = props[i];
        calculatedMethods[p.name] = this.createMethod(p.name + "Expression", p.expression, type, true);
      }
    }

    // displayAs
    if (
      type.displayAs !== undefined &&
      type.displayAs !== null &&
      type.displayAs !== ""
    ) {
      calculatedMethods["displayAs"] = this.createMethod("displayAs", type.displayAs, type, true);
    }

    // idAs
    if (
      type.idAs !== undefined &&
      type.idAs !== null &&
      type.idAs !== ""
    ) {
      calculatedMethods["idAs"] = this.createMethod("idAs", type.idAs, type, true);
    }

    // process methods
    if (type.methods) {
      for (var m = 0; m < type.methods.length; m++) {
        const method = type.methods[i];
        calculatedMethods[method.name] = this.createMethod(method.name, method.code, type, false);
      }
    }

    return calculatedMethods;
  }

  isOfType(typeName, isOfType){
    if(typeName == isOfType)
    {
      return true;
    }
    else{
      let parent = this.types[typeName]?.inheritFrom;
      if(parent !== undefined && parent !== null && this.isOfType(parent, isOfType)){
        return true;
      }
    }

    return false;
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

  id(obj, typeName){
    if(obj){
      if (this.hasMethod("idAs", typeName)) {
        return this.callMethod(obj, "idAs", typeName);
      } else {
        return obj.id;
      }
    }
  }
}

module.exports = new TypeSystem();
