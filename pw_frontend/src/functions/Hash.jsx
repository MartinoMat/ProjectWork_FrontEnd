
export const genSHA256 = async (message) => {
	// Stringa in Uint8Array (array di byte)
	const msgUint8 = new TextEncoder().encode(message);

	// Calcolo SHA-256
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);

	// SHA265 in Uint8Array (array di byte)
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// Uint8Array in stringa Hex
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

	return hashHex;
};