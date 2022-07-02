So far, can deploy oracle locally and push mainnet blocks to the oracle. Havent tried reading, didnt write tests, etc etc

download forge

start `anvil` in new tab

cd forge
forge build

deploy oracle locally via:

- source .env.example
- forge script script/Oracle.s.sol:ContractScript --fork-url http://localhost:8545 \
  --private-key $PRIVATE_KEY0 --broadcast

cd ../

post to oracle contract via

- source .env.example
- ts-node -T src/index.ts post -b homestead -o localhost
