package com.example.app.api;

import com.example.app.model.WebhookRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {

    @PostMapping
    public WebhookRequest register(@RequestBody WebhookRequest request) {
        return request;
    }
}
