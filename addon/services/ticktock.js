import Ember from 'ember';
import moment from 'moment';
const { getOwner } = Ember;

export default Ember.Service.extend({
  now: null,
  currentOffset: 0,
  useRemoteTimestamp: false,
  remoteSyncFrequency: 60,
  tickTockFrequency: 1,
  timestampEndpoint: null,
  timestampProperty: null,

  init() {
    this._loadConfigAndStartTimers();
  },

  _loadConfigAndStartTimers() {
    let config = getOwner(this).resolveRegistration('config:environment')['ticktockOptions'];

    if (config && config.remoteSyncFrequency) {
      Ember.set(this, 'remoteSyncFrequency', config.remoteSyncFrequency);
    }

    if (config && config.tickTockFrequency) {
      Ember.set(this, 'tickTockFrequency', config.tickTockFrequency);
    }

    if (config && config.timestampEndpoint) {
      Ember.set(this, 'timestampEndpoint', config.timestampEndpoint);
    }

    if (config && config.timestampProperty) {
      Ember.set(this, 'timestampProperty', config.timestampProperty);
    }

    if (config && config.useRemoteTimestamp) {
      Ember.set(this, 'useRemoteTimestamp', config.useRemoteTimestamp);
      this._setServerTime();
    }

    this._setCurrentTime();
  },
  
  _syncServerLoop() {
    let frequency = Ember.get(this, 'remoteSyncFrequency');
    Ember.run.later(this, this._setServerTime, (frequency * 1000));
  },
  
  _syncLocalLoop() {
    let frequency = Ember.get(this, 'tickTockFrequency');
    Ember.run.later(this, this._setCurrentTime, (frequency * 1000));
  },
  
  _setServerTime() {
    let _this = this;

    Ember.$.ajax(_this.timestampEndpoint, {
      type: 'GET',
      success: (data) => {
        var currentServerTime = data[_this.timestampProperty];
        var currentLocalTime  = moment().unix();
        var serverTime        = parseInt(currentServerTime);
        var serverOffset      = serverTime - parseInt(currentLocalTime);

        Ember.set(_this, 'currentOffset', serverOffset);
      }
    });

    this._syncServerLoop();
  },
  
  _setCurrentTime: function() {
    let now = moment().unix();
    
    if (Ember.get(this, 'useRemoteTimestamp')) {
      now += Ember.get(this, 'currentOffset');
    }

    now = moment.unix(now);
    Ember.set(this, 'now', now);

    this._syncLocalLoop();
  }
});
