const CosmosClient = require('@azure/cosmos').CosmosClient
const debug = require('debug')
const pluralize = require('pluralize')

class CrudService {
    constructor(cosmosClient, databaseId, containerId, app, types) {
        this.client = cosmosClient
        this.databaseId = databaseId
        this.collectionId = containerId
        this.database = null
        this.container = null
        this.setupRoutes(app, types);
    }

    setupRoutes(app, types) {
        types.filter(t=>t.api==="CRUD").forEach(t => {
            console.log('/'+t.name);
            app.get('/'+t.name, (req, res, next) => this.getAll(t.name, req, res).catch(next));
            app.post('/'+t.name, (req, res, next) => this.post(t.name, req, res).catch(next));
            app.put('/'+t.name+'/:id', (req, res, next) => this.put(t.name, req, res).catch(next));
            app.get('/'+t.name+'/:id', (req, res, next) => this.get(t.name, req, res).catch(next));
            app.delete('/'+t.name+'/:id', (req, res, next) => this.delete(t.name, req, res).catch(next));
        });
    }

    setupSwagger(t, tags, paths){
        console.log('swagger for ' + t.name)
        tags.push({
            name: t.name
        });

        paths['/' + t.name] = {
            get: {
                tags: [t.name], // operation's tag.
                description: "Get a list of " + pluralize(t.name),
                operationId: "getAll"+ t.name,
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
                                    }                                
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: [t.name], // operation's tag.
                description: "Creates " + t.name,
                operationId: "create"+ t.name,
                parameters: [],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/"+ t.name,
                            }
                        }
                    }
                },
                responses: {
                    // response code
                    200: {
                        description: t.name + " created successfully",
                    },
                },
            },
        };
        paths['/' + t.name + '/{id}'] = {
            get: {
                tags: [t.name],
                description: "Get a single " + t.name + " by id",
                operationId: "get"+ t.name,
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        schema: {
                            type: "string"
                        },
                        required: true,
                        description: t.name+" id",
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
                operationId: "update"+ t.name,
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        schema: {
                            type: "string"
                        },
                        required: true,
                        description: "id of " + t.name + " to be updated",
                    },
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/"+ t.name,
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: t.name + " updated successfully"
                    },
                },
            },
            delete: {
                tags: [t.name],
                description: "Delete " + t.name,
                operationId: "delete"+ t.name,
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        schema: {
                            type: "string"
                        },
                        required: true,
                        description: "id of "+ t.name +" to be deleted",
                    },
                ],
                responses: {
                    200: {
                        description: t.name + " deleted successfully"
                    },
                },
            },
        };
    }
    
    async init() {
        console.log('Setting up the database...')
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        })
        this.database = dbResponse.database
        console.log('Setting up the database...done!')
        console.log('Setting up the container...')
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        })
        this.container = coResponse.container
        console.log('Setting up the container...done!')
    }

    async getAll(type, req, res){
        const querySpec = {
            query: "SELECT * FROM root r WHERE r.type=@type",
            parameters: [
                {
                    name: "@type",
                    value: type
                }
            ]
        };
        
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        res.json(resources);
    }

    async get(type, req, res){
        const itemId = req.params.id;
        const { resource } = await this.container.item(itemId, undefined).read()
        res.json(resource);
    }

    async post(type, req, res) {
        const item = req.body;
        item.type = type;
        const { resource: doc } = await this.container.items.create(item)
        res.json(doc);
    }

    async put(type, req, res) {
        const item = req.body;
        const itemId = req.params.id;
        item.id = itemId;
        item.type = type;
        const { resource: replaced } = await this.container
            .item(itemId, undefined)
            .replace(item)

        res.json(replaced);
    }

    async delete(type, req, res){
        const id = req.params.id;
        const { body } = await this.container.item(id).delete();
        res.status(200).json(body);
    }
}

module.exports = CrudService;