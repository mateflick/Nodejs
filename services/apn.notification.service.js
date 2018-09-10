"use strict";




// apple
// var apn = require('apn');
// var options = {
//     token: {
//         //  /root/taxi_online/certs
//         key: "/Users/shijazi-macbook/Desktop/Taxi/backend/taxi/certs/AuthKey_VLH5LBN49B.p8",
//         keyId: "VLH5LBN49B",
//         teamId: "2769UUC4LD"
//     },
//     production: false
// };
//
//
// var apnProvider = new apn.Provider(options);

module.exports = {
    name: "apns",
    settings: {},
    actions: {
        sendAppleNotification: {
            params: {
                deviceToken: {
                    type: "string",
                    optional: false
                },
                msg: {
                    type: "object",
                    optional: false
                }
            },
            handler(ctx) {
                let entity = ctx.params;
                // var note = new apn.Notification();
                // note.expiry = Math.floor(Date.now() / 1000) + 120; // Expires 2 minutes from now.
                // note.badge = 3;
                // note.sound = "ping.aiff";
                // note.alert = "My Photo Bank";
                // console.log(entity.msg);
                // note.payload = {
                //     'messageFrom': 'My Photo Bank application',
                //     'data': entity.msg
                // };
                // note.topic = "com.LeTaxi.App";
                // return apnProvider.send(note, entity.deviceToken).then((result) => {
                //     console.log(result.failed);
                //     if (result.failed.length > 0) {
                //         console.log('failed');
                //     } else {
                //         console.log('success');
                //     }
                //     return result;
                // });
            }
        }
    },


    events: {

    },

    methods: {

    },

    created() {

    },
    started() {

    },

    stopped() {

    }
};
