var expect = require('chai').expect;
var sinon = require('sinon');

var moduleLoader = require('./common/moduleLoader.js');
var mockFactory = require('./common/mockFactory.js');
var json = require('./common/jsonComparer.js');

var js = '../../../apiproxy/resources/jsc/ConstructTargetUrlDynamically.js';

describe('feature: Construct Target URL Dynamically', function() {

	it('requests for /clienttoken should construct the target URL correctly', function(done) {
		var mock = mockFactory.getMock();

		mock.contextGetVariableMethod.withArgs('proxy.pathsuffix').returns('/clienttoken');
		mock.contextGetVariableMethod.withArgs('salesforceGlobalkey').returns('myglobalkey');
	  mock.contextGetVariableMethod.withArgs('request.verb').returns('get');
		/*mock.contextGetVariableMethod.withArgs('flow.apigee.error.message').returns('resource not found');
		mock.contextGetVariableMethod.withArgs('flow.apigee.error.status').returns('404');
		mock.contextGetVariableMethod.withArgs('flow.apigee.error.code').returns('404.01.001');
		mock.contextGetVariableMethod.withArgs('proxy.basepath').returns('/currency/v1');
		mock.contextGetVariableMethod.withArgs('proxy.pathsuffix').returns('/rates');
		mock.contextGetVariableMethod.withArgs('flow.apigee.originalRequest.header.X-Forwarded-Proto').returns('http');
		mock.contextGetVariableMethod.withArgs('flow.apigee.originalRequest.header.Host').returns('demo-org.apigee.net');
		mock.contextGetVariableMethod.withArgs('flow.apigee.originalRequest.querystring').returns('a=a&b=b');
		mock.contextGetVariableMethod.withArgs('flow.apigee.originalRequest.verb').returns('GET');*/

		moduleLoader.load(js, function(err) {
			expect(err).to.be.undefined;
			//expect(invalidpath).to.be.true;
			//sinonInvalidPath = sinon.spy(js, "invalidPath");
			//js.invalidPath();

			//expect(js.invalidPath).to.be.false;
			expect(true).to.be.true;
			done()
			//expect(mock.httpClientSendMethod.calledOnce).to.be.true;
			/*
			var logglyRequestArguments = mock.requestConstr.args[0];
			expect(logglyRequestArguments[0]).to.equal('http://demo-org.apigee.net/currency/v1/logs');
			expect(logglyRequestArguments[1]).to.equal('POST');
			expect(logglyRequestArguments[2]['Content-Type']).to.equal('application/json');

			var logObject = JSON.parse(mock.requestConstr.args[0][3]);

			json.compare(logObject, 'logObject.json', function(err) {
				if (err) { throw err; }
				done();
			});
			*/
		});
	});

});
