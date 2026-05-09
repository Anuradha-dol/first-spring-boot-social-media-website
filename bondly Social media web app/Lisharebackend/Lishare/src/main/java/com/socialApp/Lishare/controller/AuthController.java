package com.socialApp.Lishare.controller;

import com.socialApp.Lishare.Service.AuthService;
import com.socialApp.Lishare.dtos.AuthResponse;
import com.socialApp.Lishare.dtos.LoginRequest;
import com.socialApp.Lishare.dtos.UserDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserDto.RegisterRequest registerRequest,
                                                 HttpServletResponse response) {
        AuthResponse res = authService.signUp(registerRequest);

        // ✅ store email in cookie for resend OTP convenience
        Cookie emailCookie = new Cookie("userEmail", registerRequest.email());
        emailCookie.setHttpOnly(true);
        emailCookie.setPath("/");
        emailCookie.setMaxAge(30 * 60); // 30 minutes
        emailCookie.setSecure(false); // true if using https
        emailCookie.setDomain("localhost"); // match frontend domain

        response.addCookie(emailCookie);

        return ResponseEntity.ok(res);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest,
                                              HttpServletResponse response) {
        return ResponseEntity.ok(authService.SignIn(loginRequest, response));
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-code")
    public ResponseEntity<AuthResponse> verifyCode(@Valid @RequestBody UserDto.VerifyCodeDto verifyCodeDto) {
        return ResponseEntity.ok(authService.verifyCode(verifyCodeDto.email(), verifyCodeDto.verifyCode()));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get( "email");
        if (email == null) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .message("Email is required.")
                            .success(false)
                            .build());
        }
        return ResponseEntity.ok(authService.resendOtp(email));
    }





}
