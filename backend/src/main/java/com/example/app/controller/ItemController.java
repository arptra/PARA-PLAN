package com.example.app.controller;

import com.example.app.model.Item;
import com.example.app.service.ItemService;
import com.example.core.Log;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemService service;
    private final Logger logger = Log.getLogger(ItemController.class);

    public ItemController(ItemService service) {
        this.service = service;
    }

    @GetMapping
    public Collection<Item> all() {
        logger.info("Fetching all items");
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> one(@PathVariable Long id) {
        Item item = service.findById(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Item create(@RequestBody Item item) {
        return service.create(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> update(@PathVariable Long id, @RequestBody Item item) {
        if (service.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.update(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
