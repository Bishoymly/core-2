const CosmosClient = require('@azure/cosmos').CosmosClient
const debug = require('debug')

class CrudService {
    constructor(cosmosClient, databaseId, containerId) {
        this.client = cosmosClient
        this.databaseId = databaseId
        this.collectionId = containerId
    
        this.database = null
        this.container = null
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