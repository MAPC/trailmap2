import Ember from 'ember';

export function orderDelimitedString(context, options) {
    if(context){
      let tempArr = context[0].trim().split(options["delimiter"]).sortBy('');

      return tempArr;
    }
  }

export default Ember.Helper.helper(orderDelimitedString);
