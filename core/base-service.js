const typeSystem = require("./type-system");

class BaseService {
  constructor(types) {
    this.types = types;
  }

  async json(type, req, res, item) {
    await this.autoCalculateFields(item, type);
    this.hideFields(item);
    res.json(item);
  }

  async validate(item, type, prefix) {
    const t = this.types.find((t) => t.name === type);
    let errors = [];
    if (t && t.properties) {
      t.properties
        .filter((p) => p.required === true)
        .forEach((p) => {
          if (
            item[p.name] === undefined ||
            item[p.name] === null ||
            item[p.name] === ""
          ) {
            errors.push({
              field: (prefix ?? "") + p.name,
              error: (p.display ?? p.name) + " is required",
            });
          }
        });

      const properties = t.properties.filter((p) => p.isArray !== true);
      for (const i in properties) {
        const p = properties[i];
        if (item[p.name]) {
          errors = errors.concat(
            await this.validate(item[p.name], p.type, p.name + ".")
          );
        }
      }
    }

    // validate method codes can be parsed
    if (type === "type") {
      if (item.methods?.length > 0) {
        for (const i in item.methods) {
          const method = item.methods[i];
          typeSystem.parseMethod(method.name, method.code, type, false);
        }
      }
    }

    if (typeSystem.hasMethod("validate", type)) {
      console.log("calling method validate in " + type);
      errors = errors.concat(
        await typeSystem.callMethod(item, "validate", type)
      );
    }

    return errors;
  }

  async autoCalculateFields(item, type, prefix) {
    if (Array.isArray(item)) {
      for (const i in item) {
        const record = item[i];
        await this.autoCalculateFields(record, type, prefix);
      }
    } else {
      const t = this.types.find((t) => t.name === type);
      if (t && t.properties) {
        for (const i in t.properties) {
          const p = t.properties[i];
          if (typeSystem.hasMethod(p.name + "Expression", t.name)) {
            try {
              item[p.name] = typeSystem.callMethod(
                item,
                p.name + "Expression",
                t.name
              );
            } catch (error) {
              console.warn("Error calculating " + p.name + " in ");
              console.warn(item);
              console.warn(error);
            }
          }
        }

        const properties = t.properties.filter((p) => p.isArray !== true);
        for (const i in properties) {
          const p = properties[i];
          if (item[p.name]) {
            await this.autoCalculateFields(item[p.name], p.type, p.name + ".");
          }
        }
      }
    }
  }

  hideFields(item) {
    if (item) {
      //delete item.type;
      delete item._rid;
      delete item._self;
      delete item._etag;
      delete item._attachments;
      delete item._ts;

      if (Array.isArray(item)) {
        item.forEach((i) => this.hideFields(i));
      }
    }
  }
}

module.exports = BaseService;
