import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config"; // db = firebase.database()
import { ref, onValue, DataSnapshot } from "firebase/database";
import type { User } from "firebase/auth";

interface OdometerData {
  distancia: number;
  promedio: number;
  velocidad: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [odometro, setOdometro] = useState<OdometerData | null>(null);

  // Escucha autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Escucha Realtime Database
  useEffect(() => {
    if (!user) return;

    const odometroRef = ref(db, `users/${user.uid}/odometro`);

    const listener = onValue(odometroRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        setOdometro(data as OdometerData);
      } else {
        setOdometro(null);
      }
    });

    return () => listener(); // cancelar listener
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <div>
          <p>User: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>

          <h2>Odómetro:</h2>
          {odometro ? (
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
              <p>Distancia: {odometro.distancia.toFixed(3)} km</p>
              <p>Velocidad: {odometro.velocidad.toFixed(1)} km/h</p>
              <p>Promedio: {odometro.promedio.toFixed(1)} km/h</p>
            </div>
          ) : (
            <p>No hay datos de odómetro aún.</p>
          )}
        </div>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
