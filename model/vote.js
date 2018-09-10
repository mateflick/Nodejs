"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * FollowersSchema Schema
 */
var VotesSchema = new Schema({


    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    ChallengePostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'challengeposts'
    },
    CreatedAt: {
        type: Number,
        default: Date.now
    },
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('Votes', VotesSchema);
