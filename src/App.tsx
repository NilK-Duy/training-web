import { Navigate, Route, Routes } from "react-router-dom";
import Training from "./components/Training";


function App() {
  return (
    <Routes>
      <Route path="/"  >
        <Route
          index
          element={
            <Training />
          }
        />
        <Route
          path="/training"
          element={
            <Training />
          }
        />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
