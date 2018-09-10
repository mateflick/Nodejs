"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * FollowersSchema Schema
 */
var LikesSchema = new Schema({


    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    LikeBy: {
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    CreatedAt: {
        // type: Date,
        // default: Date.now
        type: Number,
        default: Date.now
    },
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('Likes', LikesSchema);
