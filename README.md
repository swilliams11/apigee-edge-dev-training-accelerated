# apigee-edge-dev-training-accelerated

# Prereqs
* Postman (My Postman Collection is named Apigee Edge Developer Training Accelerated)
* Postman environment named Apigee-Dev-Training-Accelerated
* Apigee Edge Account
* Apigee BaaS (hopefully you have one, because we don't issue these anymore!)
* >= Java 8
* Maven 3.x
* Node.js/NPM
* Open SSL

# Summary
This repo contains:
* `apigee-maven-deployment-proxy` - sample proxy to deploy with Maven
* `apigee-maven-deployment-proxy-apickli` - sample proxy for Maven deployments and Apickli
* Postman scripts in the `postman` folder.
* `shared-flow-example` - shared flow example to demonstrate deploying a shared flow.


# Postman Setup
1. Open Postman and import the
* Apigee Edge Developer Training Accelerated.postman_collection
* Apigee-Dev-Training-Accelerated-For-Users.postman_environment
  * edit the Postman environment with your org name and environment name

# Lab 1 - Create a new proxy
In this section we are going to create a new pass through proxy and test it.

1. Create a new proxy and name it `dev-training-eatery`.

2. Get the target endpoint from the trainer.

3. Start an Apigee trace session.

4. Execute the `R1 Pass Through` Postman request and review the request in the UI.


# Lab 2 - Access Secure Backend
In this section we are going to change the target endpoint to a secure backend. The backend server is going to return a 401 unauthorized.

Revision 2

1. Save the proxy as a new revision and update the target endpoint.
Get the target endpoint from the trainer.

2. Start an Apigee trace session.

3. Send the `R2 - /chefs 401 unauthorized` Postman request and review it in the UI.


# Lab 3 - Access Secure Backend - KVM and Basic Auth
In this section we are are going to add two policies:
* KVM
* Basic Auth.

Revision 3

1. Save the proxy as a new revision.  

2. Create a KVM named `dev-training-kvm-secure-backend`
* username: Get from trainer
* password: Get from trainer
* indexDemo: test1, test2, test3

3. Add the KVM policy to the target endpoint Postflow request path.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="KVM-GetUnamePassword" mapIdentifier="dev-training-kvm-secure-backend">
    <DisplayName>KVM-GetUnamePassword</DisplayName>
    <Properties/>
    <ExpiryTimeInSecs>3600</ExpiryTimeInSecs>
    <Get assignTo="username">
        <Key>
            <Parameter>username</Parameter>
        </Key>
    </Get>
    <Get assignTo="password">
        <Key>
            <Parameter>password</Parameter>
        </Key>
    </Get>
    <Get assignTo="myindex" index="2">
        <Key>
            <Parameter>indexDemo</Parameter>
        </Key>
    </Get>
    <Scope>environment</Scope>
</KeyValueMapOperations>
```

4. Add the Basic Auth policy to the Target Endpoint Postflow request path.
This encodes the username and password as the Authorization Basic auth header.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<BasicAuthentication async="false" continueOnError="false" enabled="true" name="BasicAuth">
    <DisplayName>BasicAuth</DisplayName>
    <Operation>Encode</Operation>
    <IgnoreUnresolvedVariables>false</IgnoreUnresolvedVariables>
    <User ref="username"/>
    <Password ref="password"/>
    <AssignTo createNew="false">request.header.Authorization</AssignTo>
</BasicAuthentication>
```

5. Save the proxy and deploy it to the test environment.  

6. Start the Apigee trace session and send the `R3 - /chefs` Postman request.
Review
* KVM variables that are set
* KVM values can be indexed.
* Basic Auth flow variables that are set


# Lab 4 - Access Secure Backend - Encrypted KVM
In this section we are are going to update the KVM policy to use the encrypted values that we just created.

Revision 4

1. Save the proxy as a new revision.  

2. Create an Encrypted KVM named `dev-training-encrypted-kvm-secure-backend`
* username: Get from trainer
* password: Get from trainer

3. Add the KVM policy to the target endpoint Postflow request path.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="KVM-GetUnamePassword" mapIdentifier="dev-training-encrypted-kvm-secure-backend">
    <DisplayName>KVM-GetUnamePassword</DisplayName>
    <Properties/>
    <ExpiryTimeInSecs>3600</ExpiryTimeInSecs>
    <Get assignTo="private.username">
        <Key>
            <Parameter>username</Parameter>
        </Key>
    </Get>
    <Get assignTo="private.password">
        <Key>
            <Parameter>password</Parameter>
        </Key>
    </Get>
    <Scope>environment</Scope>
</KeyValueMapOperations>
```

5. Save the proxy and deploy it to the test environment.  

6. Start the Apigee trace session and send the `R4 - /chefs encrypted KVM` Postman request.
Review
* Encrypted KVM variables are not visible in the trace UI

**However, the Authorization header is still visible in the trace UI.  That header is Basic Auth which is base64 encoded.  We need to remove this from the trace UI as well.**


# Lab 5 - Data Masking
Revision 4

This lab we will add data masking to the org.
* [Data Masking](https://docs.apigee.com/api-services/content/data-masking)
  * allows you to mask XML/JSON payloads and flow variables
* [Management API](https://docs.apigee.com/management/apis) Briefly discuss


1. Edit the Postman environment variables to include your Apigee Edge org name and Password.

2. Then open the `data mask for Authorization header` Postman request. Click on the Authorization tab and then click **Update Request**.

3. Send the request and you should see a 200 ok.

4. Start the Apigee Trace UI.  

5. Send the `R4 - /chefs encrypted KVM` Postman request.
Review the trace results and notice Authorization header is no longer visible.  

6. Execute the `remove data mask for Authorization header` if you want to remove the data mask. Click on the Authorization tab and then click **Update Request**.  Then send the request.

# Lab 6 - Target Server
In this section you are going to create a target server and reference the target server in your proxy.
This allows you to easily promote code across environments.  


Revision 5

1. Save as a new revision.

2. Create a new target server named `eatery` in the test environment.  Get the actual hostname from the trainer.

3. Update the default target endpoint as shown below.

```xml
<HTTPTargetConnection>
       <Properties/>
       <LoadBalancer>
           <Server name="eatery"/>
       </LoadBalancer>
       <Path>/v1/apieatery</Path>
   </HTTPTargetConnection>
```

4. Deploy the proxy and start a trace session.

5. Send the `R5 - /chefs target server` Postman request.

* Observe that the target hostname is visible and the target basepath is set.


# Lab 7 - Target Server
In this section we are going to create a new target endpoint. This will demonstrate route rules.  

**Get the new target endpoint from the instructor**

Revision 6

1. Save the proxy as a new revision.  

2. Create a new target endpoint.

3. Update the proxy endpoint to include the following route rule.
this says that all requests where the proxy path suffix does not equal to chefs will be sent to the new target endpoint.  

* Notice that the default target endpoint is last.  

```xml
<RouteRule name="default">
       <Condition>proxy.pathsuffix != "/chefs"</Condition>
       <TargetEndpoint>baas-sandbox</TargetEndpoint>
   </RouteRule>
```

4. Save the proxy.

5. Start a trace session.

6. Send the `R6 - /stores` Postman request.  

7. Also send the `R5 - /chefs target server` request.

Review
* both request in the trace session
* observe the response of the stores request; it includes latitude and longitude.


# Lab 8 - Mashup with Google Geocode API
We will add a callout to the Google Geocode API and add address to the Stores response.  We'll encode this with the Geocode API.

In this section we are going to add the following:
* a new conditional flow/resource
* Extract variables policy
* Service callout policy
* Java Script callout policy

Revision 7

1. Save the proxy as a new revision.

2. Add a new conditional flow in the Proxy endpoint named `Store`
```xml
<Condition>(proxy.pathsuffix MatchesPath "/stores/*") and (request.verb = "GET")</Condition>
```

3. Add a new conditional flow in the `baas-sandbox` target endpoint named `Store`.

```xml
<Condition>(proxy.pathsuffix MatchesPath "/stores/*") and (request.verb = "GET")</Condition>
```

4. Add an Extract Variables policy on the `store` conditional flow in the `baas-sandbox` target endpoint on the response path.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="ExtractVariables-Lat-Long">
    <DisplayName>ExtractVariables-Lat-Long</DisplayName>
    <Properties/>
    <Properties/>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <JSONPayload>
        <Variable name="lat">
            <JSONPath>$.entities[0].location.latitude</JSONPath>
        </Variable>
        <Variable name="long">
            <JSONPath>$.entities[0].location.longitude</JSONPath>
        </Variable>
    </JSONPayload>
    <Source clearPayload="false">response</Source>
</ExtractVariables>
```

5. Add a Service callout policy after that.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ServiceCallout async="false" continueOnError="false" enabled="true" name="ServiceCallout-GoogleGeocode">
    <DisplayName>ServiceCallout-GoogleGeocode</DisplayName>
    <Properties/>
    <Request>
        <Set>
            <QueryParams>
                <QueryParam name="latlng">{lat},{long}</QueryParam>
            </QueryParams>
        </Set>
    </Request>
    <Response>calloutResponse</Response>
    <HTTPTargetConnection>
        <Properties/>
        <URL>https://maps.googleapis.com/maps/api/geocode/json</URL>
    </HTTPTargetConnection>
</ServiceCallout>
```

6. Add another Extract Variables policy after that.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="ExtractVariables-GoogleResponse">
    <DisplayName>ExtractVariables-GoogleResponse</DisplayName>
    <Properties/>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <JSONPayload>
        <Variable name="address">
            <JSONPath>$.results[0].formatted_address</JSONPath>
        </Variable>
    </JSONPayload>
    <Source clearPayload="false">calloutResponse.content</Source>
</ExtractVariables>
```

7. Add a Java Script policy after that.  
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Javascript async="false" continueOnError="false" enabled="true" timeLimit="200" name="JavaScript-MashupAddress">
    <DisplayName>JavaScript-MashupAddress</DisplayName>
    <Properties/>
    <ResourceURL>jsc://MashupAddress.js</ResourceURL>
</Javascript>
```

```Javascript
var address = context.getVariable('address');
var responsePayload = JSON.parse(context.getVariable('response.content'));
try{
    responsePayload.entities[0].address = address;
    context.setVariable('response.content', JSON.stringify(responsePayload));
    context.setVariable('mashupAddressSuccess', true);

} catch(e){
    print('Error occurred when trying to add the address to the response.');
    context.setVariable('mashupAddressSuccess', false);
}
```

8. Save the proxy and start a trace session.

9. Send the `R7 - /stores/id` request.
Observe each policy in the trace UI.  


# Lab 9 - Mashup with Google Geocode API
Revision 8

Same as revision 7 except it uses a Assign message policy to create the Service Callout request.  Why? Because there is more than one way to implement this functionality.

1. Save as a new revision.

2. Click on the `Store` conditional flow in the `baas-sandbox` target endpoint.  

3. Add the Assign Message policy before the service callout.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AssignMessage async="false" continueOnError="false" enabled="true" name="AssignMessage-GoogleGeocodeRequest">
    <DisplayName>AssignMessage-GoogleGeocodeRequest</DisplayName>
    <Properties/>
    <Set>
        <QueryParams>
            <QueryParam name="latlng">{lat},{long}</QueryParam>
        </QueryParams>
        <Path>/maps/api/geocode/json</Path>
    </Set>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <AssignTo createNew="true" transport="http" type="request">googleGeocodeRequest</AssignTo>
</AssignMessage>
```

4. Update the service callout policy with the following

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ServiceCallout async="false" continueOnError="false" enabled="true" name="ServiceCallout-GoogleGeocode">
    <DisplayName>ServiceCallout-GoogleGeocode</DisplayName>
    <Properties/>
    <Request clearPayload="true" variable="googleGeocodeRequest"/>
    <Response>calloutResponse</Response>
    <HTTPTargetConnection>
        <Properties/>
        <URL>https://maps.googleapis.com</URL>
    </HTTPTargetConnection>
</ServiceCallout>
```

5. Save the proxy and start a trace session.  

6. Send the `R8 - /stores/id` request.

Observe each policy in the trace UI.

**The only problem with this is that we are sending the same Google API request every time we send a request to Apigee. Caching can help here.**

# Lab 10 - Caching
Revison 9

We don't need to send unnecessary third-party callout requests.  We can cache with our caching policies.

1. Save the proxy as a new revision.

2. Create a cache resource named `GoogleGecodeCache`.  

3. Click on the `Store` conditional flow in the `baas-sandbox` target endpoint.  

4. Add a new Lookup cache policy on the response side. Add this policy before the Service Callout.  

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<LookupCache async="false" continueOnError="false" enabled="true" name="LookupCache-GoogleGeocode">
    <DisplayName>LookupCache-GoogleGeocode</DisplayName>
    <Properties/>
    <CacheResource>GoogleGecodeCache</CacheResource>
    <CacheKey>
        <Prefix/>
        <KeyFragment ref="lat"/>
        <KeyFragment ref="long"/>
    </CacheKey>
    <Scope>Exclusive</Scope>
    <AssignTo>address</AssignTo>
</LookupCache>
```

5. Add the Populate Cache policy after the `ExtractVariables-GoogleResponse` policy.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PopulateCache async="false" continueOnError="false" enabled="true" name="PopulateCache-GoogleGeocode">
    <DisplayName>PopulateCache-GoogleGeocode</DisplayName>
    <Properties/>
    <CacheKey>
        <Prefix/>
        <KeyFragment ref="lat"/>
        <KeyFragment ref="long"/>
    </CacheKey>
    <CacheResource>GoogleGecodeCache</CacheResource>
    <Scope>Exclusive</Scope>
    <ExpirySettings>
        <TimeoutInSec>60</TimeoutInSec>
    </ExpirySettings>
    <Source>address</Source>
</PopulateCache>
```

6. Now we need to add the following conditions.  
**Explain how you found these variables. [Lookup Cache Policy](https://docs.apigee.com/api-services/reference/lookup-cache-policy)**

```xml
<Step>
    <Name>LookupCache-GoogleGeocode</Name>
</Step>
<Step>
    <Name>ServiceCallout-GoogleGeocode</Name>
    <Condition>lookupcache.LookupCache-GoogleGeocode.cachehit == false</Condition>
</Step>
<Step>
    <Name>ExtractVariables-GoogleResponse</Name>
    <Condition>lookupcache.LookupCache-GoogleGeocode.cachehit == false</Condition>
</Step>
<Step>
    <Name>PopulateCache-GoogleGeocode</Name>
    <Condition>lookupcache.LookupCache-GoogleGeocode.cachehit == false and calloutResponse.status.code == 200</Condition>
</Step>
```

7. Save the proxy and start a trace.

8. Send the `R9 - /stores/id` request. Send multiple requests so you can see how the cache policies are used.  

Review all the policy details in the trace UI.


# Lab 11 - Security - Verify API Key
Revision 10

Now we'll add a new conditional flow and the Verify API key policy to protect it from unauthorized requests.

1. Save the proxy as a new revision.

2. Add a new product `dev-training-eatery-chefs-product`.
* see my product for the details.

3. Add a new developer named `dev-training-chef-app`.

4. Add a new developer app named `dev-training-chef-app`.
* see my app for details.

5.  Add a new `Chefs` conditional flow in the proxy endpoint.  
```xml
<Condition>(proxy.pathsuffix MatchesPath "/chefs") and (request.verb = "GET")</Condition>
```

6. Add a Verify API key to request path.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VerifyAPIKey async="false" continueOnError="false" enabled="true" name="Verify-API-Key-1">
    <DisplayName>Verify API Key-1</DisplayName>
    <Properties/>
    <APIKey ref="request.queryparam.apikey"/>
</VerifyAPIKey>
```

7. Add the Assign message after that.  
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AssignMessage async="false" continueOnError="false" enabled="true" name="AssignMessage-RemoveApiKey">
    <DisplayName>AssignMessage-RemoveApiKey</DisplayName>
    <Properties/>
    <Remove>
        <QueryParams>
            <QueryParam name="apikey"/>
        </QueryParams>
    </Remove>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <AssignTo createNew="false" transport="http" type="request"/>
</AssignMessage>
```

8. Save the proxy and start a trace session.

9. Send the `R10 - /chefs no api key` request and observe the response.

10. Send the `R10 - /chefs with apikey` request and observe the response.


# Lab 12 - Security - OAuth 2.0 Access Token
Revision 11 - dev-training-eatery
Revision 1 - OAuth proxy

Verify API is good for limited use cases and the main problem is that if someone obtains your API key, then they will be able to consume the API on your behalf.

OAuth adds an additional layer of security with multiple grant types for different use cases.
We are going to create an OAuth proxy, client credentials grant.  

1. Create the OAuth proxy named `dev-training-oauth`.
* null target endpoint.

2. Add the client credentials conditional flow.
```xml
<Condition>(proxy.pathsuffix MatchesPath "/client_credentials/token") and (request.verb = "POST")</Condition>
```

3. Add the OAuth v2 policy.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuthv2-ClientCredentials">
    <DisplayName>OAuthv2-ClientCredentials</DisplayName>
    <Properties/>
    <Attributes/>
    <!-- This is in millseconds, so expire in an hour -->
    <ExpiresIn>3600000</ExpiresIn>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>GenerateAccessToken</Operation>
    <SupportedGrantTypes>
        <GrantType>client_credentials</GrantType>
    </SupportedGrantTypes>
    <GenerateResponse enabled="true"/>
    <GrantType>request.queryparam.grant_type</GrantType>
    <Tokens/>
</OAuthV2>
```

4. Save the OAuth proxy.

5. Create a new product `dev-training-shopping-product`.
* see my product for details.

6. Create a new app `dev-training-shopping-app`.
* see my app for details.  
* resource path: /stores
* dev-training-eatery is the Api proxy

7. Open the `dev-training-eatery` proxy and save it as a new revision (R11)

8. Add a new `Stores` conditional flow in the Proxy endpoint.
```xml
<Condition>(proxy.pathsuffix MatchesPath "/stores") and (request.verb = "GET")</Condition>
```

9. Add the following Verify Access Token  and Assign message policies on the request path.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="VerifyAccessToken">
    <DisplayName>VerifyAccessToken</DisplayName>
    <Properties/>
    <Attributes/>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>VerifyAccessToken</Operation>
    <SupportedGrantTypes/>
    <GenerateResponse enabled="true"/>
    <Tokens/>
</OAuthV2>
```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<AssignMessage async="false" continueOnError="false" enabled="true" name="AssignMessage-RemoveAccessToken">
    <DisplayName>AssignMessage-RemoveAccessToken</DisplayName>
    <Properties/>
    <Remove>
        <Headers>
            <Header name="Authorization"/>
        </Headers>
    </Remove>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <AssignTo createNew="false" transport="http" type="request"/>
</AssignMessage>
```

10. Save the proxy and start a trace session on both the OAuth proxy and the `edge-developer-eatery` proxies.

11. Send the following requests.  
`oauth - /client_credentials/token` - Update your environment with the client id and secret and then update the Authorization header.  
`R11 - /stores - verify access token - no token`
`R11 - /stores - verify access token` Copy the access token from the oauth client credentials grant before you send the request.  


# Lab 13 - Security - OAuth 2.0 Access Token Password Grant
Revision 12 - edge-developer-eatery
Revision 2 - oauth proxy

Now we are going to create a password grant.  

1. Open the `dev-training-oauth` and save it as a new revision.

2. Create a new conditional flow named `password`.
```xml
 <Condition>(proxy.pathsuffix MatchesPath "/password/token") and (request.verb = "POST")</Condition>
```

3. Add the following policies to the Request path.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="ExtractVariable-UsernamePassword">
    <DisplayName>ExtractVariable-UsernamePassword</DisplayName>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <JSONPayload>
        <Variable name="username" type="string">
            <JSONPath>$.username</JSONPath>
        </Variable>
        <Variable name="password" type="string">
            <JSONPath>$.password</JSONPath>
        </Variable>
    </JSONPayload>
    <Source clearPayload="false">request</Source>
</ExtractVariables>
```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ServiceCallout async="false" continueOnError="false" enabled="true" name="ServiceCallout-ValidateUsernamePassword">
    <DisplayName>ServiceCallout-ValidateUsernamePassword</DisplayName>
    <Properties/>
    <Request clearPayload="true">
        <IgnoreUnresolvedVariables>false</IgnoreUnresolvedVariables>
        <Set>
            <Payload contentType="application/json" variablePrefix="@" variableSuffix="#">
                 {"grant_type":"password", "username": "@username#", "password":"@password#"}
            </Payload>
        </Set>
    </Request>
    <Response>baasResponse</Response>
    <HTTPTargetConnection>
        <Properties/>
        <URL>https://GET-FROM-INSTRUCTOR</URL>
    </HTTPTargetConnection>
</ServiceCallout>
```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<RaiseFault async="false" continueOnError="false" enabled="true" name="RaiseFault-LoginFailed">
    <DisplayName>RaiseFault-LoginFailed</DisplayName>
    <Properties/>
    <FaultResponse>
        <Set>
            <Headers/>
            <Payload contentType="application/json">{"errorcode":"401.01", "message":"username or password is invalid."}</Payload>
            <StatusCode>401</StatusCode>
            <ReasonPhrase>Unauthorized</ReasonPhrase>
        </Set>
    </FaultResponse>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
</RaiseFault>
```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuthv2-Password">
    <DisplayName>OAuthv2-Password</DisplayName>
    <Properties/>
    <Attributes/>
    <ExpiresIn>3600000</ExpiresIn>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>GenerateAccessToken</Operation>
    <SupportedGrantTypes>
        <GrantType>password</GrantType>
    </SupportedGrantTypes>
    <UserName>username</UserName>
    <PassWord>password</PassWord>
    <GrantType>request.queryparam.grant_type</GrantType>
    <GenerateResponse enabled="true"/>
    <Tokens/>
</OAuthV2>
```

4. Save the proxy and start the trace on the `dev-training-oauth` and `dev-training-eatery`

5. Send the following requests.
`oauthR3 - /password/token` - update the Postman environment variables with the client id and secret and then update the Authorization header.  

`R11 - /stores - verify access token copy`

**Observe that there are some values returned from Backend properties that we can use later.**


# Lab 14 - Security - OAuth 2.0 Access Token Password Grant Custom Attributes
Revision 13 - edge-developer-eatery
Revision 3 - oauth proxy

Now we are going to modify the password grant to save the custom attributes from the backend service in the access token.  

1. Open the `dev-training-oauth` and save it as a new revision.

2. Click the conditional flow named `password`.

3. Add the following policy after the Raise Fault policy.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ExtractVariables async="false" continueOnError="false" enabled="true" name="ExtractVariables-BaasResponse">
    <DisplayName>ExtractVariables-BaasResponse</DisplayName>
    <Properties/>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
    <JSONPayload>
        <Variable name="baasToken">
            <JSONPath>$.access_token</JSONPath>
        </Variable>
    </JSONPayload>
    <Source clearPayload="false">baasResponse</Source>
</ExtractVariables>
```

4. The OAuth v2 policy is updated as shown below.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OAuthV2 async="false" continueOnError="false" enabled="true" name="OAuthv2-Password">
    <DisplayName>OAuthv2-Password</DisplayName>
    <Properties/>
    <Attributes>
        <Attribute name="apigee_baas_token" ref="baasToken" display="true"/>
    </Attributes>
    <ExpiresIn>3600000</ExpiresIn>
    <ExternalAuthorization>false</ExternalAuthorization>
    <Operation>GenerateAccessToken</Operation>
    <SupportedGrantTypes>
        <GrantType>password</GrantType>
    </SupportedGrantTypes>
    <UserName>username</UserName>
    <PassWord>password</PassWord>
    <GrantType>request.queryparam.grant_type</GrantType>
    <GenerateResponse enabled="true"/>
    <Tokens/>
</OAuthV2>
```

5. Save the proxy and start the trace on the `dev-training-oauth` and `dev-training-eatery`

6. Send the following requests.
`oauthR4 - /password/token with custom attributes` - update the Postman environment variables with the client id and secret and then update the Authorization header.  

`R11 - /stores - verify access token - custom attribute`



# Lab 15 - Shared Flows
Create a shared flow with spike arrest and Verify API key policy attached.
Spike arrest is hard coded.

1. Create new shared flow named dev-training-security.

2. Add a Verify API Key policy
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VerifyAPIKey async="false" continueOnError="false" enabled="true" name="VerifyAPIKey">
    <DisplayName>VerifyAPIKey</DisplayName>
    <Properties/>
    <APIKey ref="request.queryparam.apikey"/>
</VerifyAPIKey>
```

3. Add a Spike Arrest policy

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<SpikeArrest async="false" continueOnError="false" enabled="true" name="Spike-Arrest-1">
    <DisplayName>Spike Arrest-1</DisplayName>
    <Properties/>
    <Identifier ref="request.queryparam.apikey"/>
    <Rate>10pm</Rate>
</SpikeArrest>
```

4. Now Deploy the shared flow to the test environment.

5. Open dev-training-eatery proxy to include the shared flow. (Revision 12)
* Add the shared flow to the /chefs resource.
* Disable the Verify API policy on the /chefs resource.
* Save the proxy, deploy

6. Start a trace session and send a request without an access token
* Review the trace UI.
* Notice that the Shared Flow callout executed.

7. Send the request with a valid access token.
* Notice that both policies execute successfully.
* review the spike arrest limits and counts in the trace.


## Modify Shared Flow to include Quota

1. Now we are going to modify the shared flow to include the quota policy. Go back to the dev-training-security shared flow and save it as a new revision (R2).

2. Add a new Quota policy to the shared flow.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Quota async="false" continueOnError="false" enabled="true" name="Quota-1" type="flexi">
    <DisplayName>Quota-1</DisplayName>
    <Properties/>
    <Allow count="2000" countRef="request.header.allowed_quota"/>
    <Interval ref="request.header.quota_count">1</Interval>
    <Distributed>true</Distributed>
    <Synchronous>false</Synchronous>
    <TimeUnit ref="request.header.quota_timeout">month</TimeUnit>
    <AsynchronousConfiguration>
        <SyncIntervalInSeconds>20</SyncIntervalInSeconds>
        <SyncMessageCount>5</SyncMessageCount>
    </AsynchronousConfiguration>
</Quota>
```

3. Deploy the shared flow

4. Go back to the dev-training-eatery proxy and start a trace session. Send a request to see the flow variables.  


# Fault Handling
Errors can be thrown from the proxy endpoint as well as the target endpoint.  
You must include error handling in both endpoints.  
We are going to modify the dev-training-eatery proxy to include a fault rule on the proxy endpoint.

Goal is to create a Fault Rule to change the Invalid API key error to more developer friendly format.

1. Save dev-training-eatery as a new revision.  R13.

2. Add a new policy, but do not attach it to the flow.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<RaiseFault async="false" continueOnError="false" enabled="true" name="RaiseFault-InvalidAPIKey">
    <DisplayName>RaiseFault-InvalidAPIKey</DisplayName>
    <Properties/>
    <FaultResponse>
        <Set>
            <Headers/>
            <Payload contentType="application/json">
                {"errorCode":"401.02", "message":"You did not include the API Key."}
            </Payload>
            <StatusCode>401</StatusCode>
            <ReasonPhrase>Unauthorized</ReasonPhrase>
        </Set>
    </FaultResponse>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
</RaiseFault>
```

3. Add the following policy.
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<RaiseFault async="false" continueOnError="false" enabled="true" name="RaiseFault-GenericError">
    <DisplayName>RaiseFault-GenericError</DisplayName>
    <Properties/>
    <FaultResponse>
        <Set>
            <Headers/>
            <Payload contentType="application/json">{"errorCode": "500.01", "message":"An unknown error occurred. Please try your request again later."}</Payload>
            <StatusCode>500</StatusCode>
            <ReasonPhrase>Server Error</ReasonPhrase>
        </Set>
    </FaultResponse>
    <IgnoreUnresolvedVariables>true</IgnoreUnresolvedVariables>
</RaiseFault>
```

4. Update the proxy endpoint <FaultRules/> with the code below.
```xml
<FaultRules>
        <FaultRule name="invalid_key_rule">
            <Step>
                <Name>RaiseFault-InvalidAPIKey</Name>
            </Step>
            <Condition>(fault.name = "FailedToResolveAPIKey")</Condition>
        </FaultRule>
    </FaultRules>
    <DefaultFaultRule name="default-fault">
        <Step>
            <Name>RaiseFault-GenericError</Name>
        </Step>
    </DefaultFaultRule>
```

4. Save the proxy and deploy it and start a trace session.

5. Send the R13 /chefs - No API Key request from Postman.  This will be caught by the RaiseFault-InvalidAPIKey.
Send the R13 /chefs - invalid api key request from Postman. This will be caught by the Default Fault Rule.  



# Maven Deployment
This demos how to deploy an proxy with Apigee Maven Plugin.
* Review the folder structure of an Apigee proxy
* Review the POM file.
* Review the config.json file

## Helpful to Know
You don't have to review these links, since I list all the commands to deploy the proxy.  But if you are interested in learning more about the config and deploy plugins, then you should read them.
* [apigee-config-maven-plugin](https://github.com/apigee/apigee-config-maven-plugin)
* [apigee-maven-deploy-plugin](https://github.com/apigee/apigee-deploy-maven-plugin)
* https://community.apigee.com/articles/26716/api-proxy-team-development-with-maven.html

## export the following variables on your shell
```
export ae_password=apigeepassword
export ae_username=apigeeusername
export ae_org=apigeeorg
```

## Deploy a proxy with config and products developers and developer apps

```
cd /apigee-edge-dev-training-accelerated/apigee-maven-deployment-proxy
```

Create all the apps, products, developers, etc. and deploy the proxy.
```
mvn install -Ptest -Dusername=$ae_username -Dpassword=$ae_password \
                    -Dorg=$ae_org -Dapigee.config.options=create \
                    -Doptions=update
```

Review the following:
* the proxy was created in Apigee Edge
* the base path has /v1 now with due to the config.json
* the target server was created
* the developer was created
* the API product was created
* the developer App was created (includes developer product)

#### Deploy only, do not create create any configurations
This will deploy the proxy as a new revision. It will not create any products, developers apps etc.
```
mvn install -Ptest -Dusername=$ae_username -Dpassword=$ae_password \
                    -Dorg=$ae_org -Doptions=validate
```

* Show that the proxy was deployed as a new revision.


## Deploy a shared flow
This section shows how to deploy a shared flow.  

Review the following:
* shared flow directory structure
* POM file
  * this pom file includes the apitype
  <apigee.apitype>sharedflow</apigee.apitype>
  * uses the sharedflowbundle directory instead
* shared flows can also use config.json and edge.json files as well.


```
cd /apigee-edge-dev-training-accelerated/apigee-maven-deployment-proxy
```

Create all the apps, products, developers, etc. and deploy the proxy.
```
mvn install -Ptest -Dusername=$ae_username -Dpassword=$ae_password \
                    -Dorg=$ae_org -Dapigee.config.options=create \
                    -Doptions=validate
```

Review the following:
* shared flow was deployed to the appropriate environment


## Apickli testing

Review the following:
* apickli testing
  * feature files
  * fixtures folders
  * app-keys.json and test-config.json

https://github.com/apickli/apickli

1. Deploy the apickli proxy

```
cd /apigee-edge-dev-training-accelerated/apigee-maven-deployment-proxy-apickli
```

Create all the apps, products, developers, etc. and deploy the proxy.
```
mvn install -Ptest -Dusername=$ae_username -Dpassword=$ae_password \
                    -Dorg=$ae_org -Dapigee.config.options=create \
                    -Doptions=validate
```

You should see something like:

```json
{
  "appId" : "cbe9b3fe-22c7-414b-8185-102ef5c3f144",
  "attributes" : [ ],
  "callbackUrl" : "",
  "createdAt" : 1518459781095,
  "createdBy" : "user@email.com",
  "credentials" : [ {
    "apiProducts" : [ {
      "apiproduct" : "developer-training-maven-deployment-apickli-product",
      "status" : "approved"
    } ],
    "attributes" : [ ],
    "consumerKey" : "YOUR KEY",
    "consumerSecret" : "YOUR SECRET",
    "expiresAt" : -1,
    "issuedAt" : 1518459781278,
    "scopes" : [ ],
    "status" : "approved"
  } ],
  "developerId" : "c312dd57-2f9c-4e5a-a750-e0c94cf3c4a2",
  "lastModifiedAt" : 1518459781095,
  "lastModifiedBy" : "user@email.com",
  "name" : "developer-training-maven-deployment-apickli-app",
  "scopes" : [ ],
  "status" : "approved"
}
```

2. Copy the Key and Secret from above into the `test/integration/test/app-keys.json` file.
```json
{
  "name": "developer-training-maven-deployment-apickli-app",
  "credentials": [
    {
      "consumerKey": "YOUR KEY HERE",
      "consumerSecret":"YOUR SECRET HERE",
      "apiProducts": [
        {"apiproduct": "developer-training-maven-deployment-apickli-product"}
      ]
    }
  ]
}
```

### Delete existing config
TODO - There is a bug in this command, need to resolve it.

```
mvn install -Ptest -Dusername=$ae_username -Dpassword=$ae_password \
                    -Dorg=$ae_org -Dapigee.config.options=delete -Doptions=clean
```

### Execute Apickli Tests only

#### Integration Tests
Execute the following commands from the `apigee-maven-deployment-proxy-apickli` folder.

**If you make any changes to the Apickli test files the run mvn clean**
```
mvn clean
```

Execute the Integration tests directly:
```
 mvn exec:exec -Dexec.executable="./node_modules/cucumber/bin/cucumber.js" -Dexec.args=" target/test/integration/test" -Ptest -Dusername=$ae_username -Dpassword=$ae_password -Dorg=$ae_org
```

```
./node_modules/cucumber/bin/cucumber.js test/integration/test/ --format json:target/report-test.json
```


# Edgemicro

## Prereqs
* Admin rights of your machine
* OpenSSL
* Node.js/NPM

## Windows
If you are a windows user, then you may run into issues trying to start Edgemicro on your local machine.  

Some are alternatives are:
* Create a GCP Linux VM, SSH into the machine and experiment with EM there.
* Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads) on your machine and then install [Ubuntu](https://www.ubuntu.com/download/desktop)


# Drupal Developer Portal

1. Administration > Configuration > DevConnect
configure which org the dev portal is connected to.
http://dev-org.devportal.apigee.io/admin/config/devconnect

2. Administration > configurations
http://dev-org.devportal.apigee.io/admin/config/devconnect
Dev Portal section. Can configure app and developer portal custom attributes.

3. Change the default logo
Appearance > Settings > Add minimal

4. Change the theme
Appearance > Settings > then click "list tab"
Select from a number of themes.
