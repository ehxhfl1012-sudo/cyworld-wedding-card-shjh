package com.example.minihome;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/home")
    public String home(Model model) {
        // 프로필 / 초대 정보
        model.addAttribute("groomName", "장성현");
        model.addAttribute("brideName", "김지현");
        model.addAttribute("weddingDate", "4월 20일");
        model.addAttribute("weddingHall", "DMC컨벤션 펠리체홀");
        model.addAttribute("miniMessage", "우리의 소중한 날, 함께해 주세요.");

        // 스킨: 하얀색
        model.addAttribute("skin", "white");

        // 테스트용 BGM 경로 (src/main/resources/static/audio/test-bgm.mp3)
        model.addAttribute("bgmUrl", "/audio/test-bgm.mp3");

        return "home";
    }
}

