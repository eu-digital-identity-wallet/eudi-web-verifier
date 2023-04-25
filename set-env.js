const fs = require('fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
// Load node modules
require('dotenv').config();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
    apiUrl: '${process.env.DOMAIN_NAME}',
    appName: '${process.env.APP_NAME}'
};`;
console.log(process.env.DOMAIN_NAME);
console.log(envConfigFile);
fs.writeFile(targetPath, envConfigFile, (err) => {
	if (err) {
		throw console.error(err);
	} else {
		console.log((`Angular environment.ts file generated correctly at ${targetPath} \n`));
	}
});
