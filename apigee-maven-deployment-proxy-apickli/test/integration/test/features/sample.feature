Feature: Sample Feature
	As an API user
	I want to send requests
	So I can get a response

	Scenario: Get /get with a valid API Key
		Given I set query parameters to
      | parameter | value |
      | apikey | `APIKey` |
		And I set Accept header to application/json
		When I GET /get
		Then response code should be 200


	Scenario: PUT /put and set the status to off with a valid API Key
		Given I set query parameters to
      | parameter | value |
      | apikey | `APIKey` |
		And I pipe contents of file setAutopayOff.json to body
		And I set Content-Type header to application/json
		When I PUT /put
		Then response code should be 200
		And response body should contain off


		Scenario: PUT /put and set the status to off with a invalid API Key
			Given I set query parameters to
	      | parameter | value |
	      | apikey | xyz |
			And I pipe contents of file setAutopayOff.json to body
			And I set Content-Type header to application/json
			When I PUT /put
			Then response code should be 200
			And response body should contain off
