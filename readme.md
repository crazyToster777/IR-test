# Tests

## Quick start

Get tests dependencies

```shell
yarn install
# in case of errors make sure that `.env` file exist and correct
```

Run commands exact test

```shell
npm run test:all 
```

Add local allure

```shell
brew install allure
```

And check allure report

```shell
npm run report:allure
```


## Troubleshooting

- Error: `Error response from daemon: Ports are not available: listen tcp 0.0.0.0:5000: bind: address already in use`
- Solution: [disable airplay (on mac)](https://developer.apple.com/forums/thread/682332)


