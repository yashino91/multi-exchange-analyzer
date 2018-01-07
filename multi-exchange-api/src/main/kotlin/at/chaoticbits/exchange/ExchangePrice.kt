package at.chaoticbits.exchange

import org.knowm.xchange.currency.CurrencyPair


/**
 *
 * Illustrates the ask and bid price of a currency pair for an exchange
 *
 * @param currencyPair currencyPair
 * @param exchangeName exchangeName of exchange
 * @param bid current sell price
 * @param ask current buy price
 */
data class ExchangePrice(
        val currencyPair: CurrencyPair,
        val exchangeName: String,
        val bid: Double,
        val ask: Double
): Comparable<ExchangePrice> {

    override fun compareTo(other: ExchangePrice) = comparator.compare(this, other)

    companion object {
        val comparator = compareBy(ExchangePrice::currencyPair)
    }
}