package at.chaoticbits.tests;


import at.chaoticbits.exchange.ExchangePrice
import at.chaoticbits.profit.ProfitService
import kotlinx.coroutines.experimental.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

import org.knowm.xchange.currency.CurrencyPair
import org.mockito.InjectMocks
import org.mockito.junit.MockitoJUnitRunner


@RunWith(MockitoJUnitRunner::class)
class ProfitServiceTest {

    @InjectMocks
    lateinit var profitService: ProfitService

    @Test
    fun testCalculateDiffInPercentages100Profit() {

        val profit = profitService.calculateDiffInPercentages(50.0, 100.0)

        assertEquals(100.0, profit, 0.01)
    }

    @Test
    fun testCalculateDiffInPercentagesZeroProfit() {

        val profit = profitService.calculateDiffInPercentages(0.0, 100.0)

        assertEquals(0.0, profit, 0.01)
    }

    @Test
    fun testGenerateExchangeProfits() = runBlocking {

        val exchangePrices = mutableListOf(
                ExchangePrice(CurrencyPair.ETC_BTC, "Kraken", 90.0, 50.0),
                ExchangePrice(CurrencyPair.ETC_BTC, "BitFinex", 80.0, 40.0)
        )

        val profits = profitService.generateExchangeProfits(exchangePrices)

        assertTrue (profits.isNotEmpty())
    }

}
