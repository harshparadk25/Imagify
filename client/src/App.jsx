import { Button } from "@/components/ui/button"
import { Route, Routes} from "react-router-dom";
import Home from "./page/Home";
import BuyCredit from "./page/BuyCredit";
import Result from "./page/Result";
import Navbar from "./comp/Navbar";
import Footer from "./comp/Footer";
import Login from "./comp/Login";
import { AppContext } from "./context/AppContext";
import { useContext } from "react";
function App() {
  const {isLoginOpen} = useContext(AppContext);
  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen
    bg-linear-to-b from-teal-50 to-orange-50">
      <Navbar />
      {isLoginOpen && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy-credits" element={<BuyCredit />} />
        <Route path="/result" element={<Result />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;