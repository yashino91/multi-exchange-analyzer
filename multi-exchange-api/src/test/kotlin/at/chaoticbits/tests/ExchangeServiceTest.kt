package at.chaoticbits.tests

import at.chaoticbits.exchange.ExchangePrice
import at.chaoticbits.exchange.ExchangeService
import kotlinx.coroutines.experimental.runBlocking
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith
import org.knowm.xchange.ExchangeFactory
import org.knowm.xchange.currency.CurrencyPair
import org.knowm.xchange.poloniex.PoloniexExchange
import org.mockito.InjectMocks
import org.mockito.junit.MockitoJUnitRunner


@RunWith(MockitoJUnitRunner::class)
class ExchangeServiceTest {

    @InjectMocks
    lateinit var exchangeService: ExchangeService


    @Test
    fun testNotNullGetExchangePriceByCurrencyPair() = runBlocking {
        val exchange = ExchangeFactory.INSTANCE.createExchange(PoloniexExchange::class.java.name)
        val currencyPair = CurrencyPair.ETH_BTC

        val exchangePrice = exchangeService.fetchExchangePriceByCurrencyPair(exchange, currencyPair)

        assertNotNull(exchangePrice)
    }

    @Test fun testNullGetExchangePriceByCurrencyPair() = runBlocking {
        val exchange = ExchangeFactory.INSTANCE.createExchange(PoloniexExchange::class.java.name)
        val currencyPair = CurrencyPair.BTC_EUR

        val exchangePrice = exchangeService.fetchExchangePriceByCurrencyPair(exchange, currencyPair)

        assertNull(exchangePrice)
    }

    @Test fun testGetExchangePriceByCurrencyPairs() = runBlocking {

        val currencyPairs = mutableListOf<CurrencyPair>(CurrencyPair.ETH_BTC, CurrencyPair.BTC_EUR)
        val exchangePrices: List<ExchangePrice> = exchangeService.getExchangePriceByCurrencyPairs(currencyPairs)

        assertTrue(exchangePrices.isNotEmpty())
    }

    @Test fun testGetExchangePriceByCurrencyPair() = runBlocking {

        val exchangePrices: List<ExchangePrice> = exchangeService.getExchangePriceByCurrencyPair(CurrencyPair.ETH_BTC)

        assertTrue (exchangePrices.isNotEmpty())
    }

}