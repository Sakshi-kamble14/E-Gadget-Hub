import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/CollectorReportServlet")
public class CollectorReportServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/ewastemanagement";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "manager";

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);

            String sql = "SELECT * FROM ewasteinventory ORDER BY DateAdded DESC";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);

            boolean found = false;
            while (rs.next()) {
                found = true;
                out.println("<tr>");
                out.println("<td>" + rs.getInt("InventoryID") + "</td>");
                out.println("<td>" + rs.getString("EwasteType") + "</td>");
                out.println("<td>" + rs.getInt("Quantity") + "</td>");
                out.println("<td>" + rs.getString("Status") + "</td>");
                out.println("<td>" + rs.getTimestamp("DateAdded") + "</td>");
                out.println("</tr>");
            }

            if (!found) {
                out.println("<tr><td colspan='5'>No records found</td></tr>");
            }

            rs.close();
            stmt.close();
            conn.close();

        } catch (Exception e) {
            out.println("<tr><td colspan='5' style='color:red;'>Error: " + e.getMessage() + "</td></tr>");
        }
    }
}
