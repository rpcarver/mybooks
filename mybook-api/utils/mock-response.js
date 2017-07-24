/* eslint-disable no-underscore-dangle */
/**
 * @file mock-response.js
 * Provides a mock object of restify ServerResponse
 *
 * @author Randy Carver
 * @date 7/22/17
 *
 * Copyright © 2017 Blue Otter Software - All Rights Reserved
 * The MyBooks tutorial project is Licensed under the MIT License.
 * See LICENSE.md file in the project root for full license information.
 * {@link https://github.com/rpcarver/mybooks|MyBooks Tutorial Github Respository}
 * {@link http://blueottersoftware.com/2017/06/19/mybooks-tutorial-index/MyBooks Tutorial Index}
 * {@link https://www.linkedin.com/in/randycarver/|LinkedIn}
 **/

class MockResponse {
  status(code) {
    this.code = code;
  }

  json(jsonData) {
    this.jsonData = jsonData;
  }
}

module.exports = MockResponse;
