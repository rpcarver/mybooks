/* eslint-disable global-require */
/**
 * @file logger-unit.js 
 * Provides
 *
 * @author Randy Carver
 * @date 7/19/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/
require('../../config/env');
const chai = require('chai');
const logger = require('../../utils/logger');
const CaptureStdout = require('../../utils/capture-stdout');

const expect = chai.expect;

describe('util - logger', () => {
  const capture = new CaptureStdout();
  const oldLevel = logger.level;

  beforeEach(() => {
    logger.level = 'debug';
  });

  after(() => {
    logger.level = oldLevel;
  });

  it('should return a logger with the expected functionality', () => {
    expect(logger).is.an('Object');
    expect(logger).has.property('level');
    expect(logger).respondsTo('trace');
    expect(logger).respondsTo('sql');
    expect(logger).respondsTo('debug');
    expect(logger).respondsTo('info');
    expect(logger).respondsTo('warn');
    expect(logger).respondsTo('error');
    expect(logger).respondsTo('fatal');
  });

  it('should log a sql message at a level of 15', () => {
    logger.level = 'sql';

    const msg = 'this is a message';
    capture.startCapture();
    logger.sql(msg);
    capture.stopCapture();
    const json = capture.getCapturedText().map(JSON.parse);
    capture.clearCaptureText();

    expect(json[0]).has.property('msg').which.equals(msg);
    expect(json[0]).has.property('level').which.equals(15);
  });

  it('should log messages greater than the log level', () => {
    logger.level = 'debug';

    const msg = 'this is a message';
    capture.startCapture();
    logger.fatal(msg);
    logger.error(msg);
    logger.warn(msg);
    logger.info(msg);
    logger.debug(msg);
    capture.stopCapture();
    const json = capture.getCapturedText().map(JSON.parse);
    capture.clearCaptureText();

    expect(json).has.lengthOf(5);
    expect(json[0]).has.property('msg').which.equals(msg);
    expect(json[0]).has.property('level').which.equals(60);
    expect(json[1]).has.property('msg').which.equals(msg);
    expect(json[1]).has.property('level').which.equals(50);
    expect(json[2]).has.property('msg').which.equals(msg);
    expect(json[2]).has.property('level').which.equals(40);
    expect(json[3]).has.property('msg').which.equals(msg);
    expect(json[3]).has.property('level').which.equals(30);
    expect(json[4]).has.property('msg').which.equals(msg);
    expect(json[4]).has.property('level').which.equals(20);
  });

  it('should log nothing for log messages less than the log level', () => {
    logger.level = 'debug';

    const msg = 'this is a message';
    capture.startCapture();
    logger.debug(msg);
    logger.trace(msg);
    capture.stopCapture();
    const json = capture.getCapturedText().map(JSON.parse);
    capture.clearCaptureText();

    expect(json).has.lengthOf(1);
  });

  it('should log nothing when the log level is silent', () => {
    logger.level = 'silent';

    const msg = 'this is a message';
    capture.startCapture();
    logger.fatal(msg);
    logger.error(msg);
    logger.warn(msg);
    logger.info(msg);
    logger.debug(msg);
    logger.sql(msg);
    logger.trace(msg);
    capture.stopCapture();
    const json = capture.getCapturedText().map(JSON.parse);
    capture.clearCaptureText();

    expect(json).has.lengthOf(0);
  });
});

