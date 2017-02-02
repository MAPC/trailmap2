import values from 'npm:object.values';

export function initialize(/* application */) {
  if (!Object.values) {
      values.shim();
  }
}

export default {
  name: 'object-values-polyfill',
  initialize
};
