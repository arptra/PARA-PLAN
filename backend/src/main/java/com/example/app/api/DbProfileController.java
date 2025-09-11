package com.example.app.api;

import com.example.app.model.DbProfile;
import com.example.app.model.DbProfilesUpsertRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db/profiles")
public class DbProfileController {

    @GetMapping
    public List<DbProfile> list() {
        return List.of(sample());
    }

    @PostMapping
    public List<DbProfile> upsert(@RequestBody DbProfilesUpsertRequest request) {
        return request.profiles();
    }

    @GetMapping("/{id}")
    public DbProfile get(@PathVariable String id) {
        return sample(id);
    }

    private DbProfile sample() {
        return new DbProfile("p1", "postgres", "vault://pg-prod", "Production Postgres");
    }

    private DbProfile sample(String id) {
        return new DbProfile(id, "postgres", "vault://pg-prod", "Sample profile");
    }
}
