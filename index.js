const mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const defaultOptions = {
	host: 'localhost',
	port: 27017,
	db: 'test',
	max: 100,
	min: 1
};

var CRUD =   function(options){
	this.connect = null;
	var that = this;
	options = _.merge({}, defaultOptions, options);
	var mongoUrl = options.uri || options.url;
	if (!mongoUrl) {
		if (options.user && options.pass) {
			mongoUrl = `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}/${options.db}`;
		} else {
			mongoUrl = `mongodb://${options.host}:${options.port}/${options.db}`;
		}
	}
	mongoClient.connect(mongoUrl,{
		server: { poolSize: 1 },
		native_parser: true,
		uri_decode_auth: true
	},function (err, conn) {
		if(err){
			console.log(err);
		}else{
			that.connect = conn;
			that.connect.ObjectID = ObjectID;
		}
	});
};
CRUD.prototype = {
	use:function () {
		var that = this;
		return function (ctx,next) {
			ctx.mongo = that.connect;
			return next();
		};
	},
	get:function () {
		return this.connect;
	}
};
module.exports = CRUD;
