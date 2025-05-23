package com.kscst.vocational_training.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.logging.Logger;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private static final Logger LOGGER = Logger.getLogger(WebConfig.class.getName());

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        LOGGER.info("Configuring resource handler for /uploads/** to file:///D:/KSCST/vocational-training/uploads/");
        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations("file:///D:/KSCST/vocational-training/uploads/")
                .setCachePeriod(0);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        LOGGER.info("Configuring CORS for /uploads/**");
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}