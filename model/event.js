"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Timestamp = mongoose.mongo.Timestamp;
/**
 * Event Schema
 */
var EventSchema = new Schema({

    Name: {
        type: String
    },
    Location: {
        type: String
    },
    Description: {
        type: String
    },
    UserId: {
        type: String
    },
    CoverImage: {
        type: String
    },
    EventDate: {
        type: Number,

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
//
// EventSchema.virtual('evetTimeStamp').get(function () {
//     console.log('safwan');
//   return this.EventDate.getTime();
// });

module.exports = mongoose.model('Event', EventSchema);
