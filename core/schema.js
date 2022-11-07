// @ts-check
const fs = require('fs');
const path = require('path')
const pluralize = require('pluralize')
const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require('../config')
const debug = require('debug')
const CrudService = require('./crud')

class Schema {

  types = [];

  constructor() {
    const jsonsInDir = fs.readdirSync('./schema').filter(file => path.extname(file) === '.json');
    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join('./schema', file));
        const json = JSON.parse(fileData.toString());
        this.types.push(json);
      });
  }

  async addRoutes(app){
    const cosmosClient = new CosmosClient({
        endpoint: config.host,
        key: config.authKey
    })
    const crudService = new CrudService(cosmosClient, config.databaseId, config.containerId)
    
    

    this.types.filter(t=>t.api==="CRUD").forEach(t => {
        console.log('/'+t.name);
        app.get('/'+t.name, (req, res, next) => crudService.getAll(t.name, req, res).catch(next));
        app.post('/'+t.name, (req, res, next) => crudService.post(t.name, req, res).catch(next));
        app.put('/'+t.name+'/:id', (req, res, next) => crudService.put(t.name, req, res).catch(next));
        app.get('/'+t.name+'/:id', (req, res, next) => crudService.get(t.name, req, res).catch(next));
        app.delete('/'+t.name+'/:id', (req, res, next) => crudService.delete(t.name, req, res).catch(next));
    });
    await crudService.init()
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
      this.types.filter(t=>t.type==="Object").forEach(t => {
        const properties = {};
        if(t.properties){
            t.properties.forEach(p => {
                properties[p.name]={
                    type: p.type,
                    description: p.display,
                    example: p.example??'',
                };
            });
        }
        components[t.name] = {
          type: "object",
          properties: {
            ...properties
          }
        };

        if(t.api==="CRUD"){
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
      });
    
      const docs = {
        ...header,
        components: {
            schemas: {
                ...components
            }
        },
        tags: tags,
        paths: paths
      };
      return docs;
  }
}

module.exports = Schema