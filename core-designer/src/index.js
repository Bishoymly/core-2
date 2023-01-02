import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DashboardContent, { loader as dashboardLoader } from "./pages/dashboard";
import Home from "./pages/home";
import List from "./pages/list";
import { loader as gridLoader } from "./components/simpleGrid";
import CoreForm, { loader as formLoader } from "./pages/coreForm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={dashboardLoader} element={<DashboardContent />}>
      <Route index element={<Home />} />
      <Route path=":type" loader={gridLoader} element={<List />}></Route>
      <Route
        path=":type/add"
        loader={formLoader}
        element={<CoreForm mode="add"></CoreForm>}
      ></Route>
      <Route
        path=":type/:id"
        loader={formLoader}
        element={<CoreForm mode="edit"></CoreForm>}
      ></Route>
      {/* ... etc. */}
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
