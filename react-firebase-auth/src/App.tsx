import  { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase/config';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import type {User} from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState<User | null>(null); // 👈 ahora está tipado correctamente

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;