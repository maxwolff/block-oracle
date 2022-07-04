# Block Oracle

A simple oracle for blocks, and a script that posts each block to the oracle.

## To run

Install [forge](https://book.getfoundry.sh/getting-started/installation.html)

### Deploy oracle locally via:

- Start local node `anvil` in new tab
- `cd forge`
- `forge build`
- `git submodule update --init --recursive`
- `export $(cat .env | xargs)`
- `forge create src/Oracle.sol:Oracle --rpc-url http://localhost:8545 \ --private-key $PRIVATE_KEY0`

### Run script to post to contract

- `npm install`
- Build typechain contract wrappers `npm run build-types`
- Compile ts `npm run build`
- `export $(cat .env | xargs)`
- `npm start`

### TODO

- build typescript and compile contracts in docker
- more tests, maybe an integration test (automate test for above)
- gas golf
- failure & retry logic for sending txs
- better way to keep track of contract addresses on diff networks

docker build . -t m/oracle
docker run --env-file=.env.example m/oracle
