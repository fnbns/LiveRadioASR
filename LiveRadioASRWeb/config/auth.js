// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://dev.speed.pub.ro:11001/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://dev.speed.pub.ro:11001/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '332881791416-evcbc5oa4i017pi64c4jhgso08k979d2.apps.googleusercontent.com',
		'clientSecret' 	: 'E7Ibd-Z3gRZ0_MJhu7tYHEMh',
		'callbackURL' 	: 'http://dev.speed.pub.ro:11001/auth/google/callback'
	},
	'linkedinAuth' : {
		'clientID' 		: '77runoy051dqnm', 
		'clientSecret' 	: 'hlWmM5na3QXSP0Cs', 
		'callbackURL' 	: 'http://dev.speed.pub.ro:11001/auth/linkedin/callback'
	},

};
