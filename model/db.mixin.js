// "use strict";
//
// const SequelizeAdapter = require("moleculer-db-adapter-sequelize");
// const DbService = require("moleculer-db");
// const seq = require("./connection");
//
// module.exports = function(collection) {
//
//     const Connection = new SequelizeAdapter(seq.dbName,seq.username,seq.password,seq.properties);
//
//     return {
//         mixins: [DbService],
//         adapter: Connection
//     };
// };


"use strict";

const MongoAdapter = require("moleculer-db-adapter-mongo");
const DbService	= require("moleculer-db");

process.env.MONGO_URI = "mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb";

module.exports = function(collection) {
		// Mongo adapter
		return {
			mixins: [DbService],
			adapter: new MongoAdapter(process.env.MONGO_URI),
			collection
		};
};
