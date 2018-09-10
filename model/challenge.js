"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Timestamp = mongoose.mongo.Timestamp;
/**
 * Event Schema
 */
var ChallengeSchema = new Schema({

    Name: {
        type: String
    },
    Description: {
        type: String
    },
    Prize: {
        type: Number
    },
    Votes: {
        type: Number,
    },
    StartDate: {
        type: Number,
    },
    EndDate: {
        type: Number,
    },
    CreatedAt: {
        type: Number,
        default: Date.now
    },
    Status: {
        type: Number,
        default: 1,
        enum: [1, 0] // 1 is active, 0 inactive
    }
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
