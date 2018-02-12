const apickli = require('../../../../apickli/apickli.js');
const {defineSupportCode} = require('cucumber');
var config = require('../../test-config.json');
var apps = require('../../app-keys.json');

console.log('api: [' + config.proxy.domain + ', ' + config.proxy.basepath + ']');

var creds = {};

function getCreds(appName, productName){
	for(var app in apps){
  	if(apps[app].name === appName){
    	var credentials = apps[app].credentials;
      for(var credential in credentials){
      	var products = credentials[credential].apiProducts;
        for(var product in products){
          if(products[product].apiproduct === productName){
            creds.consumerKey = credentials[credential].consumerKey;
            creds.consumerSecret = credentials[credential].consumerSecret;
          }
        }
      }
    }
  }
}

defineSupportCode(function({Before}) {
    Before(function() {
        getCreds(config.proxy.app, config.proxy.product);
        this.apickli = new apickli.Apickli('http',
          config.proxy.domain + config.proxy.basepath,
          './test/integration/test/features/fixtures/');

        //console.log(creds.consumerKey);
        this.apickli.setGlobalVariable('APIKey',creds.consumerKey);
        //this.apickli.storeValueInScenarioScope('APIKey',creds.consumerKey);
        //this.apickli.addRequestHeader('Authorization', creds.consumerKey);
        this.apickli.addRequestHeader('Cache-Control', 'no-cache');
    });
});

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(60 * 1000);
});
