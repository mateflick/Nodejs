"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const file = require('../model/file');
let Response = require('../responses/success');
const ObjectID = require('mongodb').ObjectID;

const mongoURI = 'mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb';
// Create a storage object with a given configuration
const storage = require('multer-gridfs-storage')({
    url: mongoURI
});
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(mongoURI);
let gfs;
conn.once('open', function() {
    gfs = Grid(conn.db, mongoose.mongo);

    // all set!
})


const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "files",
    mixins: [DbService],
    adapter: new MongooseAdapter(mongoURI),
    model: file,
    settings: {

    },
    actions: {
        listFiles: {
            params: {
                // GalleryId: {
                //     type: "string",
                //     optional: false
                // }
                pageSize: {
                    type: "number",
                    optional: false
                },
                page: {
                    type: "number",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("files.list", {
                    page: entity.page,
                    pageSize: entity.pageSize,
                }).then((files) => {
                    return new Response(200, 'success', files);
                });
            }
        },
        getallsizeforuser: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("eventpost.list", {
                    query: {
                        UserId: entity.UserId
                    },
                    fields: ["FileId"]
                }).then(docs => {
                    if (docs.rows.length > 0) {
                        var ids = [];
                        docs.rows.map(function(item) {
                            // ids.push(item.FileId);
                            ids.push(new ObjectID(item.FileId + ""));
                        });
                        console.log(ids);
                        return this.adapter.model.aggregate([{
                                $match: {
                                    _id: {
                                        $in: ids
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    total: {
                                        $sum: "$length"
                                    }
                                }
                            }
                        ]).then(res => {
                            return new Response(200, 'success', res[0].total);
                        });
                    } else {
                        return new Response(200, 'no files', res);
                    }
                });


            }
        },
        getallszie: {
            params: {},
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.model.aggregate([{
                        $match: {
                            // uploadDate: {
                            //     $gte: ISODate("2017-06-09T20:51:50.102Z")
                            // }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$length"
                            }
                        }
                    }
                ]).then(res => {
                    return new Response(200, 'success', res);
                });
            }
        },
        getFile: {
            params: {
                FileName: {
                    type: "string",
                    optional: false
                },
                req: {
                    type: "object",
                    optional: false
                },
                res: {
                    type: "object",
                    optional: false
                }
            },
            handler(ctx, req, res) {
                let entity = ctx.params;
                return this.broker.call("files.find", {
                    query: {
                        _id: entity.FileName,
                    }
                }).then((files) => {
                    if (files.length > 0) {
                        const readstream = gfs.createReadStream({
                            _id: entity.FileName,
                        });
                        readstream.pipe(entity.res);
                    } else {
                        return new Response(-1, 'no file found', files);
                    }

                });

            }
        },
        getFileInfo: {
            params: {
                FileName: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("files.find", {
                    query: {
                        filename: entity.FileName,
                    }
                }).then((files) => {
                    if (files.length > 0) {
                        var file = files[0];
                        return new Response(200, 'success', file);
                    } else {
                        return new Response(-1, 'no file found', files);
                    }

                });
            }
        },
        getFileInfoById: {
            params: {
                FileId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("files.find", {
                    _id: entity.FileId,
                }).then((files) => {
                    if (files.length > 0) {
                        var file = files[0];
                        // ctx.meta.isStream = true;
                        // const readstream = gfs.createReadStream(file.filename);

                        return new Response(200, 'success', file);
                    } else {
                        return new Response(-1, 'no file found', files);
                    }

                });
            }
        },
    },


    events: {

    },

    methods: {

    },

    created() {

    },
    started() {

    },

    stopped() {

    }
};
