package at.chaoticbits.profit


import at.chaoticbits.exchange.ExchangePrice
import at.chaoticbits.exchange.ExchangeService
import kotlinx.coroutines.experimental.CommonPool
import kotlinx.coroutines.experimental.launch
import kotlinx.coroutines.experimental.runBlocking
import org.knowm.xchange.currency.CurrencyPair
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


/**
 * Service who makes profit calculations between exchanges and currency pairs
 */
@Service
@Transactional(readOnly = true)
class ProfitService {

    private val log = LoggerFactory.getLogger(ProfitService::class.java)

    @Autowired
    lateinit var exchangeService: ExchangeService
    @Autowired
    lateinit var profitRepository: ProfitRepository
    @Autowired
    lateinit var template: SimpMessagingTemplate

    companion object {
        var profits: Map<CurrencyPair, Profit> = mapOf()
        var currentProfits: Map<CurrencyPair, Profit> = mapOf()
    }



    /**
     * Scheduled cron job which calculates profits between all exchanges asynchronously
     * and saves them into the database
     */
    @Scheduled(cron = "0 0/5 * * * ?")
    fun calculateProfits() = runBlocking {

        val distinctCurrencyPairs   = exchangeService.getDistinctCurrencyPairsFromExchanges()


        val exchangePrices = exchangeService.getExchangePriceByCurrencyPairs(distinctCurrencyPairs)

        profits = generateExchangeProfits(exchangePrices)

        profitRepository.saveAll(profits.values)


    }

    /**
     * Scheduled cron job which updates existing profits
     */
    @Scheduled(fixedDelay = 1000)
    fun updateCurrentProfitRates() = runBlocking {

        if(profits.isNotEmpty()) {

            val exchangePrices = exchangeService.getExchangePriceByExistingProfits(profits)

            currentProfits = generateExchangeProfits(exchangePrices)

        } else
            log.warn("No Profits available for update")



        // send updated profit rates to broker
        template.convertAndSend("/topic/profits", currentProfits.values.toList().sortedDescending())

        log.info("${currentProfits.size} updated profits sent to client")

    }


    /**
     * Calculates the profit for every currency pair and populates a list of it
     *
     * @param exchangePrices a list of objects holding exchange name, bid/ask price and currency pair
     * @return list of exchange profits
     */
    fun generateExchangeProfits(exchangePrices: List<ExchangePrice>): Map<CurrencyPair, Profit> {

        val exchangeProfits = mutableMapOf<CurrencyPair, Profit>()

        val calculatedCurrencyPairs: List<CurrencyPair> = exchangePrices.map { exchangePrice -> exchangePrice.currencyPair }.distinct()

        for(calculatedCurrencyPair in calculatedCurrencyPairs)  {

            // get all exchange price entries for the calculatedCurrencyPair
            val exchangesPricesOfCurrencyPair   = exchangePrices.filter { exchangePrice -> exchangePrice.currencyPair == calculatedCurrencyPair }

            val exchangeWithMinAskPrice         = exchangesPricesOfCurrencyPair.minBy { priceOfExchange -> priceOfExchange.ask }
            val exchangeWithMaxBidPrice         = exchangesPricesOfCurrencyPair.maxBy { priceOfExchange -> priceOfExchange.bid }

            // if prices are available and we can buy cheaper than we sell -> calculate difference (profit)
            if (exchangeWithMinAskPrice != null && exchangeWithMaxBidPrice != null &&
                    exchangeWithMinAskPrice.ask > 0 && exchangeWithMaxBidPrice.bid > 0 &&
                    exchangeWithMinAskPrice.ask < exchangeWithMaxBidPrice.bid) {

                val profit = calculateDiffInPercentages(exchangeWithMinAskPrice.ask, exchangeWithMaxBidPrice.bid)

                // only populate profits > 1
                if (profit > 1)
                    exchangeProfits.put(
                        calculatedCurrencyPair,
                        Profit(
                            calculatedCurrencyPair.toString(),
                            exchangeWithMinAskPrice.exchangeName,
                            exchangeWithMinAskPrice.ask,
                            exchangeWithMaxBidPrice.exchangeName,
                            exchangeWithMaxBidPrice.bid,
                            profit
                        )
                    )
            }
        }

        return exchangeProfits
    }


    /**
     * Calculates the difference between the lowest price and highest price in percentages
     *
     * @param lowestPrice lowest price per currency pair
     * @param highestPrice highest price per currency pair
     * @return profit in percentages
     */
    fun calculateDiffInPercentages(lowestPrice: Double, highestPrice: Double): Double {

        if (lowestPrice == 0.0)
            return 0.0

        return 100 * highestPrice / lowestPrice - 100
    }
}
