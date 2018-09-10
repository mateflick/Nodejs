"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Sms Schema
 */
var SmsSchema = new Schema({

    UserId: {
        type: String
    },
    Value: {
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

module.exports = mongoose.model('Sms', SmsSchema);
