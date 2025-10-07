import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "./pages";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Prelogin } from "./pages/preloginpage";
import { Presignup } from "./pages/presignuppage";
import { Syad } from "./pages/syad";
import { Nomarluser } from "./pages/normaluser";
import { Store } from "./pages/store";

export default function App() {
  return (
     <>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/prelogin" element={<Prelogin />} />
          <Route path="/presignup" element={<Presignup />} />
          <Route path="/normaluser" element={<Nomarluser />} />
          <Route path="/syad" element={<Syad />} />
          <Route path="/store" element={<Store />} />
          



        </Routes>
        </BrowserRouter>
     </>
  );
}
