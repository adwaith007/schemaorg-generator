// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const mysql = require('mysql');
const util = require('util');
const dump = require("./dump.json");
const config = require("./config.json");
const schema = require('./schema_pb');
const schemaDescriptor = require('./schema_descriptor.json');
const JSONLDFeedSerializer = require('../jsonld-feed-serializer');
const SchemaValidator = require('../schema-validator');
const IMDBExample = require('./imdb-example');
const IMDBSeeder = require('./imdb-seeder');

/**
 * Creates new IMDBSeeder and seeds db and creates new IMDBExample and generates feed.
 */
async function main () {
    let seeder = new IMDBSeeder();
    await seeder.init(config.DBConfig);
    
    let con = mysql.createConnection({
        host: config.DBConfig.host,
        user: config.DBConfig.user,
        password: config.DBConfig.password,
        database: config.DBConfig.dbname
    });
    let query = util.promisify(con.query).bind(con);
    
    console.log("Started seeding database.");
    await seeder.createTables(query);
    console.log("Tables created successfully.");
    await seeder.seedDB(query, dump["movies"], dump["tvseries"], dump["tvepisodes"]);
    console.log("Database seeding completed.");

    let validator = new SchemaValidator("./constraints.ttl", "./report.html");
    await validator.loadShapes();

    let example = new IMDBExample();
    let serializer = new JSONLDFeedSerializer("./generated-feed.json", feedType="ItemList", validator=validator);
    console.log("Feed generation started.");
    for await(let x of example.generateFeed(con, schema, schemaDescriptor)){
        serializer.addItem(x[0], x[1], schemaDescriptor);
    }
    serializer.close();
    console.log("Feed generation completed.");
    con.end();
    console.log("Successfully ran example.");
}

main();
