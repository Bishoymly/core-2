class BaseService {
  constructor(types) {
    this.types = types;
  }

  json(type, req, res, item) {
    this.hideFields(item);
    res.json(item);
  }

  validate(type, item, prefix) {
    const t = this.types.find((t) => t.name === type);
    let errors = [];
    if (t && t.properties) {
      t.properties
        .filter((p) => p.required === true)
        .forEach((p) => {
          if (item[p.name] == undefined) {
            errors.push({
              field: (prefix ?? "") + p.name,
              error: (p.display ?? p.name) + " is required",
            });
          }
        });

      t.properties.forEach((p) => {
        if (item[p.name]) {
          errors = errors.concat(
            this.validate(p.type, item[p.name], p.name + ".")
          );
        }
      });
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
