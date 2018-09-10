"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const Event = require('../model/event');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "event",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://localhost:27017/mateflick"),
    model: Event,
    settings: {

    },
    actions: {
        createEvent: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                Name: {
                    type: "string",
                    optional: false
                },
                Description: {
                    type: "string",
                    optional: false
                },
                Location: {
                    type: "string",
                    optional: false
                },
                EventDate: {
                    type: "number",
                    convert: true,
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("event.find", {
                    query: {
                        UserId: entity.UserId,
                        Name: entity.Name,
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return this.broker.call("event.create", {
                            UserId: entity.UserId,
                            Location: entity.Location,
                            EventDate: entity.EventDate,
                            // EventDate: new Date(entity.EventDate),
                            Description: entity.Description,
                            Name: entity.Name
                        }).then(doc => {
                            return new Response(200, 'success', doc);
                        });

                    } else {
                        throw new ValidationError("you already created event with same name", -1, "you already created event with same name");

                    }
                });

            }
        },
        listPastEvents: {
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
                return this.broker.call("event.find", {
                    query: {
                        UserId: entity.UserId,
                        EventDate: {
                            "$lte": new Date()
                        }
                    },
                    sort: "-EventDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no events for this user", -1, "no events for this user");
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        listAllPastEvents: {
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
                return this.broker.call("event.find", {
                    query: {
                        EventDate: {
                            "$lte": new Date()
                        }
                    },
                    sort: "-EventDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no events for this user", -1, "no events for this user");
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        listUpcomingEvents: {
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
                return this.broker.call("event.find", {
                    query: {
                        UserId: entity.UserId,
                        EventDate: {
                            "$gte": new Date()
                        }
                    },
                    sort: "-EventDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no events for this user", -1, "no events for this user");
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        listAllUpcomingEvents: {
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
                return this.broker.call("event.find", {
                    query: {
                        EventDate: {
                            "$gte": new Date()
                        }
                    },
                    sort: "-EventDate",
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no events for this user", -1, "no events for this user");
                    } else {
                        return new Response(200, 'success', res);
                    }
                });
            }
        },
        updateCoverImage: {
            params: {
                EventId: {
                    type: "string",
                    optional: false
                },
                CoverImage: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("event.find", {
                    query: {
                        _id: entity.EventId
                    }
                }).then(res => {
                    if (res.length > 0 && res[0].CoverImage != null) {
                        console.log('already there is cover image');
                        return;
                    }
                    return this.adapter.updateById(entity.EventId, {
                        $set: {
                            CoverImage: entity.CoverImage
                        }
                    }).then(doc => {
                        console.log('event Cover Image is updated');
                        return doc;
                    });
                });

            }
        },
        deleteEvents: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("event.find", {
                    query: {
                        UserId: entity.UserId,
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no events for this user", -1, "no events for this user");
                    } else {
                        res.forEach(async (event) => {
                            this.broker.call("event.remove", {
                                id: event._id,
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
                Search: {
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
                return this.broker.call("event.list", {
                    query: {
                        $or: [{
                            Name: {
                                // $regex: '.*'  + entity.Search  + '.*'
                                $regex: new RegExp(entity.Search, "i")
                            }
                        }, {
                            Location: {
                                $regex: new RegExp(entity.Search, "i")
                            }
                        }]

                    },
                    page: entity.pageNumber,
                    pageSize: entity.pageSize,
                }).then((events) => {
                    return new Response(200, 'success', events);
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
