package at.chaoticbits.profit

import org.springframework.data.repository.CrudRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource


@RepositoryRestResource(collectionResourceRel = "profits", path = "profits")
interface ProfitRepository : CrudRepository<Profit, Long> {

}