"use strict";

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");

var fs = require('fs');
const gallery = require('../model/gallery');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "gallery",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb"),
    model: gallery,
    settings: {

    },
    actions: {
        createGallery: {
            params: {
                Title: {
                    type: "string",
                    min: 3,
                    max: 14,
                    optional: false
                },
                Description: {
                    type: "string",
                    min: 3,
                    max: 150,
                    optional: false
                },
                Location: {
                    type: "string",
                    optional: false
                },
                Event: {
                    type: "string",
                    optional: true
                },
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("user.find", {
                    query: {
                        _id: entity.UserId
                    }
                }).then(res => {

                    if (res.length == 0) {
                        throw new ValidationError("user not found", -1, "user not found");

                    } else {
                        return this.broker.call("gallery.create", {
                            UserId: entity.UserId,
                            Title: entity.Title,
                            Location: entity.Location,
                            Event: entity.Event,
                            Description: entity.Description,
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });
                    }
                });


            }
        },
        listUserGallery: {
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
                return this.broker.call("gallery.list", {
                    query: {
                        UserId: entity.UserId
                    },
                    page: entity.page,
                    pageSize: entity.pageSize
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("no gallery found", -1, "no gallery found");
                    } else {
                        return new Response(200, 'success', res);
                    }
                });

            }
        },
        updateGallery: {
            params: {
                Title: {
                    type: "string",
                    // min: 3,
                    // max: 14,
                    optional: false
                },
                Description: {
                    type: "string",
                    min: 3,
                    max: 150,
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
                return this.broker.call("gallery.find", {
                    query: {
                        _id: entity.GalleryId,
                        UserId: entity.UserId
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("Gallery is not found", -1, "Gallery is not found");

                    } else {
                        return this.adapter.updateById(res[0]._id, {
                            $set: {
                                Title: entity.Title,
                                Description: entity.Description,
                            }
                        }).then(doc => {
                            return new Response(200, 'success', doc);
                        });
                    }
                });

            }
        },
        updateCoverImage: {
            params: {
                GalleryId: {
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
                return this.broker.call("gallery.find", {
                    query: {
                        _id: entity.GalleryId
                    }
                }).then(res => {
                    if (res.length > 0 && res[0].CoverImage != null) {
                        console.log('already there is cover image');
                        return;
                    }
                    return this.adapter.updateById(entity.GalleryId, {
                        $set: {
                            CoverImage: entity.CoverImage
                        }
                    }).then(doc => {
                        console.log('gallery is updated');
                        return doc;
                    });
                });

            }
        },
        removeGallery: {
            params: {
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
                return this.broker.call("gallery.find", {
                    query: {
                        _id: entity.GalleryId,
                        UserId: entity.UserId
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        throw new ValidationError("Gallery is not found", -1, "Gallery is not found");
                    } else {
                        // var dir = entity.UserId + "_" + entity.GalleryId;
                        // var path = "./galleries/" + dir;
                        // fs.rmdirSync(path);
                        return this.broker.call("gallery.remove", {
                            id: entity.GalleryId
                        }).then(res => {
                            return new Response(200, 'success', 'removed successfully');

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
