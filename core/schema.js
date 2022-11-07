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
    
    this.crudService = new CrudService(cosmosClient, config.databaseId, config.containerId, app, this.types);
    await this.crudService.init()
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
          this.crudService?.setupSwagger(t, tags, paths);
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