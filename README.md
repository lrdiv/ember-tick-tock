# ember-tick-tock (alpha)

## About
This Ember-CLI add-on provides a `ticktock` service that will keep the current time synced in your application. In any component/controller/model/etc you can inject the service with the following line:

```javascript
ticktock: Ember.inject.service()
```

Then, you will have access to the current time (a Moment.js object) by accessing the `now` computed property in the service

```javascript
isExpired: Ember.computed('expiresAt', 'ticktock.now', function() {
  return this.get('expiresAt') <= this.get('ticktock.now');
}
```

Any time-sensitive computed properties can then be bound to `now`.

## Options
For some applications, when you cannot rely on the end-user's clock, you may need to use a remote endpoint to get the current time. You can pass an options object in your applications `config/environment.js` file.

```javascript
ENV['ticktockOptions'] = {
  useRemoteTimestamp: true,
  remoteSyncFrequency: 60,
  timestampEndpoint: ENV.apiServer + '/timestamp',
  timestampProperty: 'time'
};
```

* `useRemoteTimestamp`: (Default: `false`) Let the service know to sync with a server
* `remoteSyncFrequency`: (Default: `60`) How often to ping the server (in seconds) to get an updated timestamp
  * The service will still update the `currentDatetime` property every second, regardless of this value
* `timestampEndpoint`: (Required if `useRemoteTimestamp` is true) The URL to make a `GET` request to that will return an object that contains a timestamp
* `timestampProperty`: (Required if `useRemoteTimestamp` is true) The name of the property in the object returned by `timestampEndpoint`

## Installation

* `git clone` this repository
* `npm install`
* `bower install`
