package com.COMPASS.TodoApplication.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.COMPASS.TodoApplication.Repository.TodoRepository;

import lombok.RequiredArgsConstructor;

@Controller 
@RequiredArgsConstructor 
public class TodoController {



    private final TodoRepository todoRepository;

    @GetMapping({"","/","/home"})
    public String showHomePage(){
        return "index";
    }
    
}
