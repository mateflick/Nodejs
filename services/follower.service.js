"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Followers = require('../model/followers');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "follower",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb"),
    model: Followers,
    settings: {

        populates: {
            // Define the params of action call. It will receive only with username & full name of author.
            "users": {
                action: "user.list",
                params: {
                    fields: ["_id", "SurName"]
                }
            },
            // Custom populator handler function
            "rate" (ids, rule, ctx) {
                console.log(ids);
                console.log(rule);
                console.log('ssss');
                console.log(ctx);
                ctx.rate = "sss";
                return "sss";
                // return Promise.resolve(...);
            }
        }

    },
    actions: {
        follow: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                FollowerId: {
                    type: "string",
                    optional: false
                },
                FollowingType: {
                    type: "number",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("follower.find", {
                    query: {
                        FollowerId: entity.FollowerId,
                        UserId: entity.UserId
                    },
                }).then((res) => {
                    if (res == null || res.length == 0) {

                        this.broker.call("user.IncrementFollowingCount", {
                            UserId: entity.UserId
                        }).then(res => {});
                        this.broker.call("user.IncrementFollowersCount", {
                            UserId: entity.FollowerId
                        }).then(res => {});

                        return this.broker.call("follower.create", {
                            FollowerId: entity.FollowerId,
                            FollowingType: entity.FollowingType,
                            UserId: entity.UserId
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });


                    } else {
                        throw new ValidationError("you already following this user", -1, "you already following this user");
                    }
                });

            }
        },
        unFollow: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                FollowerId: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("follower.find", {
                    query: {
                        FollowerId: entity.FollowerId,
                        UserId: entity.UserId
                    },
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("you are not following", -1, "you are not following");
                    } else {
                        this.broker.call("user.DecrementFollowingCount", {
                            UserId: entity.UserId
                        }).then(res => {});
                        this.broker.call("user.DecrementFollowersCount", {
                            UserId: entity.FollowerId
                        }).then(res => {});


                        return this.broker.call("follower.remove", {
                            id: res[0]._id
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });
                    }
                });

            }
        },
        listFollowers: {
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
                return this.broker.call("follower.list", {
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
        listFriendsAndFamilyUsers: {
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
                return this.broker.call("follower.list", {
                    query: {
                        UserId: entity.UserId
                    },
                    fields: ["FollowerId"],
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

            }
        },
        listFollowings: {
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
                return this.broker.call("follower.list", {
                    query: {
                        FollowerId: entity.UserId
                    },
                    pageSize: entity.pageSize,
                    page: entity.page,
                }).then((docs) => {
                    return new Response(200, 'success', docs);
                });

            }
        },

        searchMyPhotgraphers: {
            params: {
                Keyword: {
                    type: "string",
                    optional: false
                },
                UserId: {
                    type: "string",
                    optional: false
                },
                page: {
                    type: "number",
                    min: 1,
                    convert: true,
                    optional: false
                },
                pageSize: {
                    type: "number",
                    positive: true,
                    convert: true,
                    optional: false,
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.model.aggregate([{
                        $match: {
                            UserId: entity.UserId ,
                            // $or: [{
                            //     UserId: ObjectID(entity.UserId + ""),
                            // }, {
                            //     FollowerId: ObjectID(entity.UserId + ""),
                            // }]
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "FollowerId",
                            foreignField: "_id",
                            as: "userinfo"
                        }
                    },
                    {
                        $unwind: "$userinfo"
                    },
                    {
                        $match: {
                            "userinfo.UserType": 2,
                            $or: [{
                                "userinfo.FirstName": {
                                    $regex: new RegExp(entity.Keyword, "i")
                                },
                            }, {
                                "userinfo.SurName": {
                                    $regex: new RegExp(entity.Keyword, "i")
                                }
                            }]
                        }
                    },
                    {
                        $project: {
                            "CreatedAt": 1,
                            "UserId": 1,
                            "FollowerId": 1,
                            "userinfo._id": 1,
                            "userinfo.FirstName": 1,
                            "userinfo.SurName": 1,
                            "userinfo.UserType": 1,
                            "userinfo.EmailAddress": 1,
                            "userinfo.UserType": 1,
                            "userinfo.UserImage": 1
                        }
                    },
                    {
                        $skip: (entity.page - 1) * entity.pageSize
                    },
                    {
                        $limit: entity.pageSize
                    }
                ]).then(res => {
                    res.forEach(row => {
                        if (row.UserId == entity.UserId) {
                            row.follower = true;

                        } else {
                            row.follower = false;
                        }
                    });
                    return new Response(200, 'success', res);
                });
            }
        },
        searchMyUsers: {
            params: {
                Keyword: {
                    type: "string",
                    optional: false
                },
                UserId: {
                    type: "string",
                    optional: false
                },
                page: {
                    type: "number",
                    min: 1,
                    convert: true,
                    optional: false
                },
                pageSize: {
                    type: "number",
                    positive: true,
                    convert: true,
                    optional: false,
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.model.aggregate([{
                        $match: {
                            UserId: entity.UserId ,
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "FollowerId",
                            foreignField: "_id",
                            as: "userinfo"
                        }
                    },
                    {
                        $unwind: "$userinfo"
                    },
                    {
                        $match: {
                            "userinfo.UserType": 1,
                            $or: [{
                                "userinfo.FirstName": {
                                    $regex: new RegExp(entity.Keyword, "i")
                                },
                            }, {
                                "userinfo.SurName": {
                                    $regex: new RegExp(entity.Keyword, "i")
                                }
                            }]
                        }
                    },
                    {
                        $project: {
                            "CreatedAt": 1,
                            "FollowerId": 1,
                            "UserId": 1,
                            "userinfo._id": 1,
                            "userinfo.FirstName": 1,
                            "userinfo.SurName": 1,
                            "userinfo.UserType": 1,
                            "userinfo.EmailAddress": 1,
                            "userinfo.UserType": 1,
                            "userinfo.UserImage": 1
                        }
                    },
                    {
                        $skip: (entity.page - 1) * entity.pageSize
                    },
                    {
                        $limit: entity.pageSize
                    }
                ]).then(res => {
                    res.forEach(row => {
                        if (row.UserId == entity.UserId) {
                            row.follower = true;

                        } else {
                            row.follower = false;
                        }
                    });
                    return new Response(200, 'success', res);
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
