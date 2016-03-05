import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  ticktock: Ember.inject.service(),

  timeFreeze: Ember.computed(function() {
    return moment();
  }),

  formattedTime: Ember.computed('ticktock.now', function() {
    return this.get('ticktock.now').format('MM/DD/YYYY [at] hh:mm:ss');
  }),

  formattedTimeFreeze: Ember.computed('timeFreeze', function() {
    return this.get('timeFreeze').format('MM/DD/YYYY [at] hh:mm:ss');
  })
});