package edu.utexas.cs.cs312;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@SpringBootApplication
public class StyleCheckerApplication {

	public static void main(String[] args) {
		SpringApplication.run(StyleCheckerApplication.class, args);
	}

	@RequestMapping("/")
	String home() {
		return "/index.html";
	}

	@RequestMapping("/hello_world")
	@ResponseBody
	String helloWorld() {
		return "Hello World!";
	}

}
