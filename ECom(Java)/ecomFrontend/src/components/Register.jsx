import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import { BASE_URL } from "../axios";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { refreshData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/user/register`, form);
      localStorage.setItem("token", res.data);
      await refreshData();          // load products now that we have a token
      navigate("/");
    } catch (err) {
      setError(err.response?.status === 401 ? "Invalid username or password" : "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, paddingTop: "6rem" }}>
      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <h4>Register</h4>
        <input className="form-control" placeholder="Username" value={form.username}
               onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="form-control" type="password" placeholder="Password" value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Register</button>
        <Link to="/login">Already have an Account ? Login </Link>
      </form>
    </div>
  );
};
export default Register;