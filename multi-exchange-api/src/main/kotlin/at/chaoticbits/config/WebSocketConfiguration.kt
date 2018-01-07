package at.chaoticbits.config

import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.stereotype.Component
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry

@Component
@EnableWebSocketMessageBroker
class WebSocketConfiguration : AbstractWebSocketMessageBrokerConfigurer() {

    override
    fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/currentProfits").setAllowedOrigins("*").withSockJS()
    }

    override
    fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker(MESSAGE_PREFIX)
        registry.setApplicationDestinationPrefixes("/app")
    }

    companion object {

        internal val MESSAGE_PREFIX = "/topic"
    }
}