import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/ViewComplaintsServlet")
public class ViewComplaintsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "manager";

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'>");
        out.println("<head>");
        out.println("<meta charset='UTF-8'>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("<title>View Complaints - Admin</title>");
        out.println("<style>");
        out.println("table { border-collapse: collapse; width: 100%; }");
        out.println("th, td { border: 1px solid #ddd; padding: 8px; }");
        out.println("th { background-color: #4CAF50; color: white; }");
        out.println("tr:nth-child(even) { background-color: #f2f2f2; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>All Submitted Complaints</h1>");
        out.println("<table>");
        out.println("<tr><th>Complaint ID</th><th>Customer Name</th><th>Subject</th><th>Description</th><th>Status</th><th>Date</th></tr>");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
                String sql = "SELECT c.ComplaintID, cu.CustomerName, c.Subject, c.Description, c.Status, c.SubmittedAt " +
                             "FROM complaints c " +
                             "JOIN customer cu ON c.CustomerEmail = cu.Email " +
                             "ORDER BY c.SubmittedAt DESC";

                try (PreparedStatement stmt = conn.prepareStatement(sql);
                     ResultSet rs = stmt.executeQuery()) {

                    boolean hasData = false;
                    while (rs.next()) {
                        hasData = true;
                        out.println("<tr>");
                        out.println("<td>" + rs.getInt("ComplaintID") + "</td>");
                        out.println("<td>" + rs.getString("CustomerName") + "</td>");
                        out.println("<td>" + rs.getString("Subject") + "</td>");
                        out.println("<td>" + rs.getString("Description") + "</td>");
                        out.println("<td>" + rs.getString("Status") + "</td>");
                        out.println("<td>" + rs.getTimestamp("SubmittedAt") + "</td>");
                        out.println("</tr>");
                    }

                    if (!hasData) {
                        out.println("<tr><td colspan='6'>No complaints submitted yet.</td></tr>");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace(out);
            out.println("<tr><td colspan='6'>Error loading complaints.</td></tr>");
        }

        out.println("</table>");
        out.println("<br><a href='admin.html'>Back to Dashboard</a>");
        out.println("</body>");
        out.println("</html>");
    }
}
