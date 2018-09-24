"use strict";
let chalk = require("chalk");
const bcrypt = require('bcrypt');
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const User = require('../model/user');
const Response = require('../responses/success')

var ObjectID = require('mongodb').ObjectID;


var graph = require('fbgraph');
graph.setVersion("3.0");


var unirest = require("unirest");

const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "user",
    // version: 1,
    model: User,
    mixins: [DbService],
    adapter: new MongooseAdapter("mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb"),


    /**
     * Service settings
     */
    settings: {
        // fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
        //     "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
        //     "CreatedAt", "UserImage"
        // ],
        assets: {
            // Root folder of assets
            folder: "./assets/*",
            // Further options to `server-static` module
            options: {}
        },
    },
    afterConnected() {
        this.logger.info("Connected successfully");
    },
    entityCreated(json) {
        this.logger.info(chalk.cyan.bold("Entity lifecycle event: CREATED") /*, json*/ );
    },

    entityUpdated(json) {
        this.logger.info(chalk.cyan.bold("Entity lifecycle event: UPDATED") /*, json*/ );
    },

    entityRemoved(json) {
        this.logger.info(chalk.cyan.bold("Entity lifecycle event: REMOVED") /*, json*/ );
    },
    actions: {

        register: {
            params: {
                Mobile: {
                    type: "string",
                    // min: 10,
                    // max: 14,
                    optional: false
                },
                SocialId: {
                    type: "string",
                    optional: true
                },
                Password: {
                    type: "string",
                    min: 4,
                    optional: false
                },
                FirstName: {
                    type: "string",
                    // min: 4,
                    optional: false
                },
                CompanyName: {
                    type: "string",
                    // min: 3,
                    optional: true
                },
                SurName: {
                    type: "string",
                    // min: 4,
                    optional: false
                },
                EmailAddress: {
                    type: "email",
                    min: 4,
                    optional: false
                },
                Country: {
                    type: "string",
                    min: 2,
                    optional: true
                },
                DateOfBirth: {
                    type: "string",
                    optional: true
                },
                Token: {
                    type: "string",
                    min: 4,
                    optional: true
                },
                DeviceType: {
                    type: "number",
                    min: 1,
                    max: 2,
                    optional: true
                },
                UserType: {
                    type: "number",
                    min: 1,
                    max: 2,
                    optional: false
                },
                AccountType: {
                    type: "number",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                var query = {};
                if (entity.AccountType == null || entity.AccountType == 0) {
                    query = {
                        $or: [{
                            EmailAddress: entity.EmailAddress,
                            UserType: entity.UserType
                        }, {
                            Mobile: entity.Mobile,
                            UserType: entity.UserType,
                        }]
                    }
                } else {
                    query = {
                        SocialId: entity.SocialId,
                        AccountType: entity.AccountType,
                    }
                }
                return this.broker.call("user.find", {
                        query: query
                    })
                    .then(users => {
                        if (users.length > 0) {
                            throw new ValidationError("EmailAddress or mobile is used before", -1, "EmailAddress or mobile is used before");
                        } else {
                            return this.generateHash(entity.Password).then((hash, err) => {
                                if (!err) {
                                    entity.Password = hash;
                                    if (entity.UserType == 1) {
                                        // remove company name if user is not photographer
                                        entity.CompanyName = undefined;
                                    }
                                    return this.broker.call("user.create", entity)
                                        .then((res) => {
                                            res.Password = undefined;
                                            return new Response(200, 'success', res);
                                        });
                                }
                            });

                        }

                    });

            }
        },
        changePassword: {
            params: {
                Id: {
                    type: "string",
                    convert: true,
                    optional: false
                },
                Password: {
                    type: "string",
                    min: 4,
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                console.log(entity.Id)
                return this.broker.call("user.find", {
                        query: {
                            _id: entity.Id,
                            // $or: [{
                            //     EmailAddress: entity.Id,
                            // }, {

                            // }]
                        }
                    })
                    .then(users => {
                        if (users == null || users.length == 0) {
                            throw new ValidationError("Invalid Id", -1, "Invalid Id");
                        } else {
                            return this.generateHash(entity.Password).then((hash, err) => {
                                if (!err) {
                                    return this.adapter.updateById(users[0]._id, {
                                        $set: {
                                            Password: hash
                                        }
                                    }).then(doc => {
                                        return new Response(200, 'success', "");
                                    });
                                }
                            });
                        }

                    });
            }
        },

        updateProfileImage: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                UserImage: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;

                return this.adapter.updateById(entity.UserId, {
                    $set: {
                        UserImage: entity.UserImage
                    }
                }).then(doc => {
                    console.log('UserImage is updated');
                    return doc;
                });
            }
        },
        updateProfile: {
            params: {
                Mobile: {
                    type: "string",
                    // min: 10,
                    // max: 14,
                    optional: false
                },
                Password: {
                    type: "forbidden"
                },
                FirstName: {
                    type: "string",
                    // min: 4,
                    optional: false
                },
                LastName: {
                    type: "string",
                    // min: 4,
                    optional: false
                },
                EmailAddress: {
                    type: "email",
                    min: 4,
                    optional: false
                },
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.findOne({
                        where: {
                            Mobile: entity.Mobile,
                        },
                        attributes: {
                            exclude: ["Password"]
                        }
                    })
                    .then(user => {
                        if (user == null || user.dataValues == null || user.dataValues.length == 0) {
                            throw new ValidationError("Mobile is not found..", -1, "Mobile is not found..");
                        } else {
                            var userObject = user.dataValues;
                            return this.adapter.updateById(userObject.UserId, {
                                $set: {
                                    FirstName: entity.FirstName,
                                    SurName: entity.SurName,
                                    EmailAddress: entity.EmailAddress
                                }
                            }).then(doc => {
                                doc.Password = undefined;
                                // doc.ProfileImage = "passenger/uploads/" + doc.PassengerId
                                return new Response(200, 'success', doc);
                            });
                        }

                    });
            }
        },
        getProfile: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("user.get", {
                    id: entity.UserId,
                    fields: ["_id", "UserType", "FollowersCount", "PhotoCount","Country", "FollowingsCount", "Mobile", "FirstName", "SurName", "UsedSpace", "EmailAddress", "DateOfBirth", "Token", "DeviceType", "UserImage", "UsedSpace", "Skills"]
                }).then(user => {
                    return new Response(200, 'success', user);
                }).catch(err => {
                    console.log(err);
                    return new Response(-1, 'failed', err.message);
                });
            }
        },
        getProfiles: {
            params: {
                UserId: {
                    type: "array",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("user.find", {
                    query: {
                        _id: entity.UserId,
                    },
                    fields: ["_id", "UserType", "FollowersCount", "PhotoCount", "Country","FollowingsCount", "Mobile", "FirstName", "SurName", "UsedSpace", "EmailAddress", "DateOfBirth", "Token", "DeviceType", "UserImage", "UsedSpace", "Skills"]
                }).then(user => {
                    return new Response(200, 'success', user);
                }).catch(err => {
                    console.log(err);
                    return new Response(-1, 'failed', err.message);
                });
            }
        },
        IncrementSpace: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                },
                UsedSpace: {
                    type: "number",
                    convert: true,
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        UsedSpace: entity.UsedSpace
                    }
                }).then(doc => {
                    console.log('used space is updated');
                    return doc;
                });
            }
        },
        IncrementPhotoCount: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        PhotoCount: 1
                    }
                }).then(doc => {
                    console.log('PhotoCount is updated');
                    return doc;
                });
            }
        },
        IncrementFollowersCount: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        FollowersCount: 1
                    }
                }).then(doc => {
                    console.log('FollowersCount is updated');
                    return doc;
                });
            }
        },
        DecrementFollowersCount: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        FollowersCount: -1
                    }
                }).then(doc => {
                    console.log('FollowersCount is updated');
                    return doc;
                });
            }
        },
        IncrementFollowingCount: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        FollowingsCount: 1
                    }
                }).then(doc => {
                    console.log('FollowingsCount is updated');
                    return doc;
                });
            }
        },
        DecrementFollowingCount: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.adapter.updateById(entity.UserId, {
                    $inc: {
                        FollowingsCount: -1
                    }
                }).then(doc => {
                    console.log('FollowingsCount is updated');
                    return doc;
                });
            }
        },
        IncrementSkill: {
            params: {
                UserId: {
                    type: "string",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                return this.broker.call("user.get", {
                    id: entity.UserId
                }).then(user => {
                    if (user.UserType == 1) {
                        return this.adapter.updateById(entity.UserId, {
                            $inc: {
                                Skills: 1
                            }
                        }).then(doc => {
                            console.log('skill is updated');
                            return doc;
                        });
                    }
                    console.log('no need to increment skill');

                });
            }
        },
        search: {
            params: {
                Name: {
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
                return this.broker.call("user.list", {
                    query: {
                        $or: [{
                            FirstName: {
                                $regex: new RegExp(entity.Name, "i")
                            },
                        }, {
                            SurName: {
                                $regex: new RegExp(entity.Name, "i")
                            }
                        }]
                    },
                    fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
                        "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
                        "CreatedAt", "UserImage"
                    ],
                    // search: entity.search,
                    page: entity.pageNumber,
                    pageSize: entity.pageSize,
                    // searchFields: ["Name"]
                }).then((users) => {
                    return new Response(200, 'success', users);
                });

            }
        },
        searchForPhotgrapher: {
            params: {
                Name: {
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
                return this.broker.call("user.list", {
                    query: {
                        $or: [{
                            FirstName: {
                                $regex: new RegExp(entity.Name, "i")
                            },
                        }, {
                            SurName: {
                                $regex: new RegExp(entity.Name, "i")
                            }
                        }],
                        UserType: 2
                    },
                    fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
                        "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
                        "CreatedAt", "UserImage"
                    ],
                    page: entity.pageNumber,
                    pageSize: entity.pageSize,
                }).then((users) => {
                    return new Response(200, 'success', users);
                });

            }
        },
        listSuggestedPhotgraphers: {
            params: {
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
                return this.broker.call("follower.list", {
                    query: {
                        UserId: ObjectID(entity.UserId + ""),
                    },
                    fields: ["FollowerId"]
                }).then(results => {
                    const ids = [];
                    ids.push(entity.UserId);
                    results.rows.forEach(row => {
                        if (row.FollowerId != entity.UserId) {
                            ids.push(row.FollowerId);
                        }
                    });
                    return this.broker.call("user.list", {
                        query: {
                            _id: {
                                $nin: ids
                            },
                            UserType: 2
                        },
                        page: entity.pageNumber,
                        pageSize: entity.pageSize,
                        fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
                            "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
                            "CreatedAt", "UserImage"
                        ],
                    }).then(users => {
                        return new Response(200, 'success', users);
                    });
                });
            }
        },
        listSuggestedUsers: {
            params: {
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
                return this.broker.call("follower.list", {
                    query: {
                        UserId: ObjectID(entity.UserId + ""),
                    },
                    fields: ["FollowerId"]
                }).then(results => {
                    const ids = [];
                    ids.push(entity.UserId);
                    results.rows.forEach(row => {
                        if (row.FollowerId != entity.UserId) {
                            ids.push(row.FollowerId);
                        }
                    });
                    return this.broker.call("user.list", {
                        query: {
                            _id: {
                                $nin: ids
                            },
                            UserType: 1
                        },
                        fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
                            "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
                            "CreatedAt", "UserImage"
                        ],
                        page: entity.pageNumber,
                        pageSize: entity.pageSize,
                    }).then(users => {
                        return new Response(200, 'success', users);
                    });
                });
            }
        },
        login: {
            params: {
                Id: {
                    type: "string",
                    min: 4,
                    max: 30,
                    optional: false
                },
                Password: {
                    type: "string",
                    min: 4,
                    optional: false
                },
                Token: {
                    type: "string",
                    min: 4,
                    optional: true
                },
                DeviceType: {
                    type: "number",
                    min: 1,
                    max: 2,
                    optional: true
                },
                UserType: {
                    type: "number",
                    enum: [1, 2],
                    optional: true
                },
                AccountType: {
                    type: "number",
                    optional: true
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                var query = {};
                if (entity.AccountType == null || entity.AccountType == 0) {
                    query = {
                        $or: [{
                            EmailAddress: entity.Id,
                            UserType: entity.UserType
                        }, {
                            Mobile: entity.Id,
                            UserType: entity.UserType,
                        }]
                    }
                } else {
                    query = {
                        SocialId: entity.Id,
                        AccountType: entity.AccountType,
                    }
                }

                return this.broker.call("user.find", {
                        query: query,
                        fields: ["UserType", "AccountType", "UsedSpace", "Skills", "PhotoCount", "FollowingsCount", "FollowersCount",
                            "_id", "Mobile", "SocialId", "FirstName", "SurName", "EmailAddress", "DateOfBirth", "Token", "DeviceType",
                            "CreatedAt", "UserImage","Password","Country"
                        ],
                    })
                    .then(users => {
                      console.log(users);
                        if (users == null || users.length == 0) {
                            throw new ValidationError("Invalid EmailAddress/Password", -1, "Invalid EmailAddress/Password");
                        } else {
                            var user = users[0];
                            if (entity.AccountType == null || entity.AccountType == 0) {
                                return this.comparePassword(entity.Password, user.Password).then((res, err) => {
                                    if (err) {
                                        throw new ValidationError("System error", -1, "System error");
                                    } else if (res) {
                                        user.Password = undefined;
                                        if (entity.Token != null) {
                                            this.adapter.updateById(users.UserId, {
                                                $set: {
                                                    Token: entity.Token,
                                                    DeviceType: entity.DeviceType
                                                }
                                            }).then(doc => {
                                                console.log('token updated...');
                                            });
                                        }
                                        return new Response(200, 'success', user);
                                    } else {
                                        throw new ValidationError("Invalid EmailAddress/Password", -1, "Invalid EmailAddress/Password");
                                    }
                                });
                            } else if (entity.AccountType == 1) { // facebook
                                return new Promise(function(resolve, reject) {
                                    graph.get("me?fields=picture,name,id,email&access_token=" + entity.Password, function(err, res) {
                                        if (err) {
                                            reject(new ValidationError("Invalid EmailAddress/Token", -1, "Invalid EmailAddress/Token"));
                                        } else {
                                            resolve(new Response(200, 'success', user));
                                        }
                                    });
                                });
                            } else if (entity.AccountType == 2) { // instagram login
                                var req = unirest("GET", "https://api.instagram.com/v1/users/self/");
                                return new Promise(function(resolve, reject) {
                                    req.query({
                                        "access_token": entity.Password
                                        // "access_token": "4488990116.04fbfdd.760e293d7aec4505be8c0079bf098056"
                                    });
                                    req.end(function(res) {
                                        if (res.error) {
                                            if (res.body.meta.code != 200) {
                                                console.log(res.body);
                                                reject(new ValidationError("Invalid EmailAddress/Token", -1, "Invalid EmailAddress/Token"));
                                            }
                                        } else {
                                            resolve(new Response(200, 'success', user));
                                            // resolve(res.body);
                                        }
                                    });
                                });
                            }



                        }

                    });

            }
        }
    },

    /**
     * Service metadata
     */
    metadata: {

    },

    /**
     * Service dependencies
     */
    //dependencies: [],

    /**
     * Actions
     */

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        generateHash: function(password) {
            return bcrypt.hash(password, 10);
            // return bcrypt.genSalt(10, function(err, salt) {
            //   return   bcrypt.hash(password, salt);
            // });

        },
        comparePassword: function(password, hash) {
            return bcrypt.compare(password, hash);
        },
        cryptPassword(password) {
            return new Promise(function(resolve, reject) {

            });

        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {

    }
};
