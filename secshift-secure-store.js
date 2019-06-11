const sodium = require('sodium').api

class SecShiftSecureStore {
	constructor(clientSecretKey,serverPublicKey) {
		this.clientSecretKey = Buffer.from(clientSecretKey,"base64")
		this.serverPublicKey = Buffer.from(serverPublicKey,"base64")
	}

	//TODO how to make method private
	encryptAuthToken(token) {
		const tokenBuffer = Buffer.from(JSON.stringify(token),"utf-8");
		const nonce = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);
		sodium.randombytes(nonce);
		const tokenBufferEnc = sodium.crypto_box(
			tokenBuffer,nonce,
			this.serverPublicKey,
			this.clientSecretKey
		)
		if (!tokenBufferEnc) {
			throw("Error generating store token")
		}
		const shortTokenBufferEnc = tokenBufferEnc.slice(sodium.crypto_box_BOXZEROBYTES)
		const tokenEnc = Buffer.concat([ nonce, shortTokenBufferEnc])
		const tokenEncString=tokenEnc.toString("base64")
		return tokenEncString
	}

	generateStoreAuthToken() {
		return this.encryptAuthToken({ timestamp: Date.now() })
	}

	validateStoreResponseToken(responseTokenEncString) {
		const responseTokenEnc = Buffer.from(responseTokenEncString,"base64")
		const nonce = responseTokenEnc.slice(0,sodium.crypto_box_NONCEBYTES)
		const shortResponseTokenBufferEnc = responseTokenEnc.slice(sodium.crypto_box_NONCEBYTES)
		const zeros = Buffer.allocUnsafe(sodium.crypto_box_BOXZEROBYTES)
		zeros.fill(0)
		const responseTokenBufferEnc = Buffer.concat( [ zeros, shortResponseTokenBufferEnc])
		const responseTokenBuffer = sodium.crypto_box_open(
			responseTokenBufferEnc,nonce,
			this.serverPublicKey,
			this.clientSecretKey
		)
		const responseToken=responseTokenBuffer.toString("utf-8")
		return JSON.parse(responseToken)
	}

	generateRetrieveAuthToken(slotToken) {
		return this.encryptAuthToken({
			timestamp: Date.now(),
			payload: {
				slot_token: slotToken
			}
		})
	}
}
module.exports = SecShiftSecureStore
