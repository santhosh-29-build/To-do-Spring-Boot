package com.COMPASS.TodoApplication.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.COMPASS.TodoApplication.Entity.TodoEntity;
import com.COMPASS.TodoApplication.Repository.TodoRepository;

import org.springframework.ui.Model;
import lombok.RequiredArgsConstructor;

@Controller 
@RequiredArgsConstructor 
public class TodoController {



    private final TodoRepository todoRepository;

    @GetMapping({"","/","/home"})
    public String showHomePage(Model model){
        model.addAttribute("todos", todoRepository.findAll());
        return "index";
    }

    @PostMapping("/add")
    public String addTodo(@RequestParam String title){

        TodoEntity newTodo=TodoEntity.builder().title(title).isCompleted(false).build();
        todoRepository.save(newTodo);
        return "redirect:/";
    }
    
}
