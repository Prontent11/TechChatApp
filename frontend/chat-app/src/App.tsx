import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Pages/PrivateRoute";
const App = () => {
  return (
    <div className="bg-blue-300 h-screen flex justify-center  items-center">
      <div className="h-[90%]  w-[90%]  sm:p-10 p-5 bg-white  rounded-xl  drop-shadow-2xl ">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
