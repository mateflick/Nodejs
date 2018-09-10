
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * ChallengePost Schema
 */
var ChallengePostSchema = new Schema({

    ChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'challenges'
    },
    FileId: {
        type: Object
    },
    PhotographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    Title: {
        type: String
    },
    Vote: {
        type: Number,
        default:0
    },
    CreatedAt: {
      type: Number,
      default: Date.now
    },
    Status: {
        type: Number,
        default: 1,
        enum: [1, 0]
    }
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('ChallengePost', ChallengePostSchema);
