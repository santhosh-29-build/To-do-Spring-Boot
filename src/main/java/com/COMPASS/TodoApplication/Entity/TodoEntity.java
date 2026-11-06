package com.COMPASS.TodoApplication.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table (name = "tbl_todos")
@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder   
public class TodoEntity {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private long id;

    @Column(nullable = false ,  unique = true)
    private String title;

    private boolean isCompleted;


}
