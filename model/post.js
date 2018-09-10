
"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Post Schema
 */
var PostSchema = new Schema({

    GalleryId: {
        type: String
    },
    FileId: {
        type: String
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

module.exports = mongoose.model('Post', PostSchema);
//
// const Sequelize = require('sequelize');
// const post = {
//     name: "post",
//     define: {
//         PostId: {
//             type: Sequelize.BIGINT,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         Title: Sequelize.STRING,
//         GalleryId: Sequelize.BIGINT,
//         Likes: Sequelize.BIGINT,
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
// module.exports = post;
