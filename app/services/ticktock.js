import Ember from 'ember';

export default Ember.Service.extend({
  useRemoteTimestamp: false,
  remoteSyncFrequency: 60000,
  currentOffset: 0,
  currentDatetime: null,
  timestampEndpoint: null,
  timestampProperty: null,
  
  init: function() {
    this._loadConfigAndStartTimers();
  },

  _loadConfigAndStartTimers: function() {
    var config = this.container.lookupFactory('config:environment')['countdownOptions'];

    if (config && config.useRemoteTimestamp) {
      Ember.set(this, 'useRemoteTimestamp', config.useRemoteTimestamp);
    }

    if (config && config.remoteSyncFrequency) {
      Ember.set(this, 'remoteSyncFrequency', config.remoteSyncFrequency);
    }

    if (config && config.timestampEndpoint) {
      Ember.set(this, 'timestampEndpoint', config.timestampEndpoint);
    }

    if (config && config.timestampProperty) {
      Ember.set(this, 'timestampProperty', config.timestampProperty);
    }

    if (config.useRemoteTimestamp) {
      this._setServerTime();
    }

    this._setCurrentTime();
  },
  
  _syncServerLoop: function() {
    Ember.run.later(this, this._setServerTime, (Ember.get(this, 'remoteSyncFrequency') * 1000));
  },
  
  _syncLocalLoop: function() {
    Ember.run.later(this, this._setCurrentTime, 1000);
  },
  
  _setServerTime: function() {
    var _this = this;

    Ember.$.ajax(_this.timestampEndpoint, {
      type: 'GET',
      success: function(data) {
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
    var currentDatetime = moment().unix();
    
    if (Ember.get(this, 'useRemoteTimestamp')) {
      currentDatetime += Ember.get(this, 'currentOffset');
    }

    currentDatetime = moment.unix(currentDatetime);
    Ember.set(this, 'currentDatetime', currentDatetime);

    this._syncLocalLoop();
  }
});
