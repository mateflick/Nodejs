"use strict";

const ApiGateway = require("moleculer-web");
const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;
const multer = require('multer');
// const mongoURI = 'mongodb://localhost:27017/mateflick';
const mongoURI = 'mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb';
var mongoose = require('mongoose');
// Create a storage object with a given configuration
const storage = require('multer-gridfs-storage')({
    url: mongoURI
});
const Grid = require('gridfs-stream');
const conn = mongoose.createConnection(mongoURI);
let gfs;
conn.once('open', function() {
    gfs = Grid(conn.db, mongoose.mongo);
    // all set!
});


// Set multer storage engine to the newly created object
const upload = multer({
    storage: storage
});

const {
    ServiceBroker
} = require("moleculer");
let broker = new ServiceBroker({
    logger: console,
    transporter: null
})
broker.loadService(__dirname + "/post.service.js");

module.exports = {
        name: "api",
        mixins: [ApiGateway],
        settings: {
            routes: [{
                    path: "/user",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /login": "user.login",
                        "POST /profile": "user.getProfile",
                        "POST /profiles": "follower.getProfiles",
                        "POST /search": "user.search",
                        "POST /photographer/search": "user.searchForPhotgrapher",
                        "POST /suggestedPhotographers": "user.listSuggestedPhotgraphers", // list suggestions
                        "POST /suggestedUsers": "user.listSuggestedUsers", // list suggestions
                        "POST /register": "user.register",
                        "POST /changePassword": "user.changePassword",
                        "POST /image/:UserId" (req, res) {
                            this.uploadUserImage(req, res);
                        },
                    },
                    whitelist: [
                        "user.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/challenge",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /create": "challenge.new",
                        "DELETE /delete": "challenge.delete",
                        "POST /list/upcoming": "challenge.listUpcomingChallenges",
                        "POST /list/past": "challenge.listPastChallenges",
                        "POST /search": "challenge.search",
                    },
                    whitelist: [
                        "challenge.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/photochallenge",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /join": "photochallenge.join",
                        "POST /unjoin": "photochallenge.unjoin",
                    },
                    whitelist: [
                        "photochallenge.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/postchallenge",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /add": "postchallenge.add",
                        "GET /list/:ChallengeId": "postchallenge.listPostsOfChallenge",
                        "POST /vote": "postchallenge.vote",
                        "POST /:ChallengeId/user/:PhotographerId/title/:Title" (req, res) {
                            this.uploadChallengePost(req, res);
                        },
                    },
                    whitelist: [
                        "postchallenge.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/event",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /create": "event.createEvent",
                        "POST /search": "event.search",
                        "POST /list/past": "event.listPastEvents",
                        "POST /list/all/past": "event.listAllPastEvents",
                        "POST /list/upcoming": "event.listUpcomingEvents",
                        "POST /list/all/upcoming": "event.listAllUpcomingEvents",
                        "POST /delete": "event.deleteEvents",

                    },
                    whitelist: [
                        "event.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/evpost",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /list": "eventpost.listPost",
                        "POST /event/:EventId/user/:UserId/title/:Title" (req, res) {
                            this.uploadEventPost(req, res);
                        },
                    },
                    whitelist: [
                        "evpost.*",
                        "eventpost.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/gallery",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /new": "gallery.createGallery",
                        "POST /update": "gallery.updateGallery",
                        "POST /remove": "gallery.removeGallery",
                        "POST /list": "gallery.listUserGallery",
                    },
                    whitelist: [
                        "gallery.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/timeline",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /user": "timeline.listUserTimeLine1",
                    },
                    whitelist: [
                        "timeline.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/follow",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /": "follower.follow",
                        "POST /myPhotgraphers": "follower.searchMyPhotgraphers", // search in my photographers
                        "POST /myUsers": "follower.searchMyUsers", // search in my friends
                        "POST /unfollow": "follower.unFollow",
                        "POST /followers": "follower.listFollowers",
                        "POST /followings": "follower.listFollowings",
                    },
                    whitelist: [
                        "follower.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/like",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "POST /": "like.like",
                        "POST /unLike": "like.unLike",
                        "POST /likes": "like.listLikes",
                        "GET /count/likes/:UserId": "like.countLikes",
                        "POST /myLikes": "like.listMyLikes",
                        "GET /count/myLikes/:LikeBy": "like.countMyLikes",
                    },
                    whitelist: [
                        "like.*",
                    ],
                    bodyParsers: {
                        json: true,
                        urlencoded: {
                            extended: true
                        }
                    }
                },
                {
                    path: "/files",
                    authorization: false,
                    aliases: {
                        // Access to any actions in all services
                        "GET /size": "files.getallszie",
                        "GET /size/user/:UserId": "files.getallsizeforuser",
                        "POST /list": "files.listFiles",
                        "GET /fileInfo/:FileName": "files.getFileInfo",
                        "GET /fileInfoById/:FileId": "files.getFileInfoById",
                        "GET /file/:FileName" (req, res) {
                            return this.broker.call("files.getFile", {
                                    req: req,
                                    res: res,
                                    FileName: req.$params.FileName
                                }).then(resw => {
                                        if (resw == null) {
                                            console.log('getting file');
                                        } else {
                                            res.writeHead(500, {
                                                'Content-Type': 'application/json'
                                            });
                                            res.end(JSON.stringify(resw), 'err');
                                            }
                                        });
                                },
                                "GET /fileById/:FileId" (req, res) {
                                    return this.broker.call("files.getFile", {
                                        req: req,
                                        res: res,
                                        FileName: req.$params.FileId
                                    }).then(res => {
                                        console.log('called');
                                    });
                                },
                        },
                        whitelist: [
                            "files.*",
                        ],
                        bodyParsers: {
                            json: true,
                            urlencoded: {
                                extended: true
                            }
                        }
                    },
                    {
                        path: "/post",
                        authorization: false,
                        aliases: {
                            "POST /listbygallery": "post.listPostsByGallery",
                            "POST /countbygallery": "post.countPostsByGallery",
                            "POST /gallery/:GalleryId/user/:UserId/title/:title" (req, res) {
                                this.parseUploadImage(req, res);
                            },
                        },
                        whitelist: [
                            "post.*",
                        ],
                        bodyParsers: {
                            json: true,
                            urlencoded: {
                                extended: true
                            }
                        }
                    },
                    {
                        path: "/sms",
                        authorization: false,
                        aliases: {
                            // Access to any actions in all services
                            "POST /sendSms": "sms.sendSms",
                            "POST /verifySms": "sms.verifySms",
                        },
                        whitelist: [
                            "sms.*",
                        ],
                        bodyParsers: {
                            json: true,
                            urlencoded: {
                                extended: true
                            }
                        }
                    },
                ],
            },

            methods: {
                // Second thing
                authorize(ctx, route, req, res) {
                    // Read the token from header
                    let auth = req.headers["authorization"];
                    if (auth && auth.startsWith("Bearer")) {
                        let token = auth.slice(7);

                        return this.Promise.resolve(token)
                            .then(token => {
                                if (token) {
                                    // Verify JWT token
                                    return ctx.call("users.resolveToken", {
                                            token
                                        })
                                        .then(user => {
                                            if (user) {
                                                this.logger.info("Authenticated via JWT: ", user.socialId);
                                                // store user and token object in ctx.meta
                                                // they are access from other apis
                                                ctx.meta.user = user;
                                                ctx.meta.token = token;
                                            }
                                            return user;
                                        })
                                        .catch(err => {
                                            // Ignored because we continue processing if user is not exist
                                            return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
                                        });
                                }
                            });
                    } else {
                        // No token
                        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
                    }
                },
                parseUploadImage(req, res) {
                    return this.broker.call("gallery.find", {
                        query: {
                            _id: req.$params.GalleryId,
                            UserId: req.$params.UserId
                        }
                    }).then((ress) => {
                        if (ress == null || ress.length == 0) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json'
                            });
                            res.end(JSON.stringify({
                                code: -1,
                                message: 'Gallery is not found'
                            }), 'err');
                        } else {
                            return this.broker.call("post.createPost", {
                                GalleryId: req.$params.GalleryId,
                                UserId: req.$params.UserId,
                                Title: req.$params.title
                            }).then(doc => {
                                if (doc == null) {
                                    this.logger.error("Error uploading file!", err);
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: -1,
                                        message: 'failed'
                                    }), 'err');
                                } else {
                                    const sUpload = upload.single('file');
                                    sUpload(req, res, err => {
                                        if (req.file == null) {
                                            res.writeHead(500, {
                                                'Content-Type': 'application/json'
                                            });
                                            res.end(JSON.stringify({
                                                code: -1,
                                                message: 'no file is uploaded'
                                            }), 'err');
                                            return;
                                        }
                                        this.logger.info("File uploaded!");
                                        // add post file to gallery (cover image)
                                        this.broker.call("gallery.updateCoverImage", {
                                            GalleryId: req.$params.GalleryId,
                                            CoverImage: req.file.id + ""
                                        }).then(res => {});

                                        // increase used space for this user/photographer
                                        this.broker.call("user.IncrementSpace", {
                                            UserId: req.$params.UserId,
                                            UsedSpace: req.file.size
                                        }).then(doc => {
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                        // IncrementPhotoCount
                                        this.broker.call("user.IncrementPhotoCount", {
                                            UserId: req.$params.UserId,
                                        }).then(doc => {
                                        }).catch(err => {
                                            console.log(err);
                                        });

                                        // add post to timeline
                                        this.broker.call("timeline.create", {
                                            UserId: req.$params.UserId,
                                            PostId: doc.data._id,
                                            FileId: req.file.id + ""
                                        }).then(res => {
                                            console.log('new record added to timeline');
                                        });

                                        return this.broker.call("post.updatePost", {
                                            PostId: doc.data._id,
                                            FileId: req.file.id + ""
                                        }).then(doc => {
                                            res.writeHead(200, {
                                                'Content-Type': 'application/json'
                                            });
                                            res.end(JSON.stringify({
                                                code: 200,
                                                message: 'success'
                                            }));
                                        }).catch(err => {
                                            res.writeHead(500, {
                                                'Content-Type': 'application/json'
                                            });
                                            return res.end(JSON.stringify({
                                                code: -1,
                                                message: 'failed'
                                            }), err);
                                        });


                                    });
                                }
                            }).catch(err => {
                                console.log(err);
                                res.writeHead(500, {
                                    'Content-Type': 'application/json'
                                });
                                return res.end(JSON.stringify({
                                    code: -1,
                                    message: 'failed'
                                }), err);
                            });
                        }
                    }).catch(err => {
                        res.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        return res.end(JSON.stringify({
                            code: -1,
                            message: 'failed: ' + err.message
                        }), err);
                    });
                },
                uploadUserImage(req, res) {
                    return this.broker.call("user.find", {
                        query: {
                            _id: req.$params.UserId
                        }
                    }).then((ress) => {
                        if (ress == null || ress.length == 0) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json'
                            });
                            res.end(JSON.stringify({
                                code: -1,
                                message: 'User is not found'
                            }), 'err');
                        } else {
                            // remove old image
                            var user = ress[0];
                            if (user.UserImage != null) {
                                this.broker.call("files.remove", {
                                    id: user.UserImage
                                }).then(res1 => {
                                    console.log('old image is removed correctly');
                                });
                            }

                            const sUpload = upload.single('file');
                            sUpload(req, res, err => {
                                if (req.file == null) {
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: -1,
                                        message: 'no file is uploaded'
                                    }), 'err');
                                    return;
                                }
                                this.logger.info("File uploaded!");
                                return this.broker.call("user.updateProfileImage", {
                                    UserImage: req.file.id + "",
                                    UserId: req.$params.UserId
                                }).then(res1 => {
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: 200,
                                        message: 'success'
                                    }));
                                });
                            });


                        }
                    }).catch(err => {
                        res.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        return res.end(JSON.stringify({
                            code: -1,
                            message: 'failed: ' + err.message
                        }), err);
                    });
                },
                uploadEventPost(req, res) {
                    this.logger.info("Incoming file!");
                    return this.broker.call("eventpost.createEventPost", {
                        UserId: req.$params.UserId,
                        EventId: req.$params.EventId,
                        Title: req.$params.Title
                    }).then(doc => {
                        if (doc == null) {
                            this.logger.error("Error uploading file!", err);
                            res.writeHead(500, {
                                'Content-Type': 'application/json'
                            });
                            return res.end(JSON.stringify({
                                code: -1,
                                message: 'failed'
                            }), 'err');
                        } else {
                            const sUpload = upload.single('file');
                            sUpload(req, res, err => {
                                if (req.file == null) {
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: -1,
                                        message: 'no file is uploaded'
                                    }), 'err');
                                    return;
                                }
                                this.logger.info("File uploaded!");

                                // add post file to gallery (cover image)
                                this.broker.call("event.updateCoverImage", {
                                    EventId: req.$params.EventId,
                                    CoverImage: req.file.id + ""
                                }).then(res => {});

                                // add post to timeline
                                this.broker.call("timeline.create", {
                                    UserId: req.$params.UserId,
                                    FileId: req.file.id + "",
                                    PostId: doc.data._id,
                                    Type:2
                                }).then(res => {
                                  console.log('new record added to timeline');
                                });
                                // increase used space for this user/photographer
                                this.broker.call("user.IncrementSpace", {
                                    UserId: req.$params.UserId,
                                    UsedSpace: req.file.size
                                }).then(doc => {
                                }).catch(err => {
                                    console.log(err);
                                });

                                // IncrementPhotoCount
                                this.broker.call("user.IncrementPhotoCount", {
                                    UserId: req.$params.UserId,
                                }).then(doc => {
                                }).catch(err => {
                                    console.log(err);
                                });

                                return this.broker.call("eventpost.updateEventPost", {
                                    EventPostId: doc.data._id,
                                    FileId: req.file.id
                                }).then(doc => {
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: 200,
                                        message: 'success'
                                    }));
                                }).catch(err => {
                                    console.log(err);
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    return res.end(JSON.stringify({
                                        code: -1,
                                        message: 'failed'
                                    }), err);
                                });
                            });
                        }
                    }).catch(err => {
                        res.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        return res.end(JSON.stringify({
                            code: -1,
                            message: 'failed'
                        }), err);
                    });
                },
                uploadChallengePost(req, res) {
                    this.logger.info("Incoming file!");
                    return this.broker.call("postchallenge.addWithoutFileId", {
                        PhotographerId: req.$params.PhotographerId,
                        ChallengeId: req.$params.ChallengeId,
                        Title: req.$params.Title
                    }).then(challengeImage => {
                        if (challengeImage == null) {
                            this.logger.error("Error uploading file!", err);
                            res.writeHead(500, {
                                'Content-Type': 'application/json'
                            });
                            return res.end(JSON.stringify({
                                code: -1,
                                message: 'failed'
                            }), 'err');
                        } else {
                            const sUpload = upload.single('file');
                            sUpload(req, res, err => {
                                if (req.file == null) {
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: -1,
                                        message: 'no file is uploaded'
                                    }), 'err');
                                    return;
                                }
                                this.logger.info("File uploaded!");

                                // increase used space for this user/photographer
                                this.broker.call("user.IncrementSpace", {
                                    UserId: req.$params.PhotographerId,
                                    UsedSpace: req.file.size
                                }).then(doc => {
                                }).catch(err => {
                                    console.log(err);
                                });

                                // IncrementPhotoCount
                                this.broker.call("user.IncrementPhotoCount", {
                                    UserId: req.$params.PhotographerId,
                                }).then(doc => {
                                }).catch(err => {
                                    console.log(err);
                                });

                                return this.broker.call("postchallenge.updateFileId", {
                                    Id: challengeImage.data._id,
                                    FileId: req.file.id+""
                                }).then(doc => {
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end(JSON.stringify({
                                        code: 200,
                                        message: 'success'
                                    }));
                                }).catch(err => {
                                    console.log(err);
                                    res.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });
                                    return res.end(JSON.stringify({
                                        code: -1,
                                        message: 'failed'
                                    }), err);
                                });
                            });
                        }
                    }).catch(err => {
                        res.writeHead(500, {
                            'Content-Type': 'application/json'
                        });
                        return res.end(JSON.stringify({
                            code: -1,
                            message: 'failed'
                        }), err);
                    });
                },

            }

        };
