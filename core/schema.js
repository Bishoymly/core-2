// @ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");
const swaggerUI = require("swagger-ui-express");
const CrudService = require("./crud-service");
const typeSystem = require("./type-system");

class Schema {
  types = [];

  constructor() {}

  async init(app) {
    const cosmosClient = new CosmosClient({
      endpoint: config.host,
      key: config.authKey,
    });

    this.crudService = new CrudService(
      cosmosClient,
      config.databaseId,
      config.containerId,
      app,
      this.types
    );
    await this.crudService.init(app, this.types);

    // setup swagger
    app.use(
      "/api-docs",
      swaggerUI.serve,
      swaggerUI.setup(this.getSwaggerUIDocs())
    );
  }

  getSwaggerUIDocs() {
    const header = {
      openapi: "3.0.3", // present supported openapi version
      info: {
        title: "Core 2.0 API", // short title.
        description: "Core 2.0 API", //  desc.
        version: "1.0.0", // version number
      },
    };

    const components = {};
    const tags = [];
    const paths = {};
    this.types
      .filter((t) => typeSystem.isOfType(t.name, "Object"))
      .forEach((t) => {
        const properties = {};
        if (t.properties) {
          t.properties.forEach((p) => {
            properties[p.name] = this.toSwaggerProperty(t, p);
          });
        }
        components[t.name] = {
          type: "object",
          properties: {
            ...properties,
          },
        };

        if (t.showInMenu === true) {
          this.crudService?.setupSwagger(t, tags, paths);
        }
      });

    const docs = {
      ...header,
      components: {
        schemas: {
          ...components,
        },
      },
      tags: tags,
      paths: paths,
    };
    return docs;
  }

  toSwaggerProperty(t, p) {
    const result = {
      type: p.type,
      example: "",
    };

    // find if this property is of a another core type
    const t2 = this.findType(p.type);
    if (t2) {
      if (t2.type === "Object") {
        result["$ref"] = "#/components/schemas/" + t2.name;
      } else if (t2.type === "Lookup") {
        result.type = "String";
        if (t2.values) {
          result.enum = t2.values.map((v) => v.code);
        }
      } else {
        result.type = t2.type;
      }

      if (t2.example) {
        result.example = t2.example;
      }

      if (t2.display) {
        result.display = t2.display;
      }
    }

    if (p.display) {
      result.display = p.display;
    }

    if (p.example) {
      result.example = p.example;
    }

    if (p.required) {
      result.required = p.required;
    }

    return result;
  }

  findType(name) {
    return this.types.find((type) => type.name === name);
  }
}

module.exports = new Schema();
