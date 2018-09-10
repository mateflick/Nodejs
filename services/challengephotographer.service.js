"use strict";
let chalk = require("chalk");

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const ChallengePhoto = require('../model/challenge.photographer');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "photochallenge",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://localhost:27017/mateflick"),
    model: ChallengePhoto,
    settings: {

    },
    actions: {
        join: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
                PhotographerId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("user.get", {
                    id: entity.PhotographerId
                }).then(user => {
                    if (user == null) {
                        throw new ValidationError("Photographerid is not valid", -1, "Photographerid is not valid");
                    } else {
                        if (user.UserType != 2) {
                            throw new ValidationError("user could not join challenge", -1, "user could not join challenge");
                        } else {
                            return this.broker.call("photochallenge.find", {
                                query: {
                                    ChallengeId: entity.ChallengeId,
                                    PhotographerId: entity.PhotographerId
                                }
                            }).then((res) => {
                                if (res == null || res.length == 0) {
                                    return this.broker.call("photochallenge.create", {
                                        ChallengeId: entity.ChallengeId,
                                        PhotographerId: entity.PhotographerId
                                    }).then(doc => {
                                        return new Response(200, 'success', doc);
                                    });

                                } else {
                                    throw new ValidationError("Photographer already joint Challenge", -1, "Photographer already joint Challenge");
                                }
                            });
                        }
                    }
                });
            }
        },
        unjoin: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
                PhotographerId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("photochallenge.find", {
                    query: {
                        ChallengeId: entity.ChallengeId,
                        PhotographerId: entity.PhotographerId
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("Photographer is not joining Challenge", -1, "Photographer is not joining Challenge");
                    } else {
                        return this.broker.call("photochallenge.remove", {
                            id: res[0]._id,
                        }).then(doc => {
                            return new Response(200, 'success', doc);
                        });


                    }
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
