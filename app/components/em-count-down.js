import Ember from 'ember';

export default Ember.Component.extend({
  countdown: Ember.inject.service(),
  now: Ember.computed.alias('countdown.currentDatetime')
});
