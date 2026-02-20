import { Route, Routes } from "react-router-dom";

import LayoutAdmin from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import LoginPage from "./pages/auth/login";
import CashierPage from "./pages/cashier";
import BookingPage from "./pages/booking";
import ServiceAddPage from "./pages/service/add";
import QueuePage from "./pages/service/queue";
import HistoryPage from "./pages/service/history";
import InventoryStockPage from "./pages/inventory/stock";
import FormAddStock from "./pages/inventory/stock/add";
import InventoryCategoryPage from "./pages/inventory/categories";
import MasterCustomerPage from "./pages/master/customers";
import CustomerFormPage from "./pages/master/customers/create";
import MasterMechanicPage from "./pages/master/mechanics";
import MasterServicePage from "./pages/master/services";
import MasterSupplierPage from "./pages/master/suppliers";
import InvoiceListPage from "./pages/finance/list";
import FinanceExpensePage from "./pages/finance/expenses";
import RevenuePage from "./pages/reports/revenue";
import ReportMechanic from "./pages/reports/mechanics";
import ReportTopPart from "./pages/reports/top-parts";
import ProfileSettingsPage from "./pages/settings/profile";
import RolesPage from "./pages/settings/roles";
import EmployeesPage from "./pages/hr/employees";
import CreateEmployeePage from "./pages/hr/employees/create";
import EmployeesDetailPage from "./pages/hr/employees/detail";
import EmployeesEditPage from "./pages/hr/employees/edit";
import EditCustomerPage from "./pages/master/customers/edit";
import CustomerDetailPage from "./pages/master/customers/detail";
import ProfilePage from "./pages/my-profile";
import EditProfilePage from "./pages/my-profile/edit";
import WorkOrderDetail from "./pages/service/queue/detail";
import ProductDetail from "./pages/inventory/stock/detail";
import EditProduct from "./pages/inventory/stock/edit";
import PaymentDetailPage from "./pages/finance/detail";

import HomePage from "@/pages/dashboard/index";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<LoginPage />} path="/login" />
      </Route>
      <Route element={<LayoutAdmin />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<CashierPage />} path="/cashier" />
        <Route element={<BookingPage />} path="/booking" />
        <Route element={<ProfilePage />} path="/my-profile" />
        <Route element={<EditProfilePage />} path="/my-profile/edit" />
        <Route path="/service">
          <Route element={<ServiceAddPage />} path="add" />
          <Route element={<QueuePage />} path="queue" />
          <Route element={<WorkOrderDetail />} path="queue/:id" />
          <Route element={<HistoryPage />} path="history" />
        </Route>

        <Route path="/inventory">
          <Route element={<InventoryStockPage />} path="stock" />
          <Route element={<FormAddStock />} path="stock/add" />
          <Route element={<ProductDetail />} path="stock/:id" />
          <Route element={<EditProduct />} path="stock/:id/edit" />
          <Route element={<InventoryCategoryPage />} path="categories" />
        </Route>

        <Route path="/master">
          <Route element={<MasterCustomerPage />} path="customers" />
          <Route element={<CustomerFormPage />} path="customers/create" />
          <Route element={<EditCustomerPage />} path="customers/:id/edit" />
          <Route element={<CustomerDetailPage />} path="customers/:id" />
          <Route element={<MasterMechanicPage />} path="mechanics" />
          <Route element={<MasterServicePage />} path="services" />
          <Route element={<MasterSupplierPage />} path="suppliers" />
        </Route>

        <Route path="/finance">
          <Route element={<InvoiceListPage />} path="list" />
          <Route element={<PaymentDetailPage />} path=":id" />
          <Route element={<FinanceExpensePage />} path="expenses" />
        </Route>

        <Route path="/reports">
          <Route element={<RevenuePage />} path="revenue" />
          <Route element={<ReportMechanic />} path="mechanics" />
          <Route element={<ReportTopPart />} path="top-parts" />
        </Route>

        <Route path="/settings">
          <Route element={<ProfileSettingsPage />} path="profile" />
          <Route element={<RolesPage />} path="roles" />
        </Route>
        <Route path="/hr">
          <Route element={<EmployeesPage />} path="employees" />
          <Route element={<CreateEmployeePage />} path="employees/create" />
          <Route element={<EmployeesDetailPage />} path="employees/:id" />
          <Route element={<EmployeesEditPage />} path="employees/:id/edit" />
          <Route element={<RolesPage />} path="roles" />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
