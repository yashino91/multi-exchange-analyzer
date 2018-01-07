package at.chaoticbits.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter


@Configuration
class ApplicationConfig {

    @Bean
    fun corsFilter(): FilterRegistrationBean<*> {

        val source = UrlBasedCorsConfigurationSource()

        val config = CorsConfiguration()
        config.addAllowedOrigin("http://localhost:3000")
        config.addAllowedMethod(CorsConfiguration.ALL)
        config.addAllowedHeader(CorsConfiguration.ALL)
        config.allowCredentials = false
        config.maxAge = 3600

        source.registerCorsConfiguration("/**", config)

        val bean = FilterRegistrationBean(CorsFilter(source))

        // set CORS as 1st bean so it passes security configuration if enabled
        bean.order = 0

        return bean
    }
}