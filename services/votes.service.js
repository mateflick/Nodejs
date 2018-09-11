"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Votes = require('../model/vote');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "votes",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb"),
    model: Votes,
    settings: {

    },
    actions: {
        new: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                ChallengePostId: {
                    type: "string",
                    optional: false
                },

            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("votes.create", {
                    UserId: entity.UserId,
                    ChallengePostId: entity.ChallengePostId,
                }).then(vote => {
                    return new Response(200, 'success', vote);
                });
                // return this.broker.call("votes.find", {
                //     query: {
                //         UserId: entity.UserId,
                //         ChallengePostId: entity.ChallengePostId,
                //     }
                // }).then((res) => {
                //     if (res == null || res.length == 0) {
                //
                //
                //     } else {
                //         throw new ValidationError("you already voted to this post", -1, "you already voted to this post");
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
