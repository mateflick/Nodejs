"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Likes = require('../model/likes');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "like",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb"),
    model: Likes,
    settings: {

    },
    actions: {
        like: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                LikeBy: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("like.find", {
                    query: {
                        LikeBy: entity.LikeBy,
                        UserId: entity.UserId
                    },
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return this.broker.call("like.create", {
                            LikeBy: entity.LikeBy,
                            UserId: entity.UserId
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });
                    } else {
                        throw new ValidationError("you already like this user", -1, "you already like this user");
                    }
                });

            }
        },
        unLike: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                LikeBy: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("like.find", {
                    query: {
                        LikeBy: entity.LikeBy,
                        UserId: entity.UserId
                    },
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("you don't like this user", -1, "you don't like this user");
                    } else {
                        return this.broker.call("like.remove", {
                            id: res[0]._id
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });
                    }
                });

            }
        },
        listLikes: {
            params: {
                UserId: {
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
                return this.broker.call("like.list", {
                    query: {
                        UserId: entity.UserId
                    },
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

            }
        },
        countLikes: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("like.count", {
                    query: {
                        UserId: entity.UserId
                    },
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

            }
        },
        listMyLikes: {
            params: {
                LikeBy: {
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
                return this.broker.call("like.list", {
                    query: {
                        LikeBy: entity.LikeBy
                    },
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

            }
        },
        countMyLikes: {
            params: {
                LikeBy: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("like.count", {
                    query: {
                        LikeBy: entity.LikeBy
                    },
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

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
