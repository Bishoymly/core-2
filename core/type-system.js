class TypeSystem {
  init(types) {
    console.log("processing types");

    this.types = {};
    // register types by name
    for (var i = 0; i < types.length; i++) {
      const type = types[i];
      this.types[type.name] = type;
    }

    // TODO: sort by inheritance dependencies

    // process properties
    for (var i = 0; i < types.length; i++) {
      const type = types[i];
    }

    for (var i = 0; i < types.length; i++) {
      const type = types[i];
      type.functions = {};

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
          this.createMethod(p.name + "Expression", p.expression, type, true);
        }
      }

      // displayAs
      if (
        type.displayAs !== undefined &&
        type.displayAs !== null &&
        type.displayAs !== ""
      ) {
        this.createMethod("displayAs", type.displayAs, type, true);
      }

      // process methods
      if (type.methods) {
        for (var m = 0; m < type.methods.length; m++) {
          const method = type.methods[i];
          this.createMethod(method.name, method.code, type, false);
        }
      }
    }
  }

  parseMethod(methodName, code, type, isExpression) {
    let func = isExpression
      ? "(function " +
        methodName +
        "(" +
        String(type.properties?.map((p) => p.name)) +
        "){ return " +
        code +
        ";})"
      : "(async function " +
        methodName +
        "(" +
        String(type.properties?.map((p) => p.name)) +
        "){ " +
        code +
        "})";

    return eval(func);
  }

  createMethod(methodName, code, type, isExpression) {
    try {
      type.functions[methodName] = this.parseMethod(
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
    return type.functions[methodName]?.call(
      obj,
      ...type.properties?.map((p) => obj[p.name])
    );
  }

  hasMethod(methodName, typeName) {
    return (
      this.types[typeName]?.functions &&
      this.types[typeName]?.functions[methodName] !== undefined
    );
  }
}

module.exports = new TypeSystem();
