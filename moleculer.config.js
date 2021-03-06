"use strict";


process.env.MONGO_URI = "mongodb://mateuser1:mateuser30@ds251362.mlab.com:51362/mateflickdb";

module.exports = {
	namespace: "",
	nodeID: null,

	logger: true,
	logLevel: "info",
	logFormatter: "default",

	serializer: "JSON",

	requestTimeout: 10 * 1000,
	requestRetry: 0,
	maxCallLevel: 100,
	heartbeatInterval: 5,
	heartbeatTimeout: 15,

	disableBalancer: false,

	registry: {
		strategy: "RoundRobin",
		preferLocal: true
	},

	circuitBreaker: {
		enabled: false,
		maxFailures: 3,
		halfOpenTime: 10 * 1000,
		failureOnTimeout: true,
		failureOnReject: true
	},

	validation: true,
	validator: null,
	metrics: false,
	metricsRate: 1,
	statistics: false,
	internalActions: true,

	hotReload: false,

	replCommands: null,

	// Register middlewares
	middlewares: [],

	// Called after broker created.
	created(broker) {
		
	},

	// Called after broker starte.
	started(broker) {

	},

	// Called after broker stopped.
	stopped(broker) {

	}
};