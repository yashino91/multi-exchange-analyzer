package at.chaoticbits.profit


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime


@RestController
@Transactional(readOnly = true)
@RequestMapping("/profits")
class ProfitController {


    @Autowired
    lateinit var profitRepository: ProfitRepository



    /**
     * Return current profits from cache
     */
    @RequestMapping("/getCurrentProfits")
    fun getCurrentProfits(): List<Profit> {
        return ProfitService.currentProfits.values.toList().sortedDescending()
    }


    /**
     * Fetch all existing profits from database and group them by timestamp
     */
    @RequestMapping("/getProfitHistory")
    fun getProfitHistory(): ResponseEntity<Map<LocalDateTime, List<Profit>>> {

        val profits: Iterable<Profit> = profitRepository.findAll().requireNoNulls()

        val groupedProfits: Map<LocalDateTime, List<Profit>> = profits.groupBy { it.datetime }

        return ResponseEntity(groupedProfits, HttpStatus.OK)

    }
}