# apigee-edge-dev-training-accelerated

# Prereqs
* Postman (My Postman Collection is named Apigee Edge Developer Training S*)
* Apigee Edge Account
* Apigee BaaS (hopefully you have one, because we don't issue these anymore!)



# Shared Flows
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

## Deploy a proxy with config and products developers and developer apps

## Deploy a shared flow

## Apickli testing???
