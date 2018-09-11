"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const post = require('../model/post');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "post",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb"),
    model: post,
    settings: {

    },
    actions: {
        createPost: {
            params: {
                Title: {
                    type: "string",
                    min: 3,
                    max: 20,
                    optional: false
                },
                GalleryId: {
                    type: "string",
                    optional: false
                },
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("post.create", {
                    GalleryId: entity.GalleryId,
                    UserId: entity.UserId,
                    Title: entity.Title
                }).then((doc) => {
                    return new Response(200, 'success', doc);
                });

            }
        },
        updatePost: {
            params: {
                PostId: {
                    type: "string",
                    optional: false
                },
                FileId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.PostId, {
                    $set: {
                        FileId: entity.FileId
                    }
                }).then(doc => {
                    console.log('post is updated');
                    return doc;
                });
            }
        },
        listPostsByGallery: {
            params: {
                GalleryId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("post.list", {
                    GalleryId: entity.GalleryId,
                }).then((posts) => {
                    return new Response(200, 'success', posts);
                });
            }
        },
        countPostsByGallery: {
            params: {
                GalleryId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("post.count", {
                    query: {
                        GalleryId: entity.GalleryId,
                    }
                }).then((posts) => {
                    return new Response(200, 'success', posts);
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
