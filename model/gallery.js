
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Sms Schema
 */
var GallerySchema = new Schema({

    UserId: {
        type: String
    },
    Title: {
        type: String
    },
    Description: {
        type: String
    },
    Location: {
        type: String
    },
    Event: {
        type: String
    },
    CoverImage: {
        type: String
    },
    CreatedAt: {
        // type: Date,
        // default: Date.now
        type: Number,
        default:  Date.now
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

module.exports = mongoose.model('Gallery', GallerySchema);


// const Sequelize = require('sequelize');
// const gallery = {
//     name: "gallery",
//     define: {
//         GalleryId: {
//             type: Sequelize.BIGINT,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         UserId: Sequelize.BIGINT,
//         Title: Sequelize.STRING,
//         Description: Sequelize.STRING,
//         CreatedAt: Sequelize.TIME,
//         Status: Sequelize.BOOLEAN
//     },
//     options: {
//         // don't add the timestamp attributes (updatedAt, createdAt)
//         timestamps: false,
//         freezeTableName: true,
//     }
// };
//
// module.exports = gallery;
