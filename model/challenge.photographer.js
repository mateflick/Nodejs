"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * ChallengePost Schema
 */
var ChallengePhotographerSchema = new Schema({

    ChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'challenges'
    },
    PhotographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    CreatedAt: {
      type: Number,
      default: Date.now
    },
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('ChallengePhotographer', ChallengePhotographerSchema);
