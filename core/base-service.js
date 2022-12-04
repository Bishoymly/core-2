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
    /*if (type === "type") {
      if (item.methods?.length > 0) {
        for (const i in item.methods) {
          const methodObj = item.methods[i];
          await import("data:text/javascript," + methodObj.code);
        }
      }
    }*/
    if (typeSystem.hasMethod("validate", type)) {
      console.log("calling method validate in " + type);
      errors = errors.concat(
        await typeSystem.callMethod(item, "validate", type)
      );
    }
    /*if (t && t.methods) {
      if (t.methods?.length > 0) {
        let methodObj = t.methods.find((m) => m.name === "validate");
        if (methodObj) {
          let module = await import("data:text/javascript," + methodObj.code);
          errors = errors.concat(await module.validate(item, type, prefix));
        }
      }
    }*/

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
        const props = t.properties.filter(
          (p) =>
            p.expression !== undefined &&
            p.expression !== null &&
            p.expression !== ""
        );
        for (const i in props) {
          const p = props[i];
          try {
            let module = await import(
              "data:text/javascript, export function calculate(){ return " +
                p.expression +
                "; }"
            );
            item[p.name] = module.calculate.call(item, type, prefix);
          } catch (error) {
            console.warn("Error calculating " + p.name + " in ");
            console.warn(item);
            console.warn(error);
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

      if (item.coretype) {
        item.type = item.coretype;
        delete item.coretype;
      }

      if (Array.isArray(item)) {
        item.forEach((i) => this.hideFields(i));
      }
    }
  }
}

module.exports = BaseService;
