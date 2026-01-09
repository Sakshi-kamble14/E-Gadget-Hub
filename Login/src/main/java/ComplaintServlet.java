import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/ComplaintServlet")
public class ComplaintServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "manager";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if(session == null || session.getAttribute("email") == null) {
            response.sendRedirect("login.html?error=sessionexpired");
            return;
        }

        String customerEmail = (String) session.getAttribute("email");
        String subject = request.getParameter("subject");
        String description = request.getParameter("description");

        if(subject == null || description == null || subject.isEmpty() || description.isEmpty()) {
            response.sendRedirect("complaint.html?status=error");
            return;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try(Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                String sql = "INSERT INTO Complaints (CustomerEmail, Subject, Description) VALUES (?, ?, ?)";
                try(PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, customerEmail);
                    stmt.setString(2, subject);
                    stmt.setString(3, description);
                    int rows = stmt.executeUpdate();

                    if(rows > 0)
                        response.sendRedirect("complaint.html?status=success");
                    else
                        response.sendRedirect("complaint.html?status=error");
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("complaint.html?status=error");
        }
    }
}
