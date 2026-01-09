import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/RegisterServlet")
public class Register extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "manager";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");
        String password = request.getParameter("password");
        String userType = request.getParameter("userType");

        // -------------------------
        // Error message helper
        // -------------------------
        HttpSession session = request.getSession();

        // Required Fields validation
        if (name == null || email == null || password == null || userType == null ||
                name.isEmpty() || email.isEmpty() || password.isEmpty() || userType.isEmpty()) {

            session.setAttribute("error", "All required fields must be filled!");
            response.sendRedirect("register.html");
            return;
        }

        // Gmail Validation
        if (!email.endsWith("@gmail.com")) {
            session.setAttribute("error", "Only Gmail addresses are allowed!");
            response.sendRedirect("register.html");
            return;
        }

        // Phone Validation (Customer Only)
        if (userType.equalsIgnoreCase("customer")) {
            if (phone == null || !phone.matches("\\d{10}")) {
                session.setAttribute("error", "Phone number must be exactly 10 digits!");
                response.sendRedirect("register.html");
                return;
            }
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

                PreparedStatement ps;
                String sql;

                switch (userType.toLowerCase()) {
                    case "customer":
                        sql = "INSERT INTO Customer (CustomerName, Email, PhoneNo, Address, Password) VALUES (?, ?, ?, ?, ?)";
                        ps = conn.prepareStatement(sql);
                        ps.setString(1, name);
                        ps.setString(2, email);
                        ps.setString(3, phone);
                        ps.setString(4, address);
                        ps.setString(5, password);
                        break;

                    case "admin":
                        sql = "INSERT INTO Admin (AdminName, Email, Password) VALUES (?, ?, ?)";
                        ps = conn.prepareStatement(sql);
                        ps.setString(1, name);
                        ps.setString(2, email);
                        ps.setString(3, password);
                        break;

                    case "collector":
                        sql = "INSERT INTO Collector (CollectorName, Email, Password) VALUES (?, ?, ?)";
                        ps = conn.prepareStatement(sql);
                        ps.setString(1, name);
                        ps.setString(2, email);
                        ps.setString(3, password);
                        break;

                    default:
                        session.setAttribute("error", "Invalid user type!");
                        response.sendRedirect("register.html");
                        return;
                }

                int row = ps.executeUpdate();

                if (row > 0) {
                    session.setAttribute("success", "Registration successful! Please login.");
                    response.sendRedirect("login.html");
                } else {
                    session.setAttribute("error", "Registration failed. Try again!");
                    response.sendRedirect("register.html");
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("error", "Server error: " + e.getMessage());
            response.sendRedirect("register.html");
        }
    }
}
