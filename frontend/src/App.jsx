import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://job-tracker-sy9u.onrender.com"

const light = {
  app: { minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "30px" },
  card: { maxWidth: "900px", margin: "0 auto 20px auto", backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  header: { textAlign: "center", color: "#1a73e8", fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" },
  subheader: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "16px", color: "#333" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9rem", flex: "1", minWidth: "150px", backgroundColor: "white", color: "#333" },
  select: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9rem", backgroundColor: "white", color: "#333" },
  th: { backgroundColor: "#1a73e8", color: "white", padding: "12px", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #eee", color: "#333" },
  rowHover: "#f8f9fa",
  rowDefault: "white",
}

const dark = {
  app: { minHeight: "100vh", backgroundColor: "#1a1a2e", padding: "30px" },
  card: { maxWidth: "900px", margin: "0 auto 20px auto", backgroundColor: "#16213e", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.4)" },
  header: { textAlign: "center", color: "#4fc3f7", fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" },
  subheader: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "16px", color: "#e0e0e0" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #444", fontSize: "0.9rem", flex: "1", minWidth: "150px", backgroundColor: "#0f3460", color: "white" },
  select: { padding: "10px", borderRadius: "8px", border: "1px solid #444", fontSize: "0.9rem", backgroundColor: "#0f3460", color: "white" },
  th: { backgroundColor: "#0f3460", color: "#4fc3f7", padding: "12px", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #2a2a4a", color: "#e0e0e0" },
  rowHover: "#0f3460",
  rowDefault: "#16213e",
}

const badge = (status) => ({
  padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600",
  backgroundColor: status === "Applied" ? "#fff3cd" : status === "Interview" ? "#cce5ff" : status === "Offer" ? "#d4edda" : "#f8d7da",
  color: status === "Applied" ? "#856404" : status === "Interview" ? "#004085" : status === "Offer" ? "#155724" : "#721c24",
})

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ company: "", role: "", status: "Applied", notes: "" })
  const [adding, setAdding] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const s = darkMode ? dark : light  // switch styles based on mode

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`)
      setJobs(response.data.jobs)
      setLoading(false)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!form.company || !form.role) {
      alert("Company and Role are required!")
      return
    }
    setAdding(true)
    try {
      const today = new Date().toISOString().split("T")[0]
      await axios.post(`${API}/jobs`, { ...form, date_applied: today })
      setForm({ company: "", role: "", status: "Applied", notes: "" })
      fetchJobs()
    } catch (error) {
      console.error("Error adding job:", error)
    }
    setAdding(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return
    try {
      await axios.delete(`${API}/jobs/${id}`)
      fetchJobs()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  return (
    <div style={s.app}>
      {/* Header with dark mode toggle */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px", gap: "20px" }}>
        <h1 style={s.header}>💼 Job Application Tracker</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "600", backgroundColor: darkMode ? "#4fc3f7" : "#333", color: darkMode ? "#333" : "white" }}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Add Job Form */}
      <div style={s.card}>
        <h2 style={s.subheader}>Add New Application</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input style={s.input} placeholder="Company name" value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })} />
          <input style={s.input} placeholder="Role" value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })} />
          <select style={s.select} value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <button onClick={handleAdd} disabled={adding}
            style={{ padding: "10px 20px", backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
            {adding ? "Adding..." : "➕ Add Job"}
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#999" }}>Loading...</p>
      ) : (
        <div style={s.card}>
          <h2 style={s.subheader}>My Applications ({jobs.length})</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={s.th}>Company</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = s.rowHover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = s.rowDefault}>
                  <td style={s.td}>{job.company}</td>
                  <td style={s.td}>{job.role}</td>
                  <td style={s.td}><span style={badge(job.status)}>{job.status}</span></td>
                  <td style={s.td}>{job.date_applied || "N/A"}</td>
                  <td style={s.td}>
                    <button onClick={() => handleDelete(job.id)}
                      style={{ padding: "4px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <p style={{ textAlign: "center", color: "#999", padding: "30px" }}>No jobs added yet!</p>}
        </div>
      )}
    </div>
  )
}

export default App