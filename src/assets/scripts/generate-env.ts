const { writeFile, existsSync, mkdirSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

function writeFileUsingFS(targetPath: string, environmentFileContent: string) {
  writeFile(targetPath, environmentFileContent, function (err: any) {
    if (err) {
      console.log(err);
    }
    if (environmentFileContent !== '') {
      console.log(`wrote variables to ${targetPath}`);
    }
  });
}

// Providing path to the `environments` directory
const envDirectory = './src/environments';

// creates the `environments` directory if it does not exist
if (!existsSync(envDirectory)) {
  mkdirSync(envDirectory);
}

//creates the `environment.prod.ts` and `environment.ts` file if it does not exist
writeFileUsingFS('./src/environments/environment.prod.ts', '');
writeFileUsingFS('./src/environments/environment.ts', '');

// Checks whether command line argument of `prod` was provided signifying production mode
const isProduction = !!argv.prod;

// choose the correct targetPath based on the environment chosen
const targetPath = isProduction
  ? './src/environments/environment.prod.ts'
  : './src/environments/environment.ts';

console.log(process.env);
if (!process.env['API_URL']) throw new Error('API_URL is missing');
if (!process.env['FIREBASE_API_KEY'])
  throw new Error('FIREBASE_API_KEY is missing');

//actual content to be compiled dynamically and pasted into respective environment files
const environmentFileContent = `
  // This file was autogenerated by dynamically running setEnv.ts and using dotenv for managing API key secrecy
  export const environment = {
    production: ${isProduction},
    API_URL: '${process.env['API_URL']}',
    firebase: {
        projectId: '${process.env['FIREBASE_PROJECT_ID']}',
        appId: '${process.env['FIREBASE_APP_ID']}',
        storageBucket: '${process.env['FIREBASE_STORAGE_BUCKET']}',
        apiKey: '${process.env['FIREBASE_API_KEY']}',
        authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
        messagingSenderId: '${process.env['FIREBASE_MESSAGING_SENDER_ID']}',
        measurementId: '${process.env['FIREBASE_MEASUREMENT_ID']}',
    }
  };
`;

writeFileUsingFS(targetPath, environmentFileContent); // appending data into the target file
