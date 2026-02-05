import { Route, Routes } from "react-router-dom";

import AuthLayout from "./components/layouts/auth";
import AdminLayout from "./components/layouts/admin";
import HomePage from "./pages/admin";
import Cashier from "./pages/admin/cashier";
import BookingPage from "./pages/admin/booking";
import PendaftaranServis from "./pages/admin/service/add";
import AntreanBengkel from "./pages/admin/service/queue";
import RiwayatServis from "./pages/admin/service/history";
import StokBarang from "./pages/admin/inventory/stock";
import CategoryProduk from "./pages/admin/inventory/categories";
import MasterPelanggan from "./pages/admin/master/customers";
import CustomerFormPage from "./pages/admin/master/customers/create";
import MasterVehicles from "./pages/admin/master/vehicles";
import MasterMekanikPencarian from "./pages/admin/master/mechanics";
import MasterJasaLight from "./pages/admin/master/services";
import SupplierList from "./pages/admin/master/suppliers";
import InvoiceListPage from "./pages/admin/finance/list";
import FinancePage from "./pages/admin/finance/expenses";
import LaporanPendapatan from "./pages/admin/reports/revenue";
import LaporanPerformaMekanik from "./pages/admin/reports/mechanics";
import LaporanBarangTerlaris from "./pages/admin/reports/top-parts";
import WorkshopSettings from "./pages/admin/settings/profile";
import PromoPage from "./pages/admin/settings/promo";
import RolesPage from "./pages/admin/settings/roles";
import WaPage from "./pages/admin/settings/wa";
import EmployeesPage from "./pages/admin/hr/employees";
import CreateEmployeePage from "./pages/admin/hr/employees/create";
import AttendancePage from "./pages/admin/hr/attendance";
import PerformancePage from "./pages/admin/hr/performance";
import FormStock from "./pages/admin/inventory/stock/add";
import Login from "./pages/auth/login";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<Login />} path="/login" />
      </Route>
      <Route element={<AdminLayout />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<Cashier />} path="/cashier" />
        <Route element={<BookingPage />} path="/booking" />
        <Route path="/service">
          <Route element={<PendaftaranServis />} path="add" />
          <Route element={<AntreanBengkel />} path="queue" />
          <Route element={<RiwayatServis />} path="history" />
        </Route>
        <Route path="/inventory">
          <Route element={<StokBarang />} path="stock" />
          <Route element={<FormStock />} path="stock/add" />
          <Route element={<CategoryProduk />} path="categories" />
        </Route>
        <Route path="/master">
          <Route element={<MasterPelanggan />} path="customers" />
          <Route element={<CustomerFormPage />} path="customers/create" />
          <Route element={<MasterVehicles />} path="vehicles" />
          <Route element={<MasterMekanikPencarian />} path="mechanics" />
          <Route element={<MasterJasaLight />} path="services" />
          <Route element={<SupplierList />} path="suppliers" />
        </Route>
        <Route path="/finance">
          <Route element={<InvoiceListPage />} path="list" />
          <Route element={<FinancePage />} path="expenses" />
        </Route>
        <Route path="/reports">
          <Route element={<LaporanPendapatan />} path="revenue" />
          <Route element={<FinancePage />} path="expenses" />
          <Route element={<LaporanPerformaMekanik />} path="mechanics" />
          <Route element={<LaporanBarangTerlaris />} path="top-parts" />
        </Route>
        <Route path="/settings">
          <Route element={<WorkshopSettings />} path="profile" />
          <Route element={<PromoPage />} path="promo" />
          <Route element={<RolesPage />} path="roles" />
          <Route element={<WaPage />} path="wa" />
        </Route>
        <Route path="/hr">
          <Route element={<EmployeesPage />} path="employees" />
          <Route element={<CreateEmployeePage />} path="employees/create" />
          <Route element={<AttendancePage />} path="attendance" />
          <Route element={<PerformancePage />} path="performance" />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
