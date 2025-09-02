package com.example.app.service;

import com.example.app.model.Item;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ItemService {
    private final Map<Long, Item> items = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong();

    public Collection<Item> findAll() {
        return items.values();
    }

    public Item findById(Long id) {
        return items.get(id);
    }

    public Item create(Item item) {
        long id = counter.incrementAndGet();
        item.setId(id);
        items.put(id, item);
        return item;
    }

    public Item update(Long id, Item item) {
        item.setId(id);
        items.put(id, item);
        return item;
    }

    public void delete(Long id) {
        items.remove(id);
    }
}
