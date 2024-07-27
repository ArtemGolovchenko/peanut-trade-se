# Peanut.Trade SE task
## Installation
1. Clone a repository
2. Install all the dependencies:
    ```sh
    npm install
    ```
6. run the application:
   ```sh
    npm run start
    ```
## Endpoints
| Endpoint | Function |
| ------ | ------ |
| GET http://localhost:3000/estimate?inputAmount={inputAmount}&inputCurrency={inputCurrency}&outputCurrency={outputCurrency} | Get the best price
| GET http://localhost:3000/getRates?baseCurrency={baseCurrency}&quoteCurrency={quoteCurrency}  | Get all prices