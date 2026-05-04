package com.emergingmarkets.dashboard.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI emergingMarketsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Emerging Markets Dashboard API")
                        .description("REST API for economic indicators across 17 emerging markets in Africa and Asia. Data sourced from the World Bank Open Data API.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Emerging Markets Dashboard")
                                .url("https://emerging-markets-dashboard-two.vercel.app"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}