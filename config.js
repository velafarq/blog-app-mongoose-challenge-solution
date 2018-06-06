'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://vela:Tafthenry22@ds251240.mlab.com:51240/blog-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blog-app'
exports.PORT = process.env.PORT || 8080;