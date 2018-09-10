"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * FollowersSchema Schema
 */
var FollowersSchema = new Schema({


    UserId: {
        type: String // mongoose.Schema.Types.ObjectId,
        // ref: 'users'
    },
    FollowerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    FollowingType: {
        type: Number, // 1 is normal, 2 is friend, 3 is family
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

module.exports = mongoose.model('Followers', FollowersSchema);
