const typeSystem = require("./type-system");

class BaseService {
  constructor(types) {
    this.types = types;
  }

  async result(type, req, res, item) {
    await typeSystem.autoCalculateFields(item, type);
    this.hideFields(item);

    const output = req.query.output;
    switch (output) {
      case "csv":
        const csv = require("fast-csv");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + type + '.csv"'
        );
        csv.write(item, { headers: true }).pipe(res);
        return;

      default:
        // json
        res.json(item);
        return;
    }
  }

  prepareToSave(type, item) {
    if (typeSystem.hasMethod("idAs", type)) {
      item.id = type + "-" + typeSystem.id(item, type);
    }
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

  hideFields(item) {
    if (item) {
      delete item.type;
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
