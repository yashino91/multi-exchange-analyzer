package at.chaoticbits.config

import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import org.springframework.scheduling.config.ScheduledTaskRegistrar
import org.springframework.scheduling.annotation.SchedulingConfigurer


@Configuration
class SchedulingConfigurerConfiguration : SchedulingConfigurer {

    override fun configureTasks(taskRegistrar: ScheduledTaskRegistrar) {
        val taskScheduler = ThreadPoolTaskScheduler()
        taskScheduler.poolSize = 3
        taskScheduler.initialize()
        taskRegistrar.setTaskScheduler(taskScheduler)
    }
}