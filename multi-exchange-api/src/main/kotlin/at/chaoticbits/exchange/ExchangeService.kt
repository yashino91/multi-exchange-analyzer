package at.chaoticbits.exchange

import at.chaoticbits.profit.Profit
import at.chaoticbits.profit.ProfitService
import kotlinx.coroutines.experimental.*
import org.knowm.xchange.Exchange
import org.knowm.xchange.ExchangeFactory
import org.knowm.xchange.binance.BinanceExchange
import org.knowm.xchange.bittrex.BittrexExchange
import org.knowm.xchange.currency.CurrencyPair
import org.knowm.xchange.kraken.KrakenExchange
import org.knowm.xchange.liqui.LiquiExchange
import org.knowm.xchange.poloniex.PoloniexExchange
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.ForkJoinPool


private val log = LoggerFactory.getLogger(ExchangeService::class.java)


/**
 * Service which interacts with exchanges
 */
@Service
class ExchangeService {


    private final val exchanges = mutableListOf<Exchange>()


    private val forkJoinPool1 = ForkJoinPool(30)
    private val forkJoinPool2 = ForkJoinPool(30)

    /**
     * Initialize all exchanges with the help of the ExchangeFactory
     */
    init {

        log.info("initializing exchanges")

        exchanges.add(ExchangeFactory.INSTANCE.createExchange(PoloniexExchange::class.java.name))
        exchanges.add(ExchangeFactory.INSTANCE.createExchange(KrakenExchange::class.java.name))
        exchanges.add(ExchangeFactory.INSTANCE.createExchange(BittrexExchange::class.java.name))
        exchanges.add(ExchangeFactory.INSTANCE.createExchange(BinanceExchange::class.java.name))
        exchanges.add(ExchangeFactory.INSTANCE.createExchange(LiquiExchange::class.java.name))

    }


    /**
     * Iterates over all given exchanges and returns a list of their distinct currency pairs
     *
     * @return list of distinct currency pairs
     */
    fun getDistinctCurrencyPairsFromExchanges(): List<CurrencyPair> {
        return exchanges.flatMap { exchange -> exchange.exchangeSymbols }.distinct()
    }


    /**
     * Generates a list of ExchangePrices by the given currency pairs
     * for all available exchanges
     *
     * @param currencyPairs list of currency pairs
     * @return list of ExchangePrice
     */
    suspend fun getExchangePriceByCurrencyPairs(currencyPairs: List<CurrencyPair>): List<ExchangePrice> {

        val exchangePriceDeferreds  = mutableListOf<Deferred<ExchangePrice?>>()

        // iterate over all currency pairs and exchanges
        for (currencyPair in currencyPairs) {
            exchanges.mapTo(exchangePriceDeferreds) {

                // asynchronously fetch exchange prices by currency pair from exchange
                async(forkJoinPool1.asCoroutineDispatcher()) {
                    fetchExchangePriceByCurrencyPair(it, currencyPair)
                }
            }
        }

        // wait until all prices have been fetched and store them into a list of ExchangePrice
        return exchangePriceDeferreds.mapNotNull { exchangePriceDeferred -> exchangePriceDeferred.await() }
    }


    suspend fun getExchangePriceByExistingProfits(profits: Map<CurrencyPair, Profit>): List<ExchangePrice> {

        val exchangePriceDeferreds  = mutableListOf<Deferred<ExchangePrice?>>()


        // iterate over all currency pairs and exchanges
        for (currencyPair in ProfitService.profits.keys) {

            val exchangesOfInterest = listOf<String>(profits[currencyPair]!!.buyExchange, profits[currencyPair]!!.sellExchange)

            exchanges.filter { exchange ->  exchangesOfInterest.contains(exchange.defaultExchangeSpecification.exchangeName)}.mapTo(exchangePriceDeferreds) {

                // asynchronously fetch exchange prices by currency pair from exchange
                async(forkJoinPool2.asCoroutineDispatcher()) {
                    fetchExchangePriceByCurrencyPair(it, currencyPair)
                }
            }
        }

        // wait until all prices have been fetched and store them into a list of ExchangePrice
        return exchangePriceDeferreds.mapNotNull { exchangePriceDeferred -> exchangePriceDeferred.await() }
    }


    /**
     * Fetches the current bid and ask price for the given exchange/currency pair
     *
     * @param exchange Exchange
     * @param currencyPair currency pair
     * @return ExchangePrice object populated with exchange name, bid/ask price and currency pair
     */
    suspend fun fetchExchangePriceByCurrencyPair(exchange: Exchange, currencyPair: CurrencyPair): ExchangePrice? {

        val exchangeName = exchange.defaultExchangeSpecification.exchangeName

        try {

            if (exchange.exchangeSymbols.contains(currencyPair)) {

                val ticker = exchange.marketDataService.getTicker(currencyPair)

                if (ticker != null) {
                    log.info( "fetched price for $currencyPair from $exchangeName")
                    return ExchangePrice(currencyPair, exchangeName, ticker.bid.toDouble(), ticker.ask.toDouble())
                }
            }

        } catch (e: Exception) {
            log.warn("Error fetching $currencyPair from exchange $exchangeName. Exception: ${e.message}")
        }

        return null
    }

    /**
     * Generates a list of ExchangePrices by the given currency pair
     * for all available exchanges
     *
     * @param currencyPair currency pair
     * @return list of ExchangePrice
     */
    fun getExchangePriceByCurrencyPair(currencyPair: CurrencyPair): List<ExchangePrice> {

        fun asyncGetExchangePriceByCurrencyPair() = async(CommonPool) {
            getExchangePriceByCurrencyPairs(listOf(currencyPair))
        }

        return runBlocking {asyncGetExchangePriceByCurrencyPair().await()}
    }


}
