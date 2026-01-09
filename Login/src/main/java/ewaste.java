import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/EwasteSubmissionServlet")
public class ewaste extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Get form data
        String ewasteType = request.getParameter("ewasteType");
        int quantity = Integer.parseInt(request.getParameter("quantity"));
        String pickupAddress = request.getParameter("pickupAddress");
        String pickupDate = request.getParameter("pickupDate");
        String contactNumber = request.getParameter("contactNumber");

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Connect to your database "ewastemanagement"
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/ewastemanagement", "root", "manager");

            // Insert into inventory table
            String sql = "INSERT INTO inventory (EwasteType, Quantity, PickupAddress, PickupDate, ContactNumber) VALUES (?, ?, ?, ?, ?)";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, ewasteType);
            pstmt.setInt(2, quantity);
            pstmt.setString(3, pickupAddress);
            pstmt.setString(4, pickupDate);
            pstmt.setString(5, contactNumber);

            int row = pstmt.executeUpdate();
            if (row > 0) {
                out.println("<p style='color:green; font-weight:bold;'>E-Waste submitted successfully!</p>");
            } else {
                out.println("<p style='color:red; font-weight:bold;'>Submission failed. Try again.</p>");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("<p style='color:red; font-weight:bold;'>Error: " + e.getMessage() + "</p>");
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
}
