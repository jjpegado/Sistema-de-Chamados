import { BrowserRouter } from "react-router-dom"
import RouterApp from "./routes";

import AuthProvider from "./contexts/auth";
import 'react-toastify/dist/ReactToastify.css' ; 
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer autoClose={3000}/>
       <RouterApp/>  
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
