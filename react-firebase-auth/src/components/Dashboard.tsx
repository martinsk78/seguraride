import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { ref, onValue } from "firebase/database";
import type { User } from "firebase/auth";
import "../styles/Dashboard.css";

interface TripData {
  distancia: number;
  promedio: number;
  velocidad: number;
}

interface TripWithDate extends TripData {
  id: string;
  date: Date;
}

const provinciasArgentina = [
  { nombre: "Buenos Aires", lat: -34.6132, lon: -58.3772 },
  { nombre: "Catamarca", lat: -28.4696, lon: -65.7795 },
  { nombre: "Chaco", lat: -27.4519, lon: -58.9865 },
  { nombre: "Chubut", lat: -43.254, lon: -65.305 },
  { nombre: "Córdoba", lat: -31.4167, lon: -64.1833 },
  { nombre: "Corrientes", lat: -27.4806, lon: -58.8172 },
  { nombre: "Entre Ríos", lat: -31.7446, lon: -60.5238 },
  { nombre: "Formosa", lat: -26.1773, lon: -58.1784 },
  { nombre: "Jujuy", lat: -24.1858, lon: -65.2995 },
  { nombre: "La Pampa", lat: -36.6167, lon: -64.2833 },
  { nombre: "La Rioja", lat: -29.4117, lon: -66.85 },
  { nombre: "Mendoza", lat: -32.8908, lon: -68.8272 },
  { nombre: "Misiones", lat: -27.3667, lon: -55.9 },
  { nombre: "Neuquén", lat: -38.9517, lon: -68.0598 },
  { nombre: "Río Negro", lat: -39.0333, lon: -67.5833 },
  { nombre: "Salta", lat: -24.7829, lon: -65.4232 },
  { nombre: "San Juan", lat: -31.5375, lon: -68.5364 },
  { nombre: "San Luis", lat: -33.3, lon: -66.35 },
  { nombre: "Santa Cruz", lat: -50.3333, lon: -68.0 },
  { nombre: "Santa Fe", lat: -31.6333, lon: -60.7 },
  { nombre: "Santiago del Estero", lat: -27.7833, lon: -64.2667 },
  { nombre: "Tierra del Fuego", lat: -54.8, lon: -68.3 },
  { nombre: "Tucumán", lat: -26.8167, lon: -65.2167 },
];

const BACKEND_URL = "https://seguraride-backend.vercel.app/api";


const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<TripWithDate[]>([]);
  const [aiFeedback, setAiFeedback] = useState("Analizando tus trips...");
  const [climateAdvice, setClimateAdvice] = useState("");
  const [provincia, setProvincia] = useState(provinciasArgentina[0]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const tripsRef = ref(db, `users/${user.uid}/trips`);
    const listener = onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tripsArray: TripWithDate[] = Object.entries(data).map(
          ([tripId, trip]) => {
            const [datePart, timePart] = tripId.split("_");
            const year = parseInt(datePart.substring(0, 4));
            const month = parseInt(datePart.substring(4, 6)) - 1;
            const day = parseInt(datePart.substring(6, 8));
            const hours = parseInt(timePart.substring(0, 2));
            const minutes = parseInt(timePart.substring(2, 4));
            const seconds = parseInt(timePart.substring(4, 6));
            const date = new Date(year, month, day, hours, minutes, seconds);
            return { ...(trip as TripData), id: tripId, date };
          }
        );
        tripsArray.sort((a, b) => b.date.getTime() - a.date.getTime());
        setTrips(tripsArray);
      } else setTrips([]);
    });
    return () => listener();
  }, [user]);

  useEffect(() => {
    if (!user || trips.length === 0) return;

    const fetchAiFeedback = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/trips-feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trips }),
        });
        const data = await res.json();
        const formattedFeedback = data.feedbackTrips
          ? data.feedbackTrips
              .replace(/\* /g, "\n")
              .split("\n\n")
              .map((paragraph: string) => paragraph.trim())
          : ["No hay feedback disponible"];
        setAiFeedback(formattedFeedback.join("\n\n"));
      } catch (err) {
        console.error(err);
        setAiFeedback(String(err));
      }
    };

    fetchAiFeedback();
  }, [user, trips]);

  const handleClimateAdvice = async (provNombre: string, fechaParam: string) => {
    setClimateAdvice("Consultando clima...");
    try {
      const res = await fetch(`${BACKEND_URL}/api/climate-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provinciaNombre: provNombre, date: fechaParam }),
      });
      const data = await res.json();
      setClimateAdvice(data.texto || "No hay consejos climáticos disponibles");
    } catch (err) {
      console.error(err);
      setClimateAdvice("Error al obtener consejo climático");
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sel = provinciasArgentina.find((p) => p.nombre === e.target.value);
    if (sel) setProvincia(sel);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚴 Dashboard Ciclista</h1>
      {user ? (
        <>
          <div className="dashboard-header">
            <p className="dashboard-username">Usuario: {user.email}</p>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
          <div className="dashboard-data">
            <div>
              <h2 className="trips-title">📊 Tus Trips</h2>
              {trips.length > 0 ? (
                <div className="trips-container">
                  {trips.map((trip) => (
                    <div key={trip.id} className="trip-card">
                      <p>
                        <strong>Fecha:</strong> {formatDate(trip.date)}
                      </p>
                      <p>
                        Distancia: <strong>{trip.distancia.toFixed(2)} km</strong>
                      </p>
                      <p>
                        Velocidad: <strong>{trip.velocidad.toFixed(1)} km/h</strong>
                      </p>
                      <p>
                        Promedio: <strong>{trip.promedio.toFixed(1)} km/h</strong>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-trips">No hay trips aún.</p>
              )}
            </div>
            <div>
              <h2 className="ai-feedback-title">🤖 Feedback de IA</h2>
              <div className="ai-feedback-box">
                {aiFeedback.split("\n\n").map((para, idx) => {
                  const parts = para
                    .split(/(\*\*[^*]+\*\*)/g)
                    .map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i}>{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      )
                    );
                  return (
                    <p key={idx} style={{ marginBottom: 10, marginTop: 5 }}>
                      {parts}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          <h2 className="plan-salida-title">🌦️ Planificar salida</h2>
          <div className="plan-salida-controls">
            <select
              className="plan-salida-select"
              value={provincia.nombre}
              onChange={handleProvinciaChange}>
              {provinciasArgentina.map((p) => (
                <option key={p.nombre} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <input
              className="plan-salida-date"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <button
              className="plan-salida-button"
              onClick={() => handleClimateAdvice(provincia.nombre, fecha)}
              disabled={!fecha}>
              Consultar clima
            </button>
          </div>
          <div className="climate-advice-box">
            <strong>Consejo según clima:</strong>
            {climateAdvice.split("\n\n").map((para, idx) => {
              const parts = para.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={i}>{part.slice(2, -2)}</strong>
                ) : (
                  part
                )
              );
              return (
                <p key={idx} style={{ marginTop: 5, marginBottom: 10 }}>
                  {parts}
                </p>
              );
            })}
          </div>
        </>
      ) : (
        <p className="login-prompt">Inicia sesión para ver tu Dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
