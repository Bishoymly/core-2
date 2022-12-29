const CosmosClient = require("@azure/cosmos").CosmosClient;
const debug = require("debug");
const pluralize = require("pluralize");
const BaseService = require("./base-service");
const fs = require("fs");
const path = require("path");
const typeSystem = require("./type-system");

class CrudService extends BaseService {
  constructor(cosmosClient, databaseId, containerId, app, types) {
    super(types);
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;
    this.database = null;
    this.container = null;
  }

  async init(app, types) {
    console.log("Setting up the database...");
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId,
    });
    this.database = dbResponse.database;
    console.log("Setting up the database...done!");
    console.log("Setting up the container...");
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId,
    });
    this.container = coResponse.container;
    console.log("Setting up the container...done!");
    console.log("Setting up the types...");
    await this.setupTypes(types);
    console.log("Setting up the types...done!");
    console.log("Setting up the routes...");
    this.setupRoutes(app, types);
    console.log("Setting up the routes...done!");
  }

  async setupTypes(types) {
    types.length = 0;

    // get types from db
    const { resources: dbTypes } = await this.container.items
      .query({
        query: "SELECT * FROM root r WHERE r.type='type'",
      })
      .fetchAll();

    if (dbTypes.length > 0) {
      dbTypes.forEach((t) => {
        types.push(t);
      });
    } else {
      // get initial types from folder
      const jsonsInDir = fs
        .readdirSync("./schema")
        .filter((file) => path.extname(file) === ".json");

      for (const f in jsonsInDir) {
        const fileData = fs.readFileSync(path.join("./schema", jsonsInDir[f]));
        const item = JSON.parse(fileData.toString());
        item.type = "type";
        const { resource: doc } = await this.container.items.create(item);
        types.push(doc);
      }
    }

    typeSystem.init(types);
  }

  setupRoutes(app, types) {
    app.get("/api/:type", (req, res, next) =>
      this.getAll(req.params.type, req, res).catch(next)
    );
    app.post("/api/:type", (req, res, next) =>
      this.post(req.params.type, req, res).catch(next)
    );
    app.put("/api/:type/:id", (req, res, next) =>
      this.put(req.params.type, req, res).catch(next)
    );
    app.get("/api/:type/:id", (req, res, next) =>
      this.get(req.params.type, req, res).catch(next)
    );
    app.delete("/api/:type/:id", (req, res, next) =>
      this.delete(req.params.type, req, res).catch(next)
    );
    types
      .filter((t) => t.api === "CRUD")
      .forEach((t) => {
        console.log("/" + t.name);
      });
  }

  setupSwagger(t, tags, paths) {
    console.log("swagger for " + t.name);
    tags.push({
      name: t.name,
    });

    paths["/api/" + t.name] = {
      get: {
        tags: [t.name], // operation's tag.
        description: "Get a list of " + pluralize(t.name),
        operationId: "getAll" + t.name,
        parameters: [],
        responses: {
          // response code
          200: {
            description: pluralize(t.name) + " list successfully returned",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/" + t.name,
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: [t.name], // operation's tag.
        description: "Creates " + t.name,
        operationId: "create" + t.name,
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/" + t.name,
              },
            },
          },
        },
        responses: {
          // response code
          200: {
            description: t.name + " created successfully",
          },
        },
      },
    };
    paths["/api/" + t.name + "/{id}"] = {
      get: {
        tags: [t.name],
        description: "Get a single " + t.name + " by id",
        operationId: "get" + t.name,
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "string",
            },
            required: true,
            description: t.name + " id",
          },
        ],
        responses: {
          200: {
            description: t.name + " returned",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/" + t.name,
                },
              },
            },
          },
        },
      },
      put: {
        tags: [t.name],
        description: "Update " + t.name,
        operationId: "update" + t.name,
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "string",
            },
            required: true,
            description: "id of " + t.name + " to be updated",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/" + t.name,
              },
            },
          },
        },
        responses: {
          200: {
            description: t.name + " updated successfully",
          },
        },
      },
      delete: {
        tags: [t.name],
        description: "Delete " + t.name,
        operationId: "delete" + t.name,
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "string",
            },
            required: true,
            description: "id of " + t.name + " to be deleted",
          },
        ],
        responses: {
          200: {
            description: t.name + " deleted successfully",
          },
        },
      },
    };
  }

  async getAll(type, req, res) {
    const querySpec = {
      query: "SELECT * FROM root r WHERE r.type=@type",
      parameters: [
        {
          name: "@type",
          value: type,
        },
      ],
    };

    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    await this.json(type, req, res, resources);
  }

  async get(type, req, res) {
    const itemId = req.params.id;
    const { resource } = await this.container.item(itemId, undefined).read();
    await this.json(type, req, res, resource);
  }

  async post(type, req, res) {
    const item = req.body;
    item.type = type;

    var errors = await this.validate(item, type);
    if (errors.length === 0) {
      const { resource: doc } = await this.container.items.create(item);
      if (type === "type") {
        this.types.push(doc);
        typeSystem.init(this.types);
      }
      await this.json(type, req, res, doc);
    } else {
      res.status(400).json({ validationErrors: errors });
    }
  }

  async put(type, req, res) {
    const item = req.body;
    const itemId = req.params.id;
    item.id = itemId;
    item.type = type;

    var errors = await this.validate(item, type);
    if (errors.length === 0) {
      const { resource: replaced } = await this.container
        .item(itemId, undefined)
        .replace(item);

      if (type === "type") {
        let old = this.types.find((t) => t.name === replaced.name);
        this.types[this.types.indexOf(old)] = replaced;
        typeSystem.init(this.types);
      }

      await this.json(type, req, res, replaced);
    } else {
      res.status(400).json({ validationErrors: errors });
    }
  }

  async delete(type, req, res) {
    const id = req.params.id;
    const { body } = await this.container.item(id).delete();

    await this.json(type, req, res, body);
  }
}

module.exports = CrudService;
