package com.benedict.duomonggo.model;
import jakarta.persistence.*;

@MappedSuperclass
public class Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
