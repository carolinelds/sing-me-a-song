# Sing Me A Song

Project made while on Driven Education's Fullstack Web Development Program. The purpose is to practice tests on different features in a finished fullstack project.


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

If instead you want to run only integration tests, run the following command

```bash
    npm run test:integration
```

And if you want to run only unit tests, run the following command

```bash
    npm run test:unit
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

1. Front-end:

`REACT_APP_API_BASE_URL=http://localhost:<port>`

2. Back-end:

`PORT=<port>`

`DATABASE_URL=postgres://<user>:<password>@localhost:5432/singmeasong`

`BCRYPT_SALT=<number>`

`CRYPTR_SECRET=<string>` 

`JWT_SECRET=<string>`

OBS: Use the following on .env.tests:

`DATABASE_URL=postgres://<user>:<password>@localhost:5432/singmeasong_tests`
`