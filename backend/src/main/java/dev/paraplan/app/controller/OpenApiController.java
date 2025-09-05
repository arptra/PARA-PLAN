package dev.paraplan.app.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpenApiController {

  @GetMapping(value = "/openapi.yaml")
  public Resource openapi() {
    return new ClassPathResource("openapi/paraplan-openapi.yaml");
  }
}
