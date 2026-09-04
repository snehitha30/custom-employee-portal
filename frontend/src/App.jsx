import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);

      const appsResponse = await fetch(
        "http://localhost:5000/api/apps",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const appsData = await appsResponse.json();
      setApps(appsData.applications || []);
    } catch (err) {
      setError("Cannot connect to backend");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setApps([]);
    setEmail("");
    setPassword("");
  };

  if (user) {
    return (
      <div style={styles.page}>
        <div style={styles.dashboard}>
          <div style={styles.header}>
            <div>
              <h1>Employee Portal</h1>
              <p>Welcome, {user.name}</p>
            </div>

            <button onClick={logout} style={styles.logout}>
              Logout
            </button>
          </div>

          <div style={styles.profile}>
            <strong>Role:</strong> {user.role}
          </div>

          <h2>Authorized Applications</h2>

          <div style={styles.apps}>
            {apps.map((app) => (
              <div key={app.name} style={styles.card}>
                <h3>{app.name}</h3>
                <p>{app.description}</p>

                <a
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.button}
                >
                  Open Application
                </a>
              </div>
            ))}
          </div>

          {apps.length === 0 && (
            <p>No applications are authorized for your role.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.loginBox}>
        <h1>Employee Portal</h1>
        <p>Secure Employee Login</p>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.demo}>
          <strong>Demo Accounts</strong>
          <p>HR: hr@company.com / HR@123</p>
          <p>Sales: sales@company.com / Sales@123</p>
          <p>Admin: admin@company.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  loginBox: {
    background: "white",
    width: "380px",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  dashboard: {
    background: "white",
    width: "900px",
    minHeight: "500px",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
  },

  loginButton: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  logout: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },

  profile: {
    background: "#f1f5f9",
    padding: "15px",
    margin: "25px 0",
    borderRadius: "8px",
  },

  apps: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "220px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },

  button: {
    display: "inline-block",
    padding: "10px 14px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
  },

  error: {
    color: "#dc2626",
    marginTop: "15px",
  },

  demo: {
    marginTop: "25px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "6px",
    fontSize: "13px",
  },
};

export default App;