"use strict";
let chalk = require("chalk");

// var randomstring = require("randomstring");
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const ChallengePost = require('../model/challenge.posts');
let Response = require('../responses/success');
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "postchallenge",
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://iostriz:sbsljm30@ds251362.mlab.com:51362/mateflickdb"),
    model: ChallengePost,
    settings: {

    },
    actions: {
        vote: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                ChallengePostId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("postchallenge.find", {
                    query: {
                        _id: entity.ChallengePostId,
                    }
                }).then((post) => {
                    if (post == null || post.length == 0) {
                        throw new ValidationError("No post available", -1, "No post available");
                    } else {
                        // check if user vote tfor this post before
                        return this.broker.call("votes.find", {
                            query: {
                                UserId: entity.UserId,
                                ChallengePostId: entity.ChallengePostId,
                            }
                        }).then((res) => {

                            if (res == null || res.length == 0) {
                                // register this user as voter to this post
                                this.broker.call("votes.new", {
                                    UserId: entity.UserId,
                                    ChallengePostId: entity.ChallengePostId
                                }).then(res => {
                                    // console.log(res);
                                });
                                // incerment skills of voter(if userType = 1)
                                this.broker.call("user.IncrementSkill", {
                                    UserId: entity.UserId
                                }).then(res => {
                                    // console.log(res);
                                });
                                this.broker.call("challenge.increaseVotes", {
                                    ChallengeId: post[0].ChallengeId+""
                                }).then(res => {
                                    console.log(res);
                                }).catch(err =>{console.log(err);});

                                // increase votes number of post
                                return this.adapter.updateById(entity.ChallengePostId, {
                                    $inc: {
                                        Vote: 1
                                    }
                                }).then(doc => {
                                    return doc;
                                });
                            } else {
                                throw new ValidationError("you have already voted to this post", -1, "you have already voted to this post");
                            }
                        });
                    }
                });
            }
        },
        add: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
                FileId: {
                    type: "string",
                    optional: false
                },
                PhotographerId: {
                    type: "string",
                    optional: false
                },
                Title: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("postchallenge.find", {
                    query: {
                        ChallengeId: entity.ChallengeId,
                        FileId: entity.FileId,
                        PhotographerId: entity.PhotographerId
                    }
                }).then((res) => {
                    if (res == null || res.length == 0) {
                        return this.broker.call("postchallenge.create", {
                            ChallengeId: entity.ChallengeId,
                            FileId: entity.FileId,
                            Title: entity.Title,
                            PhotographerId: entity.PhotographerId
                        }).then((doc) => {
                            return new Response(200, 'success', doc);
                        });
                    } else {
                        throw new ValidationError("Post already uploaded", -1, "Post already uploaded");

                    }
                });
            }
        },
        addWithoutFileId: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
                PhotographerId: {
                    type: "string",
                    optional: false
                },
                Title: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("postchallenge.create", {
                    ChallengeId: entity.ChallengeId,
                    Title: entity.Title,
                    PhotographerId: entity.PhotographerId
                }).then((doc) => {
                    return new Response(200, 'success', doc);
                });
            }
        },
        updateFileId: {
            params: {
                FileId: {
                    type: "string",
                    optional: false
                },
                Id: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.Id, {
                    $set: {
                        FileId: entity.FileId
                    }
                }).then(doc => {
                    this.logger.info("Challenge post is updated");
                    return doc;
                });
            }
        },
        listPostsOfChallenge: {
            params: {
                ChallengeId: {
                    type: "string",
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("postchallenge.list", {
                    ChallengeId: entity.ChallengeId,
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
