"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Sms Schema
 */
var FileSchema = new Schema({

    filename: {
        type: String
    },
    contentType: {
        type: String
    },
    uploadDate: {
        type: Date
    },
    md5: {
        type: String
    },
    chunkSize: {
        type: Number
    },
    length: {
        type: Number,
    }
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('fs.files', FileSchema);
