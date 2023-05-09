import { type NextPage } from "next";
import Sidebar from "~/components/admin/Sidebar";

const Admin: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div>
        <h1>hello</h1>
      </div>
    </div>
  );
};

export default Admin;
