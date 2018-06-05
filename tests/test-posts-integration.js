'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding blog post data');
    const seedData = [];

    for(let i = 1; i <= 10; i++) {
        seedData.push(generateBlogPostData());
    }
    return BlogPost.insertMany(seedData);

}

function generateBlogPostData() {
    return {
        author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
          },
          title: faker.lorem.word(),
          content: faker.lorem.paragraph(),
          created: faker.date.past()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog posts API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedBlogPostData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    })
})

describe('GET endpoint', function(){
    it('should return all existing blog posts', function() {

    });

    it('should return blog posts with the correct fields', function() {

    });

});

describe('POST endpoint', function() {
    it('should add a new blog post entry', function() {

    });

});

describe('PUT endpoint', function() {
    it('should update an existing blog post with fields you send', function() {

    });

    it('should run an error if the id of the updated post does not match with the original one', function() {

    });


});

describe('DELETE endpoint', function() {
    it('should delete a post by id', function() {
        
    })

});