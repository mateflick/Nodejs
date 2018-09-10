"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User Schema
 */
var UserSchema = new Schema({

    UserType: {
        type: Number,
        default: 1
    }, // 1 = mate, 2 = photographer
    AccountType: {
        type: Number,
        default: 0
    }, // 1 = facebook, 2 = instagram
    SocialId: {
        type: String
    },
    Mobile: {
        type: String
    },
    Password: {
        type: String
    },
    DeviceType: {
        type: Number,
        enum: [1, 2]
    },
    CompanyName: {
        type: String
    },
    FirstName: {
        type: String
    },
    EmailAddress: {
        type: String
    },
    SurName: {
        type: String
    },
    DateOfBirth: {
        type: String
    },
    UserImage: {
        type: String
    },
    UsedSpace: {
        type: Number,
        default: 0
    },
    Skills: {
        type: Number,
        default: 0
    },
    PhotoCount: {
        type: Number,
        default: 0
    },
    FollowersCount: {
        type: Number,
        default: 0
    },
    FollowingsCount: {
        type: Number,
        default: 0
    },
    CreatedAt: {
        type: Number,
        default: Date.now
    },
    Token: {
        type: String
    },
}, {
    versionKey: false,
    timestamps: false
});

module.exports = mongoose.model('User', UserSchema);
