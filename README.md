# Multi-Exchange-Analyzer (MEA)

Simple profit analyzer for tracking currency pairs between multiple exchanges.

## Description
This project consists of 2 parts:
  - A webservice that calculates profits of supported currency pairs between multiple exchanges
  - A frontend application that displays all profits in realtime via websockets

The webservice fetches prices of all supported currency pairs from the listed exchanges every 5 minutes and saves them into a mysql database for later analyses. In addition a 2nd scheduler re-calulcates the existing profits every few seconds and sends them via websockets to the client.

## Live Application
The latest release is deployed [here](https://bitwork.soon.it/me-analyzer/)

## Supported Exchanges
- [x] **Poloniex**
- [x] **Kraken**
- [x] **Bittrex**
- [x] **Binance**
- [x] **Liqui**

