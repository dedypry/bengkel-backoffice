import { Suspense } from "react";
import { useLocation, useRoutes } from "react-router-dom";

import AuthLayout from "./components/layouts/auth";
import AdminLayout from "./components/layouts/admin";
import Loading from "./components/loading/Loading";

import routes from "~react-pages";

function App() {
  const { pathname } = useLocation();
  const isLogin = pathname.startsWith("/login");

  const element = useRoutes([
    {
      element: isLogin ? <AuthLayout /> : <AdminLayout />,
      children: routes,
    },
  ]);

  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

export default App;
