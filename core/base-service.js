class BaseService {
  constructor(types) {
    this.types = types;
  }

  json(type, req, res, item) {
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

    if (type === "type") {
      if (item.methods?.length > 0) {
        for (const i in item.methods) {
          const methodObj = item.methods[i];
          await import("data:text/javascript," + methodObj.code);
        }
      }
    }

    if (t && t.methods) {
      if (t.methods?.length > 0) {
        let methodObj = t.methods.find((m) => m.name === "validate");
        if (methodObj) {
          let module = await import("data:text/javascript," + methodObj.code);
          errors = errors.concat(await module.validate(item, type, prefix));
        }
      }
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
