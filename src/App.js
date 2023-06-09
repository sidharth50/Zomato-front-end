import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SearchPage from "./components/SearchPage";
import Restaurant from "./components/Restaurant";
function App() {
  return (
        <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:id/:type" element={<SearchPage />} />
          <Route path="/restaurant/:id/" element={<Restaurant />} />
        </Routes>
        </>
  );
}

export default App;
