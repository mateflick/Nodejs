"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const SMS = require('../model/sms');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "sms",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://localhost:27017/mateflick"),
    model: SMS,
    settings: {

    },
    actions: {
        sendSms: {
            params: {
                Mobile: {
                    type: "string",
                    min: 10,
                    max: 14,
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                // var sms= randomstring.generate({
                //     length: 6,
                //     charset: 'numeric'
                // });
                var sms = "123456";
                // this.broker.call("twilio.send", {
                //         // to: "+966551500042",
                //         to: "+" + entity.Mobile,
                //         message: "Hello From LeTaxi!, Your sms code is 1234"
                //     }).then(sms => console.log("SMS sent. Sid:", sms.sid))
                //     .catch(console.error);


                return this.broker.call("user.find", {
                    query: {
                        Mobile: entity.Mobile
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("mobile is not found", -1, "mobile is not found");
                    } else {
                        return this.broker.call("sms.create", {
                            UserId: res[0]._id,
                            Value: sms
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });

                    }
                });

            }
        },
        verifySms: {
            cache: false,
            params: {
                Mobile: {
                    type: "string",
                    min: 10,
                    max: 14,
                    optional: false
                },
                Value: {
                    type: "string",
                    min: 6,
                    max: 6,
                    optional: false
                }
            },
            handler(ctx) {
                let request = ctx.params;

                return this.broker.call("user.find", {
                    query:{
                      Mobile: request.Mobile
                    }
                }).then((users) => {
                  console.log(users);
                    if (users == null || users.length == 0) {
                        throw new ValidationError("mobile is not found", -1, "mobile is not found");
                    } else {
                        return this.broker.call("sms.find", {
                            query: {
                                UserId: users[0]._id,
                                Value: request.Value,
                                Status: 1
                            }
                        }).then((res) => {
                            if (res.length > 0) {
                                var newRes = res[0];
                                this.adapter.updateById(newRes._id, {
                                    $set: {
                                        Status: 0
                                    }
                                }).then(doc => {
                                    console.log('sms is used');
                                });
                                return new Response(200, 'success', res);
                            } else {
                                throw new ValidationError("Invalid SMS Code", -1, "Invalid SMS Code");
                            }
                        });

                    }
                });

            }
        }
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
