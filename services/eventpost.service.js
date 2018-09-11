"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const EventPost = require('../model/event.post');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "eventpost",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:kigipuo19@ds251362.mlab.com:51362/mateflickdb"),
    model: EventPost,
    settings: {

    },
    actions: {
        listPost: {
            params: {
                EventId: {
                    type: "string",
                    optional: false
                },
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
                return this.broker.call("eventpost.list", {
                    query: {
                        EventId: entity.EventId
                    },
                    sort: "-CreatedAt",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then(docs => {
                    return new Response(200, 'success', docs);
                });
            }
        },
        updateEventPost: {
            params: {
                EventPostId: {
                    type: "string",
                    optional: false
                },
                FileId: {
                    type: "object",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.EventPostId, {
                    $set: {
                        FileId: entity.FileId
                    }
                }).then(doc => {
                    console.log('post is updated');
                    return doc;
                });
            }
        },
        createEventPost: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                EventId: {
                    type: "string",
                    optional: false
                },
                Title: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("eventpost.create", {
                    UserId: entity.UserId,
                    EventId: entity.EventId,
                    Title: entity.Title
                }).then(doc => {
                    return new Response(200, 'success', doc);
                });
                // return this.broker.call("eventpost.find", {
                //     query: {
                //         EventId: entity.EventId,
                //         UserId: entity.UserId,
                //         Title: entity.Title,
                //     }
                // }).then((res) => {
                //     if (res == null || res.length == 0) {
                //
                //
                //     } else {
                //         throw new ValidationError("you already created event with same name", -1, "you already created event with same name");
                //
                //     }
                // });

            }
        },
    },


    events: {

    },

    methods: {},

    created() {

    },
    started() {

    },

    stopped() {

    }
};
