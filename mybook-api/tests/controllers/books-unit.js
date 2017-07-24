/**
 * @file books-unit.js
 * Provides unit tests for functions in books-controller.
 *
 * @author Randy Carver
 * @date 7/21/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/

require('../../config/env');
const CaptureStdout = require('../../utils/capture-stdout');
const sinon = require('sinon');
const chai = require('chai');
const orm = require('../../models/orm');
const controller = require('../../controllers/books-controller')(orm);
const MockResponse = require('../../utils/mock-response');

const expect = chai.expect;
const allBooks = [
  { bookID: 1, title: 'booger1' },
  { bookID: 2, title: 'booger2' },
  { bookID: 3, title: 'booger3' },
];


describe('controllers - books - getAll', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should have a getAll function', () => {
    expect(controller).has.property('getAll');
  });

  it('should return all books via the response and set the status code', async () => {
    // stub out the persistence call
    const findAll = sandbox.stub(orm.books, 'findAll');
    const next = sandbox.stub();
    // request is empty
    const req = {};
    const res = new MockResponse();
    // use spy to confirm the response was called as expected
    sandbox.spy(res, 'json');
    sandbox.spy(res, 'status');
    // stubbed persistence call is a promise, make sure we pretend we're one.
    findAll.resolves(allBooks);

    // use await to make sure the promise is fulfilled
    controller.getAll(req, res, next);
    // use await to make sure the promise is fulfilled
    await res;
    await next;

    expect(res.json.calledOnce).is.true;
    expect(res.json.getCall(0).args[0]).deep.equals(allBooks);
    expect(res.status.calledOnce).is.true;
    expect(res.status.getCall(0).args[0]).to.equal(200);
  });

  it('should error and log an error message if the persistence call throws an error', async () => {
    const captureStdout = new CaptureStdout();
    const msg = 'some error text here';
    // stub out the persistence call
    const findAll = sandbox.stub(orm.books, 'findAll');
    const next = sandbox.stub();
    // request is empty
    const req = {};
    const res = new MockResponse();
    // use spy to confirm the response was called as expected
    sandbox.spy(res, 'json');
    sandbox.spy(res, 'status');
    // stubbed persistence call is a promise, make sure we pretend we're one.
    findAll.rejects(Error(msg));

    captureStdout.startCapture();
    controller.getAll(req, res, next);
    // use await to make sure the promise is fulfilled
    await res;
    await next;

    captureStdout.stopCapture();
    const json = captureStdout.getCapturedText().map(JSON.parse);
    captureStdout.clearCaptureText();

    expect(res.json.notCalled).is.true;
    expect(res.status.notCalled).is.true;
    expect(next.called).is.true;
    expect(json).has.lengthOf(1);
    expect(json[0]).has.property('msg').contains(msg);
    expect(json[0]).has.property('level').which.equals(50);
  });
});
