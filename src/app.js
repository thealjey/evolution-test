/* @flow */

require('es5-shim/es5-shim');
require('babel/lib/babel/polyfill');

var React = require('react/lib/React'),
  TreeApp = require('./components/TreeApp.react');

React.render(
  <TreeApp header="Editable tree panel test" />,
  document.getElementById('treeapp')
);
