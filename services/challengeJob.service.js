"use strict";
let chalk = require("chalk");

let Response = require('../responses/success');
const Cron = require("moleculer-cron");

const {
    MoleculerError,
    ValidationError
} = require("moleculer").Errors;

module.exports = {
    name: "cron-job",
    mixins: [Cron],
    settings: {

    },
    crons: [{
        name: "JobChallenge",
        cronTime: '*/5 * * * * *', // run every 5 seconds
        // cronTime: '0 */1 * * * *', // run every minute
        onTick: function() {
            console.log(chalk.cyan.bold("Challenge Job ticked"));

            // this.broker.call("postchallenge.listPostsOfChallenge", {
            //     ChallengeId: "5b4e79f0abb750ab53bc0cfa"
            // }).then(res => {
            //     console.log(res);
            // })
            // this.getLocalService("challengeCron")
            //     .actions.say()
            //     .then((data) => {
            //         console.log("Oh!", data);
            //     });

            this.getLocalService("cron-job")
                .actions.say()
                .then((data) => {
                    console.log("Oh!", data);
                });

            // this.getLocalService("postchallenge")
            //     .actions.listPostsOfChallenge({
            //         ChallengeId: "5b4e79f0abb750ab53bc0cfa"
            //     })
            //     .then((data) => {
            //         console.log("Oh!", data);
            //     });
        },
        runOnInit: function() {
            console.log(chalk.cyan.bold("Challenge Job is created"));

        },
        manualStart: true,
        // timeZone: 'America/Nipigon'
    }],
    actions: {
        say: {
            handler(ctx) {
                return "HelloWorld!";
            }
        }
    },
    events: {

    },

    methods: {},

    created() {

    },
    started() {

    },

    stopped() {

    }
};
