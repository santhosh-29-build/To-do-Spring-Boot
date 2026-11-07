package com.COMPASS.TodoApplication.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.COMPASS.TodoApplication.Entity.TodoEntity;
import com.COMPASS.TodoApplication.Repository.TodoRepository;

import org.springframework.ui.Model;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class TodoController {

    private final TodoRepository todoRepository;

    @GetMapping({ "", "/", "/home" })
    public String showHomePage(Model model) {
        model.addAttribute("todos", todoRepository.findAll());
        return "index";
    }

    @PostMapping("/add")
    public String addTodo(@RequestParam String title,
            RedirectAttributes redirectAttributes) {

        title = title.trim();

        if (title.isEmpty()) {
            redirectAttributes.addFlashAttribute("error",
                    "Todo title cannot be empty!");
            return "redirect:/";
        }

        if (todoRepository.existsByTitleIgnoreCase(title)) {
            redirectAttributes.addFlashAttribute("error",
                    "Todo already exists!");
            return "redirect:/";
        }

        TodoEntity newTodo = TodoEntity.builder()
                .title(title)
                .isCompleted(false)
                .build();

        todoRepository.save(newTodo);

        redirectAttributes.addFlashAttribute("success",
                "Todo added successfully!");

        return "redirect:/";
    }

    @GetMapping("/update/{id}")
    public String update(@PathVariable long id) {
        TodoEntity existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo Not Found: " + id));
        existingTodo.setCompleted(!existingTodo.isCompleted());

        todoRepository.save(existingTodo);

        return "redirect:/";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable long id) {
        TodoEntity existingtodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("To do Not found" + id));
        todoRepository.delete(existingtodo);
        return "redirect:/";
    }
}
