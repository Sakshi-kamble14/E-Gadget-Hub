import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import java.time.LocalDate;

@WebServlet("/ReportServlet")
public class ReportServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String reportType = request.getParameter("reportType");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String url = "jdbc:mysql://localhost:3306/ewastemanagement"; // replace your_db
        String user = "root";
        String password = "manager";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, user, password);

            String query = "";
            LocalDate today = LocalDate.now();

            switch (reportType) {
                case "daily":
                    query = "SELECT * FROM EwasteInventory WHERE DATE(DateAdded) = ?";
                    break;
                case "weekly":
                    query = "SELECT * FROM EwasteInventory WHERE DateAdded >= ?";
                    break;
                case "monthly":
                    query = "SELECT * FROM EwasteInventory WHERE MONTH(DateAdded) = ? AND YEAR(DateAdded) = ?";
                    break;
            }

            PreparedStatement ps = con.prepareStatement(query);

            if (reportType.equals("daily")) {
                ps.setString(1, today.toString());
            } else if (reportType.equals("weekly")) {
                LocalDate weekAgo = today.minusDays(7);
                ps.setString(1, weekAgo.toString());
            } else if (reportType.equals("monthly")) {
                ps.setInt(1, today.getMonthValue());
                ps.setInt(2, today.getYear());
            }

            ResultSet rs = ps.executeQuery();

            out.println("<h2>" + reportType.toUpperCase() + " Ewaste Report</h2>");
            out.println("<table border='1'><tr><th>ID</th><th>Type</th><th>Quantity</th><th>Status</th><th>Date Added</th></tr>");

            while (rs.next()) {
                out.println("<tr>");
                out.println("<td>" + rs.getInt("InventoryID") + "</td>");
                out.println("<td>" + rs.getString("EwasteType") + "</td>");
                out.println("<td>" + rs.getInt("Quantity") + "</td>");
                out.println("<td>" + rs.getString("Status") + "</td>");
                out.println("<td>" + rs.getTimestamp("DateAdded") + "</td>");
                out.println("</tr>");
            }
            out.println("</table>");
            out.println("<br><a href='report.html'>Back</a>");

            rs.close();
            ps.close();
            con.close();

        } catch (Exception e) {
            out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
