# Banking App

This is a simple banking application built with Express.js for educational purposes. It provides basic functionalities such as creating accounts, performing transactions, checking balances, and viewing transaction history.

## Getting Started

Clone the repository: git clone <repository-url>  
Navigate to the project directory: cd <project-directory>  
Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

## Endpoints

| Endpoint                         | Description                      |
| -------------------------------- | -------------------------------- |
| GET /contas                      | Get a list of all accounts.      |
| GET /contas/saldo                | Get the account balance.         |
| GET /contas/extrato              | Get the transaction history.     |
| DELETE /contas/:conta            | Delete an account.               |
| POST /transacoes/depositar       | Deposit funds into an account.   |
| POST /transacoes/sacar           | Withdraw funds from an account.  |
| POST /transacoes/transferir      | Transfer funds between accounts. |
| POST /contas                     | Create a new account.            |
| PUT /contas/:numeroConta/usuario | Update account information.      |

## Middleware

| Middleware                | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| validarSenha              | Validates the bank password for specific routes.         |
| obterContaPorNumeroESenha | Validates account number and password.                   |
| contaParaExcluir          | Middleware to check and allow account deletion.          |
| obterContaValor           | Validates account number and value for transactions.     |
| obterContaOeD             | Validates source and destination accounts for transfers. |
| verificarCPFExiste        | Checks if the provided CPF already exists.               |
| verificarContaExiste      | Checks if the provided account number exists.            |
| verificarEmailExiste      | Checks if the provided email already exists.             |
| verificarReqMudar         | Validates required fields for account update/create.     |

## Data Storage

This application uses an in-memory database for storing accounts, transactions, and other data.
