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

      // process methods
      if (type.methods) {
        for (var m = 0; m < type.methods.length; m++) {
          if (m === 0) {
            type.functions = {};
          }
          const method = type.methods[i];
          try {
            let func =
              "(async function " +
              method.name +
              "(" +
              String(type.properties?.map((p) => p.name)) +
              "){ " +
              method.code +
              "})";
            type.functions[method.name] = eval(func);
          } catch (error) {
            console.warn(
              "Error processing method " + type.name + "." + method.name
            );
            console.warn(error);
          }
        }
      }
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
