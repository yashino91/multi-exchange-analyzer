# Multi-Exchange-Analyzer (MEA)

[![Build Status](https://travis-ci.org/yashino91/multi-exchange-analyzer.svg?branch=master)](https://travis-ci.org/yashino91/multi-exchange-analyzer)


Simple profit analyzer for tracking currency pairs between multiple exchanges.

## Description
This project consists of 2 parts:
  - A webservice that calculates profits of supported currency pairs between multiple exchanges
  - A frontend application that displays all profits in realtime via websockets

The webservice is fetching prices for all currency pairs at the supported exchanges. It calculates possible profits that you can gain, if you buy and sell a currency pair at a specific exchange and saves the results into a mysql database for later analyses.

## Live Application
The latest release is deployed [here](https://bitwork.soon.it/me-analyzer/)

## Supported Exchanges
- [x] **Poloniex**
- [x] **Kraken**
- [x] **Bittrex**
- [x] **Binance**
- [x] **Liqui**


## Installation

#### Start Webservice
In order to start this service a running mysql server is necessary.
You also have to adjust the persistence settings in **src/main/resources/application-dev.properties** according to your mysql server setup:
```
spring.datasource.url=jdbc:mysql://localhost:yourMysqlPort/yourDatabase
spring.datasource.username=yourUsername
spring.datasource.password=yourPassword
```

Make sure that ddl creation is enabled for the first startup
```
spring.jpa.hibernate.ddl-auto=create
```
If your database is runnng and all settings are set you can start the service.
```sh
$ cd multi-exchange-api
$ ./gradlew bootRun
```

#### Start Frontend
Make sure that nodejs, npm (yarn) is installed on you system and execute the following commands to start the frontend:
```sh
$ cd multi-exchange-gui
$ yarn
$ npm start
```

The frontend is accessible at: http://localhost:3000

