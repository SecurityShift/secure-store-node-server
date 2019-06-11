# secure-store-node-server
Secure Store Client Server NodeJS code

HOW TO USE:

1. Add the following dependency to your node application:

	npm install --save sodium

2. Add the javascript file to your node application.

3. Construct an instance of the class as follows:

	const SecShiftSecureStore = require("./secshift-secure-store.js")
	const secureStore = new SecShiftSecureStore(CLIENT-SECRET-KEY,SERVER-PUBLIC-KEY)

4. Use the class to generate a store auth token that needs to be passed to the client browser javascript:

	secureStore.generateStoreAuthToken()

5. Validate the Store Response Token passed back from the client browser javascript:

	secureStore.validateStoreResponseToken(STORE-RESPONSE-TOKEN)

   This will return an object as follows:

{
  response_data: {
    cc_holder_name: 'Chris Wright',
    cc_number_masked: '************4444',
    cc_expiry: '05/20'
  },
  slot_token: 'JfMlobWZQJOQ/WN0W9goqjp6TiunPsZVh28qRC6uZEA=',
  expiry_date: null
}

6. Generate a retrieve auth token that needs to be passed to the client browser javascript to retrieve details:

	secureStore.generateRetrieveAuthToken(SLOT-TOKEN)



