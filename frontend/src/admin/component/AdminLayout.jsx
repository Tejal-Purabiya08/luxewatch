import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        
        .admin-layout{
          display:flex;
          background:#f8fafc;
          min-height:100vh;
        }

        .main-content{
          flex:1;
          margin-left:280px;
          width:calc(100% - 280px);
          transition:0.3s ease;
        }

        .page-content{
          padding:20px;
          animation:fadeIn .25s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(5px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        @media(max-width:768px){

          .main-content{
            margin-left:250px;
            width:calc(100% - 250px);
          }

        }

      `}</style>
    </div>
  );
}

export default AdminLayout;