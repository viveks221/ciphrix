import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NearbyFriends from "./components/NearbyFriends";
const App = () => {
  const appRouter = createBrowserRouter([
    { path: "/", element: <Login></Login> },
    { path: "/signup", element: <Signup></Signup> },
    { path: "/home", element: <NearbyFriends></NearbyFriends> },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
};

export default App;
