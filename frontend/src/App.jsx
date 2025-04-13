import { UserProvider } from "./context/user.context";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
}

export default App;
