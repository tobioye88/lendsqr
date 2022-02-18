# Lendsqr

## START APPLICATION

### INSTALL DEPENDENCIES
npm i

### RUN MIGRATIONS
npm run typeorm migration:run 

### Run APPLICATION IN WATCH MODE
npm run watch


APPLICATION RUNNING ON PORT:3000


### Create Account
```bash
curl --location --request POST 'http://localhost:3000/account' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "John Doe 2"
}'

```


### Get Account 
```bash
curl --location --request GET 'http://localhost:3000/account/264355318'
```

### Fund Account
```bash
curl --location --request PATCH 'http://localhost:3000/account/fund' \
--header 'Content-Type: application/json' \
--data-raw '{
    "accountNumber": "531305654",
    "amount": 300
}'
```

### Transfer to another account
```bash
curl --location --request PATCH 'http://localhost:3000/account/funds/transfer' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sourceAccountNumber": "531305654",
    "destinationAccountNumber": "264355318",
    "amount": 100
}'
```

### Withdraw funds from account
```bash
curl --location --request PATCH 'http://localhost:3000/account/funds/withdraw' \
--header 'Content-Type: application/json' \
--data-raw '{
    "accountNumber": "531305654",
    "amount": 300
}'
```