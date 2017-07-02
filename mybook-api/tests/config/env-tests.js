/**
 * @file env-tests.js 
 * Provides tests for the env.js environment wrapper
 *
 * @author Randy Carver
 * @date 7/1/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
require('mocha');
const expect = require('chai').expect;

function removeEnv() {
  const envKey = require.resolve('../../config/env.js');
  const envCache = require.cache[envKey];

  if (envCache) {
    delete require.cache[envKey];
    delete process.env.DOTENV_LOADED;
    delete process.env.NODE_ENV;
    delete process.env.DATABASE_NAME;
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_PORT;
    delete process.env.DATABASE_USERNAME;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_DIALECT;
    delete process.env.DATABASE_POOL_MAX;
    delete process.env.DATABASE_POOL_MIN;
    delete process.env.DATABASE_POOL_IDLE;
    delete process.env.DATABASE_QUERY_LOGGING;
    delete process.env.API_VERSION;
    delete process.env.API_NAME;
    delete process.env.API_PORT;
  }
}

describe('env - test', () => {
  before(() => {
    removeEnv();
  });
  let env = null;
  it('should not have been loaded before test', () => {
    process.env.NODE_ENV = 'test';
    expect(process.env).to.not.have.property('DOTENV_LOADED');
  });

  it('should set DOTENV_LOADED on load', () => {
    process.env.NODE_ENV = 'test';
    env = require('../../config/env');
    expect(process.env).to.have.property('DOTENV_LOADED');
    // process.env everything is a string
    expect(process.env.DOTENV_LOADED).to.equal('true');
  });

  it('should set the correct properties', () => {
    expect(env.NODE_ENV).to.equal('test');
    expect(env.DATABASE_NAME).to.equal('mybook_test');
    expect(env.DATABASE_HOST).to.equal('localhost');
    expect(env.DATABASE_PORT).to.equal(3306);
    expect(env.DATABASE_USERNAME).to.equal('root');
    expect(env.DATABASE_PASSWORD).to.exist;
    expect(env.DATABASE_DIALECT).to.equal('mysql');
    expect(env.DATABASE_POOL_MAX).to.equal(10);
    expect(env.DATABASE_POOL_MIN).to.equal(1);
    expect(env.DATABASE_POOL_IDLE).to.equal(5000);
    expect(env.DATABASE_QUERY_LOGGING).to.be.false;
    expect(env.API_VERSION).to.equal(1.0);
    expect(env.API_NAME).to.equal('mybook-api');
    expect(env.API_PORT).to.equal(8080);
  });
});

describe('env - dev', () => {
  before(() => {
    removeEnv();
  });
  let env = null;
  it('should not have been loaded before test', () => {
    process.env.NODE_ENV = 'test';
    expect(process.env).to.not.have.property('DOTENV_LOADED');
  });


  it('should set DOTENV_LOADED on load', () => {
    process.env.NODE_ENV = 'development';
    env = require('../../config/env');
    expect(process.env).to.have.property('DOTENV_LOADED');
    // process.env everything is a string
    expect(process.env.DOTENV_LOADED).to.equal('true');
  });

  it('should set the correct properties', () => {
    expect(env.NODE_ENV).to.equal('development');
    expect(env.DATABASE_NAME).to.equal('mybook_dev');
    expect(env.DATABASE_HOST).to.equal('localhost');
    expect(env.DATABASE_PORT).to.equal(3306);
    expect(env.DATABASE_USERNAME).to.equal('root');
    expect(env.DATABASE_PASSWORD).to.exist;
    expect(env.DATABASE_DIALECT).to.equal('mysql');
    expect(env.DATABASE_POOL_MAX).to.equal(10);
    expect(env.DATABASE_POOL_MIN).to.equal(1);
    expect(env.DATABASE_POOL_IDLE).to.equal(5000);
    expect(env.DATABASE_QUERY_LOGGING).to.be.false;
    expect(env.API_VERSION).to.equal(1.0);
    expect(env.API_NAME).to.equal('mybook-api');
    expect(env.API_PORT).to.equal(8080);
  });
});
