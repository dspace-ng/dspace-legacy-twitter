var nconf = require('nconf');
var _ = require('lodash');
var Twit = require('twit');
var Faye = require('faye');

/*
 * get config from file
 */
nconf.file({ file: 'config.json' });

var hashtags = nconf.get('hashtags');

/*
 * Bayeux Pub/Sub
 */

var pubsub = new Faye.Client(nconf.get('pubsub').url);

var normalize = function(tweet){
  return {
    text: tweet.text,
    timestamp: tweet.created_at,
    persona: {
      handle: tweet.user.screen_name + '@twitter.com',
      url: 'https://twitter.com/' + tweet.user.screen_name
    }
  };
};


/*
 * twitter thinkgy ;)
 */

var forward = function(tweet){
  var inTweet = _.map(tweet.entities.hashtags, function(hashtag){ return hashtag.text.toLowerCase(); });
  var common = _.intersection(hashtags, inTweet);
  var channels = _.map(common, function(hashtag){ return '/hashtags/' + hashtag; });
  _.forEach(channels, function(channel){
    pubsub.publish(channel, normalize(tweet));
  });
};

var T = new Twit(nconf.get('auth'));

var stream = T.stream('statuses/filter', {
  track: _.map(hashtags, function(hashtag){ return '#' + hashtag; })
});

stream.on('tweet', function(tweet) {
  forward(tweet);
});

