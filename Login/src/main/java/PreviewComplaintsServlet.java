import java.io.PrintWriter;
import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;


@WebServlet("/PreviewComplaintsServlet")
public class PreviewComplaintsServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userID = request.getParameter("userID");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        try {
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/ewastemanagement","root","manager");
            PreparedStatement ps = con.prepareStatement("SELECT ComplaintID, ComplaintText, DateSubmitted FROM Complaints WHERE UserID=?");
            ps.setString(1, userID);
            ResultSet rs = ps.executeQuery();

            out.println("<h2>Complaints for User: "+userID+"</h2>");
            out.println("<table border='1'><tr><th>ID</th><th>Complaint</th><th>Date</th></tr>");
            while(rs.next()){
                out.println("<tr>");
                out.println("<td>"+rs.getInt("ComplaintID")+"</td>");
                out.println("<td>"+rs.getString("ComplaintText")+"</td>");
                out.println("<td>"+rs.getTimestamp("DateSubmitted")+"</td>");
                out.println("</tr>");
            }
            out.println("</table><br><a href='previewComplaints.html'>Back</a>");
            rs.close(); ps.close(); con.close();
        } catch(Exception e){ out.println("Error: "+e.getMessage()); e.printStackTrace();}
    }
}
