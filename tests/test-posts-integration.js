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
        let res;
        return chai.request(app)
        .get('/posts')
        .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            expect(res.body.posts).to.have.lengthOf.at.least(1);
            return BlogPost.count();
        })
        .then(function(count) {
            expect(res.body.restaurants).to.have.lengthOf(count);
        });
    });

    it('should return blog posts with the correct fields', function() {
        let resPost;
        return chai.request(app)
        .get('/posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.posts).to.be.a('array');
            expect(res.body.posts).to.have.lengthOf.at.least(1);

            res.body.posts.forEach(function(post) {
                expect(post).to.be.a('object');
                expect(post).to.include.keys('id', 'title', 'author', 'content', 'created');
            });
            resPost = res.body.posts[0]
            return BlogPost.findById(resPost.id);
        })
        .then(function(post) {
            expect(resPost.id).to.equal(post.id);
            expect(resPost.title).to.equal(post.title);
            expect(resPost.author).to.equal(post.author);
            expect(resPost.content).to.equal(post.content);
            expect(resPost.created).to.equal(post.created);
        });
    });

});

describe('POST endpoint', function() {
    it('should add a new blog post entry', function() {

        const newPost = generateBlogPostData();

        return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'author', 'content', 'created');
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.id).to.not.be.null;
            expect(res.body.author).to.equal(newPost.author);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.create).to.equal(newPost.created);

            return BlogPost.findById(res.body.id);
        })
        .then(function(post) {
            expect(post.title).to.equal(newPost.title);
            expect(post.author).to.equal(newPost.author);
            expect(post.content).to.equal(newPost.content);
            expect(post.created).to.equal(newPost.created);
        });

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