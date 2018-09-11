"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const TimeLine = require('../model/timeline');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "timeline",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb"),
    model: TimeLine,
    settings: {

    },
    actions: {
        listUserTimeLine1: {
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
                return this.adapter.model.aggregate([{
                        $match: {
                            UserId: ObjectID(entity.UserId + ""),
                            _id: {
                                // $gt: ObjectID.createFromTime(Date.now() / 1000 - 60) last minut
                                $gt: ObjectID.createFromTime(Date.now() / 1000 - 24 * 60 * 60) // last 24 hours
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "UserId",
                            foreignField: "_id",
                            as: "userInfo"
                        }
                    },
                    {
                        $unwind: "$userInfo"
                    },
                    {
                        $project: {
                            "FileId": 1,
                            "CreatedAt": 1,
                            "userInfo._id": 1,
                            "userInfo.FirstName": 1,
                            "userInfo.SurName": 1,
                            "userInfo.UserType": 1,
                            "userInfo.EmailAddress": 1,
                            "userInfo.UserImage": 1
                        }
                    },
                    {
                        $sort: {
                            CreatedAt: -1 // descending order
                        }
                    },
                    {
                        $skip: (entity.page -1) * entity.pageSize
                    },
                    {
                        $limit: entity.pageSize
                    }


                ]).then(res => {
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
