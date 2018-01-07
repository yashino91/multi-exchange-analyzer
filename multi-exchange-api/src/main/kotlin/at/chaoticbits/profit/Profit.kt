package at.chaoticbits.profit

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*


/**
 * Profit Entity
 */
@Entity
@Table(name = "profits")
data class Profit(


    @Column(nullable = false, length = 10)
    val currencyPair: String,

    @Column(nullable = false, length = 50)
    val buyExchange: String,

    @Column(columnDefinition="Decimal(14,8)")
    val buyPrice: Double,

    @Column(nullable = false, length = 50)
    val sellExchange: String,

    @Column(columnDefinition="Decimal(14,8)")
    val sellPrice: Double,

    @Column(columnDefinition="Decimal(9,2)")
    val profit : Double,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: Long = -1,

    @Column(nullable = false)
    val datetime: LocalDateTime = LocalDateTime.now(),

    @JsonInclude()
    @Transient
    val uuid: String = UUID.randomUUID().toString()


) : Comparable<Profit> {



    override fun toString(): String = String.format("%-10s Buy: %-9s %-14.9f Sell: %-9s  %-14.9f Profit: %.2f%% ",
            this.currencyPair,
            this.buyExchange,
            this.buyPrice,
            this.sellExchange,
            this.sellPrice,
            this.profit)

    override fun compareTo(other: Profit) = comparator.compare(this, other)

    // compare exchange profit by profit
    companion object {
        val comparator = compareBy(Profit::profit)
    }

}