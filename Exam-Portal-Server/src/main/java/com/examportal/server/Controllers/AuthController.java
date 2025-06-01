package com.examportal.server.Controllers;

import com.examportal.server.Configs.JwtTokenUtil;
import com.examportal.server.DTO.ChangeInfo;
import com.examportal.server.DTO.ChangeInfoUser;
import com.examportal.server.DTO.ChangePasswordDTO;
import com.examportal.server.DTO.ResponseDTO;
import com.examportal.server.Entity.Role;
import com.examportal.server.Entity.User;
import com.examportal.server.Entity.UserRole;
import com.examportal.server.Request.LoginRequest;
import com.examportal.server.Request.RegisterRequest;
import com.examportal.server.Service.RoleService;
import com.examportal.server.Service.UserRoleService;
import com.examportal.server.Service.UserService;
import com.examportal.server.Util.JwtResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserRoleService userRoleService;

    @PostMapping("/login/student")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getUserByUsername(loginRequest.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Người dùng không tồn tại!"));

            }
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String rawPassword = loginRequest.getPassword();
            String encodedPasswordFromDB = user.getPassword(); // Mật khẩu đã mã hóa từ cơ sở dữ liệu

            boolean isPasswordMatch = encoder.matches(rawPassword, encodedPasswordFromDB);
            if (!isPasswordMatch) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseDTO("Mật khẩu sai!"));
            }
            // Thực hiện quá trình xác thực (authentication)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // Lưu trữ đối tượng Authentication vào SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Lấy UserDetails sau khi xác thực thành công
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            if (!roles.contains("student")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseDTO("Bạn không có quyền truy cập với tài khoản này!"));
            }
            String token = jwtTokenUtil.generateToken(user.getId(), username, roles);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("An error occurred"));
        }
    }

    @PostMapping("/login/teacher")
    public ResponseEntity<?> loginTeacher(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getUserByUsername(loginRequest.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Người dùng không tồn tại!"));

            }
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String rawPassword = loginRequest.getPassword();
            String encodedPasswordFromDB = user.getPassword(); // Mật khẩu đã mã hóa từ cơ sở dữ liệu

            boolean isPasswordMatch = encoder.matches(rawPassword, encodedPasswordFromDB);
            if (!isPasswordMatch) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseDTO("Mật khẩu sai!"));
            }
            // Thực hiện quá trình xác thực (authentication)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // Lưu trữ đối tượng Authentication vào SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Lấy UserDetails sau khi xác thực thành công
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            if (!roles.contains("teacher")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ResponseDTO("Bạn không có quyền truy cập với tài khoản này!"));
            }
            String token = jwtTokenUtil.generateToken(user.getId(), username, roles);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("An error occurred"));
        }
    }

    @GetMapping("/get/user")
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");

            if (jwt == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }
            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("token exprired");
            }
            String username = claims.getSubject(); // sub

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            Map<String, Object> responseBody = new HashMap<>();
            user.setPassword("");
            responseBody.put("user", user);

            return ResponseEntity.status(200).body(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("get user error");
        }
    }

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody RegisterRequest registerRequest) {
        // Kiểm tra xem username hoặc email đã tồn tại hay chưa
        if (userService.getUserByUsername(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("email đã tồn tại!"));
        }

        if (userService.getUserByEmail(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("Email đã được đăng kí!"));
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = registerRequest.getPassword();
        String encodedPassword = encoder.encode(rawPassword);
        // Tạo người dùng mới
        User user = new User();
        user.setUsername(registerRequest.getEmail());
        user.setPassword(encodedPassword); // Nhớ mã hóa mật khẩu trước khi lưu
        user.setEmail(registerRequest.getEmail());
        user.setEnabled(true);
        user.setFullName(registerRequest.getName());
        user.setSchool(registerRequest.getSchoolName());
        user.setClassName(registerRequest.getClassName());
        user.setBirthday(registerRequest.getDob());
        user.setAddress(registerRequest.getConsious());
        userService.AddOrUpdate(user);

        Role role = roleService.findByRoleName("student");
        if (role == null) {
            throw new RuntimeException("Role 'student' not found");
        }

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleService.save(userRole);
        return ResponseEntity.ok(new ResponseDTO("register successful"));
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<?> registerTeacher(@RequestBody RegisterRequest registerRequest) {
        // Kiểm tra xem username hoặc email đã tồn tại hay chưa
        if (userService.getUserByUsername(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("email đã tồn tại!"));
        }

        if (userService.getUserByEmail(registerRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO("email đã được đăng kí!"));
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = registerRequest.getPassword();
        String encodedPassword = encoder.encode(rawPassword);
        // Tạo người dùng mới
        User user = new User();
        user.setUsername(registerRequest.getEmail());
        user.setPassword(encodedPassword); // Nhớ mã hóa mật khẩu trước khi lưu
        user.setEmail(registerRequest.getEmail());
        user.setEnabled(true);
        user.setFullName(registerRequest.getName());
        user.setSchool(registerRequest.getSchoolName());
        user.setClassName(registerRequest.getClassName());
        user.setBirthday(registerRequest.getDob());
        user.setAddress(registerRequest.getConsious());
        userService.AddOrUpdate(user);

        Role role = roleService.findByRoleName("teacher");
        if (role == null) {
            throw new RuntimeException("Role 'teacher' not found");
        }

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleService.save(userRole);
        return ResponseEntity.ok(new ResponseDTO("register successful"));
    }

    @PostMapping("/change/info/user")
    public ResponseEntity<?> changeInfoUser(HttpServletRequest request, @RequestBody ChangeInfo changeinfo) {
        try {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || !jwt.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }

            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }

            String username = claims.getSubject();
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Kiểm tra User
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            user.setBirthday(changeinfo.getBirthday());
            user.setEmail(changeinfo.getEmail());
            user.setFullName(changeinfo.getFullname());
            user.setTelephone(changeinfo.getTelephone());
            userService.AddOrUpdate(user);
            return ResponseEntity.ok("oke");
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/change/password")
    public ResponseEntity<?> changePassword(HttpServletRequest request, @RequestBody ChangePasswordDTO changePasswordDTo) {
        try {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || !jwt.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }

            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }

            String username = claims.getSubject();
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Kiểm tra User
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            String password = user.getPassword();
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (encoder.matches(changePasswordDTo.getPassword(), password)) {
                String encodedPassword = encoder.encode(changePasswordDTo.getNewPassword());
                user.setPassword(encodedPassword);
                userService.AddOrUpdate(user);
                return ResponseEntity.ok("Thay đổi thành công!");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khâủ của bạn không đúng");

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/get/info/user")
    public ResponseEntity<?> getInfoUser(HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");
            if (jwt == null || !jwt.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }

            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }

            String username = claims.getSubject();
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Kiểm tra User
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            user.setPassword("");
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("user", user);
            return ResponseEntity.status(200).body(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/update/info/user")
    public ResponseEntity<?> updateInfor(HttpServletRequest request, @RequestBody ChangeInfoUser changeInfo) {
        try {

            String jwt = request.getHeader("Authorization");    //Lấy token từ header "Authorization"
            if (jwt == null || !jwt.startsWith("Bearer ")) {        //Kiểm tra token có tồn tại và có bắt đầu bằng "Bearer " không (chuẩn của JWT).
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
            }                                                          //Nếu sai → trả về mã 401 Unauthorized.

            jwt = jwt.substring(7);
            Claims claims = jwtTokenUtil.getClaimsFromToken(jwt);   //Cắt bỏ phần "Bearer " để lấy chuỗi JWT thực sự.
            java.util.Date expiration = claims.getExpiration();
            if (expiration.before(new java.util.Date())) {          //Lấy thời gian hết hạn của token.
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
            }                                                       //So sánh với thời gian hiện tại → nếu token đã hết hạn thì trả về lỗi.



            String username = claims.getSubject();
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            // Kiểm tra User
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            user.setFullName(changeInfo.getFullname());
            user.setClassName(changeInfo.getClassName());
            user.setAddress(changeInfo.getAddress());
            user.setBirthday(changeInfo.getBirthday());
            user.setSchool(changeInfo.getSchool());
            userService.AddOrUpdate(user);

            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


}
