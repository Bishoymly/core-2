const CosmosClient = require("@azure/cosmos").CosmosClient;
const pluralize = require("pluralize");
const BaseService = require("./base-service");
const fs = require("fs");
const path = require("path");
const typeSystem = require("./type-system");
const multer = require("multer");
const upload = multer();
const csv = require("fast-csv");
const { BulkOperationType } = require("@azure/cosmos");

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

        if (!item.type) {
          item.type = "type";
        }

        if (!item.id) {
          item.id = "type-" + item.name;
        }

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
    app.post("/api/:type/import", upload.single("file"), (req, res, next) =>
      this.import(req.params.type, req, res).catch(next)
    );
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
    let orderBy = "";
    if (req.query.sort) {
      orderBy = `ORDER BY r["${req.query.sort}"] ${req.query.dir ?? "ASC"}`;
    }
    const querySpec = {
      query: `SELECT * FROM root r WHERE r.type=@type ${orderBy}`,
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
    await this.result(type, req, res, resources);
  }

  async get(type, req, res) {
    let itemId = req.params.id;
    if (typeSystem.hasMethod("idAs", type)) {
      itemId = type + "-" + itemId;
    }
    const { resource } = await this.container.item(itemId, undefined).read();
    await this.result(type, req, res, resource);
  }

  async post(type, req, res) {
    const item = req.body;
    item.type = type;

    var errors = await this.validate(item, type);
    if (errors.length === 0) {
      this.prepareToSave(type, item);
      console.log(item);
      const { resource: doc } = await this.container.items.create(item);
      if (type === "type") {
        this.types.push(doc);
        typeSystem.init(this.types);
      }
      await this.result(type, req, res, doc);
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

      await this.result(type, req, res, replaced);
    } else {
      res.status(400).json({ validationErrors: errors });
    }
  }

  async delete(type, req, res) {
    const id = req.params.id;
    const { body } = await this.container.item(id).delete();

    await this.result(type, req, res, body);
  }

  async import(type, req, res) {
    const Readable = require("stream").Readable;
    let operations = [];
    const container = this.container;
    const self = this;
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream
      .pipe(csv.parse({ headers: true }))
      .on("data", function (data) {
        self.prepareToSave(type, data);
        operations.push({
          operationType: BulkOperationType.Upsert,
          id: data.id,
          resourceBody: data,
        });
      })
      .on("end", async function () {
        await container.items.bulk(operations);
        res.status(200).json({
          message: `${operations.length} items imported successfully, `,
        });
      })
      .on("error", function (error) {
        res.status(500).send({ error });
      });
  }
}

module.exports = CrudService;
