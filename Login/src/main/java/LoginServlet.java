import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "manager";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String userType = request.getParameter("userType");
        String email = request.getParameter("username");
        String password = request.getParameter("password");

        if(userType == null || email == null || password == null ||
           userType.isEmpty() || email.isEmpty() || password.isEmpty()) {
            response.sendRedirect("login.html?error=empty");
            return;
        }

        String tableName = "";
        String redirectPage = "";

        switch(userType.toLowerCase()) {
            case "admin":
                tableName = "admin";
                redirectPage = "admin.html";
                break;
            case "customer":
                tableName = "customer";
                redirectPage = "user.html";
                break;
            case "collector":
                tableName = "collector";
                redirectPage = "collector.html";
                break;
            default:
                response.sendRedirect("login.html?error=invalidtype");
                return;
        }

        boolean isValidUser = false;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                String sql = "SELECT * FROM " + tableName + " WHERE Email=? AND Password=?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, email);
                    stmt.setString(2, password);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if(rs.next()) {
                            isValidUser = true;
                        }
                    }
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
            response.getWriter().println("Database error: " + e.getMessage());
            return;
        }

        if(isValidUser) {
            HttpSession session = request.getSession();
            session.setAttribute("email", email);
            session.setAttribute("userType", userType);
            response.sendRedirect(redirectPage);
        } else {
            response.sendRedirect("login.html?error=invalid");
        }
    }
}
