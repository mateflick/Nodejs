"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Post Schema
 */
var TimeLineSchema = new Schema({

    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
        // type: String
    },
    FileId: {
        type: String
    },
    PostId: {
        type: String
    },
    CreatedAt: {
      // type: Date,
      // default: Date.now
      type: Number,
      default: Date.now
    },
    Type: {
        type: Number,
        default: 1,
        enum: [1, 2] //1 is gallerypost, 2 is event post
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

module.exports = mongoose.model('TimeLine', TimeLineSchema);
