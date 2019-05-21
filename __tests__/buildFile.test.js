/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var buildFile = require('../lib/buildFile');
var helpers   = require('./__helpers');
var GroupMessages = require('../lib/utils/groupMessages');

function format() {
  return "hi";
}

describe('buildFile', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should error if format doesnt exist or isnt a function', () => {
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', {}, {}, {})
    ).toThrow('Please enter a valid file format');
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', [], {}, {})
    ).toThrow('Please enter a valid file format');
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', null, {}, {})
    ).toThrow('Please enter a valid file format');
  });

  it('should error if destination doesnt exist or isnt a string', () => {
    expect(
      buildFile.bind(null, {}, format, {}, {})
    ).toThrow('Please enter a valid destination');
    expect(
      buildFile.bind(null, [], format, {}, {})
    ).toThrow('Please enter a valid destination');
    expect(
      buildFile.bind(null, null, format, {}, {})
    ).toThrow('Please enter a valid destination');
  });

  let dest = 'test.collisions';
  var PROPERTY_NAME_COLLISION_WARNINGS = GroupMessages.GROUP.PropertyNameCollisionWarnings + ":" + dest;
  it('should generate warning messages for output name collisions', () => {
    GroupMessages.clear(PROPERTY_NAME_COLLISION_WARNINGS);

    buildFile(dest, format, {}, {
      allProperties: [{
        name: 'someName',
        path: ['some', 'name', 'path1'],
        value: 'value1'
      }, {
        name: 'someName',
        path: ['some', 'name', 'path2'],
        value: 'value2'
      }]
    });
    expect(GroupMessages.count(PROPERTY_NAME_COLLISION_WARNINGS)).toBe(1);
    console.log(GroupMessages.fetchMessages(PROPERTY_NAME_COLLISION_WARNINGS))
    expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_NAME_COLLISION_WARNINGS))).toBe(JSON.stringify([
       'Output name \u001b[38;5;202m\u001b[1msomeName\u001b[22m\u001b[39m was generated by:\n        \u001b[38;5;202msome.name.path1\u001b[39m   \u001b[38;5;214mvalue1\u001b[39m\n        \u001b[38;5;202msome.name.path2\u001b[39m   \u001b[38;5;214mvalue2\u001b[39m'
    ]));
  });

  it('should write to a file properly', () => {
    buildFile('test.txt', format, {buildPath: '__tests__/__output/'}, {});
    expect(helpers.fileExists('./__tests__/__output/test.txt')).toBeTruthy();
  });
});
