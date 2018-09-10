
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Post Schema
 */
var EventPostSchema = new Schema({

    EventId: {
        type: String
    },
    FileId: {
        type: Object
    },
    UserId: {
        type: String
    },
    Title: {
        type: String
    },
    CreatedAt: {
      // type: Date,
      // default: Date.now
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

module.exports = mongoose.model('EventPost', EventPostSchema);
