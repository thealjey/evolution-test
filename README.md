# Editable tree - test application
A test app that mimics a unix file system browser.
Allows to create, rename and delete files and folders, edit file contents.
Supports drag and drop (might not work in IE <9).

User changes are persisted into localStorage.

Written in React 0.13.1 + Flux 2.0.1 + Immutable 3.6.4

Source code is statically analized by Flow 0.6.0, compiled from ES6 to ES5 with Babel 4.7.16 
and packaged with Webpack 1.7.3

Styles are provided by Twitter Bootstrap 3.3.4 + React Bootstrap 0.17.0.
Compiled with Sass 3.4.13 and post-processed by Autoprefixer 5.1.0

The project is fully intergrated with the Jest 0.1.39 unit test framework.

*If by looking at the component source code you see that there's a lot of duplication that would best be separated into 
a common parent class - you're absolutely right. However, and unfortunately, this is currently not possible due to 
[a bug in Flow](https://github.com/facebook/flow/issues/300).*

# [View online demo](http://thealjey.github.io/evolution-test/)

##### Tools needed to compile:
1. NodeJS
2. Facebook Flow
3. SASS rubygem