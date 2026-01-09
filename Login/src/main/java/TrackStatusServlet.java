import java.io.PrintWriter;
import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;


@WebServlet("/TrackStatusServlet")
public class TrackStatusServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String inventoryID = request.getParameter("inventoryID");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/ewastemanagement","root","manager");
            PreparedStatement ps = con.prepareStatement("SELECT EwasteType, Quantity, Status, DateAdded FROM EwasteInventory WHERE InventoryID=?");
            ps.setInt(1, Integer.parseInt(inventoryID));
            ResultSet rs = ps.executeQuery();

            out.println("<h2>E-Waste Status</h2>");
            if(rs.next()){
                out.println("<p>Type: "+rs.getString("EwasteType")+"</p>");
                out.println("<p>Quantity: "+rs.getInt("Quantity")+"</p>");
                out.println("<p>Status: "+rs.getString("Status")+"</p>");
                out.println("<p>Date Added: "+rs.getTimestamp("DateAdded")+"</p>");
            } else {
                out.println("<p>No record found for Inventory ID "+inventoryID+"</p>");
            }
            out.println("<a href='trackStatus.html'>Back</a>");
            rs.close(); ps.close(); con.close();
        } catch(Exception e){ out.println("Error: "+e.getMessage()); e.printStackTrace();}
    }
}
