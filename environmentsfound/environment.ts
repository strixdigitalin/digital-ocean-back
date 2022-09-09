// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: '0.0.1',
  build: 1,
  showBuild: true,
  maximumFileSize: 15,
  // apiBaseUrl: 'https://v2-api.livelearn.info/v1',
  // stripeKey: 'pk_test_GAOwgdMyHnXkj9v9HcTCyu7E00kA8x0Oh1',
  // url: 'https://v2.livelearn.info',
  // socketUrl: 'https://v2-api.livelearn.info'
  apiBaseUrl: 'http://localhost:9000/v1',
  stripeKey:
    'pk_test_51ICH44Kd3OO2kXBrHboC6do0v3IxAPXeNfvUePcLWQGJ15jsXNe2O26RqhRZ3QnJsIX8cxLs7V9DUFbfPT8hSxoI00wNfKakjw',
  //'pk_test_51IErbaH0PoFKT5sJxiGiLNA8KPwdsmH6e3NXH3Pddha2f0kZziYFJNhlFZt1KrWqmZO4FexV4YhtjjLhM9sj2yvq00PS0nf3Ej',
  url: 'http://localhost:4200',
  socketUrl: 'http://localhost:9000'
};
