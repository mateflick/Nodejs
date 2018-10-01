"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Challenge = require('../model/challenge');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "challenge",
    mixins: [DbService],
    adapter: new MongooseAdapter(process.env.MONGO_URI); //process.env.MONGO_URI),
    model: Challenge,
    settings: {

    },
    actions: {
        new: {
            params: {
                Name: {
                    type: "string",
                    optional: false
                },
                Description: {
                    type: "string",
                    optional: false
                },
                Prize: {
                    type: "number",
                    optional: false
                },
                EndDate: {
                    type: "number",
                    convert: true,
                    optional: false
                },
                StartDate: {
                    type: "number",
                    convert: true,
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("challenge.find", {
                    query: {
                        Name: entity.Name,
                        Status: 1,
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return this.broker.call("challenge.create", {
                            Prize: entity.Prize,
                            EndDate: entity.EndDate,
                            StartDate: entity.StartDate,
                            Name: entity.Name,
                            Description: entity.Description,
                        }).then(doc => {
                            return new Response(200, 'success', doc);
                        });

                    } else {
                        throw new ValidationError("we have same name of challenge", -1, "we have same name of challenge");

                    }
                });

            }
        },
        listPastChallenges: {
            params: {
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
                return this.broker.call("challenge.find", {
                    query: {
                        EndDate: {
                            $lte: new Date()
                        }
                    },
                    sort: "-StatDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return new Response(200, 'success', res);
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        increaseVotes: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                // increase votes number of post
                return this.adapter.updateById(entity.ChallengeId, {
                    $inc: {
                        Votes: 1
                    }
                }).then(doc => {
                    return doc;
                });
            }
        },
        listUpcomingChallenges: {
            params: {
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
                return this.broker.call("challenge.find", {
                    query: {
                        EndDate: {
                            "$gte": new Date()
                        }
                    },
                    sort: "-StatDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return new Response(200, 'success', res);
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        delete: {
            params: {
                Name: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("challenge.find", {
                    query: {
                        Name: entity.Name,
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no challenges with this name", -1, "no challenges with this name");
                    } else {
                        res.forEach(async (challenge) => {
                            this.broker.call("challenge.remove", {
                                id: challenge._id,
                            }).then((res) => {
                                console.log(res);
                            });
                        })
                        return new Response(200, 'success', '');
                    }
                });

            }
        },
        search: {
            params: {
                Name: {
                    type: "string",
                    optional: false
                },
                Description: {
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
                return this.broker.call("challenge.list", {
                    query: {
                        $or: [{
                            Name: {
                                $regex: '.*' + entity.Name + '.*'
                            }
                        }, {
                            Description: {
                                $regex: '.*' + entity.Description + '.*'
                            }
                        }],
                        Status: 1
                    },
                    page: entity.pageNumber,
                    pageSize: entity.pageSize,
                }).then((Challenges) => {
                    return new Response(200, 'success', Challenges);
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
