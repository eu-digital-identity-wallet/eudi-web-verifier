import * as CryptoJS from 'crypto-js';
const JWT_EXPIRATION_IN_MILlISECONDS = 3600000;
const HEADER = {
	'alg': 'HS256',
	'typ': 'JWT'
};
export function generateJWT (state: string) {
	const secret = 'mysecret';
	// The header typically consists of two parts:
	// the type of the token, which is JWT, and the signing algorithm being used,
	// such as HMAC SHA256 or RSA.

	const encodedHeaders = btoa(JSON.stringify(HEADER));

	const now = new Date().getTime();
	const claims = {
		'state': state,
		'id_token': '1234',
		'iss': 'eudi.issuer.org',
		'iat': now,
		'exp': now+JWT_EXPIRATION_IN_MILlISECONDS,
		'nbf': now-1
	};
	const encodedPlayload = btoa(JSON.stringify(claims));
	const signature = CryptoJS.HmacSHA256(`${encodedHeaders}.${encodedPlayload}`, secret).toString();
	const encodedSignature = btoa(signature);

	const jwt = `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`;
	return jwt;
}
