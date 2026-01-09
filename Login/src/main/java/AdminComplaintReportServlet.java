import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/AdminComplaintReportServlet")
public class AdminComplaintReportServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "manager";

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String sql = "SELECT ComplaintID, CustomerEmail, Subject, Description, Status, SubmittedAt "
                   + "FROM complaints ORDER BY SubmittedAt DESC";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {

                boolean found = false;

                while (rs.next()) {
                    found = true;
                    out.println("<tr>");
                    out.println("<td>" + rs.getInt("ComplaintID") + "</td>");
                    out.println("<td>" + rs.getString("CustomerEmail") + "</td>");
                    out.println("<td>" + rs.getString("Subject") + "</td>");
                    out.println("<td>" + rs.getString("Description") + "</td>");
                    out.println("<td>" + rs.getString("Status") + "</td>");
                    out.println("<td>" + rs.getTimestamp("SubmittedAt") + "</td>");
                    out.println("</tr>");
                }

                if (!found) {
                    out.println("<tr><td colspan='6'>No complaints found</td></tr>");
                }

            }

        } catch (Exception e) {
            out.println("<tr><td colspan='6' style='color:red;'>Error: " + e.getMessage() + "</td></tr>");
            e.printStackTrace();
        }
    }
}
