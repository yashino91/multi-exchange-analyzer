package at.chaoticbits

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.socket.config.annotation.EnableWebSocket


@EnableWebSocket
@EnableScheduling
@SpringBootApplication(exclude = arrayOf(ServletWebServerFactoryAutoConfiguration::class))
class Application : SpringBootServletInitializer() {


    override fun configure(builder: SpringApplicationBuilder): SpringApplicationBuilder {
        return builder.sources(Application::class.java)
    }

    fun main(args: Array<String>) {
        SpringApplication.run(Application::class.java, *args)
    }
}
