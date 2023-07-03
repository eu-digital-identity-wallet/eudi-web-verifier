export function isJSON (requestCode: string) {
	try {
		return (JSON.parse(requestCode) && !!requestCode);
	} catch (e) {
		return false;
	}
}
