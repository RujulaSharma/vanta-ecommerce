import ProtectedRoute from "./ProtectedRoute";

const AdminRoute = () => {
  return <ProtectedRoute adminOnly={true} />;
};

export default AdminRoute;