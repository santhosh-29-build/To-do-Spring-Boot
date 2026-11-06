package com.COMPASS.TodoApplication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.COMPASS.TodoApplication.Entity.TodoEntity;

public interface TodoRepository extends JpaRepository<TodoEntity, Long>{

    
} 