import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/SubmitEwasteServlet")
public class SubmitEwasteServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String ewasteType = request.getParameter("ewasteType");
        int quantity = Integer.parseInt(request.getParameter("quantity"));

        String url = "jdbc:mysql://localhost:3306/ewastemanagement"; // replace your_db
        String user = "root"; // your MySQL username
        String password = "manager"; // your MySQL password

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, user, password);

            String sql = "INSERT INTO EwasteInventory(EwasteType, Quantity) VALUES(?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, ewasteType);
            ps.setInt(2, quantity);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                out.println("<h3>E-Waste Submitted Successfully!</h3>");
                out.println("<a href='submitEwaste.html'>Submit More</a> | <a href='report.html'>View Reports</a>");
            } else {
                out.println("<h3>Failed to submit. Try again!</h3>");
            }

            ps.close();
            con.close();

        } catch (Exception e) {
            out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
