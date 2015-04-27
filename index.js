'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-llrp')
var llrp = require('llrp');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    ipAddress: {
      type: 'string',
      required: true
    }
  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
//  this.emit('message', {devices: ['*'], topic: 'echo', payload: payload});
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options||{});
  var self = this;

  var reader = new llrp({
    ipaddress: this.options.ipAddress
});

reader.connect();

reader.on('timeout', function () {
    console.log('timeout');
});

reader.on('disconnect', function () {
    console.log('disconnect');
});

reader.on('error', function (error) {
    console.log('error: ' + JSON.stringify(error));
});

reader.on('didSeeTag', function (tag) {
    console.log('TAG: ' + tag.tagID);
    var payload = {"epc" : tag.tagID};
    self.emit('message', {devices: ['*'] ,payload: payload});
});

};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
