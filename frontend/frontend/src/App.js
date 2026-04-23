import React, { useEffect, useState } from "react";

function App() {
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState("");

  const [form, setForm] = useState({
    brand_name: "",
    founder_name: "",
    category: "",
    monthly_revenue: "",
    website: ""
  });

  const fetchBrands = async () => {
    let url = "http://localhost:3000/api/brands";
    if (filter) url += `?status=${filter}`;

    const res = await fetch(url);
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, [filter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({
      brand_name: "",
      founder_name: "",
      category: "",
      monthly_revenue: "",
      website: ""
    });

    fetchBrands();
  };

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:3000/api/brands/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    fetchBrands();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Brand Dashboard</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Brand</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" name="brand_name" placeholder="Brand Name" value={form.brand_name} onChange={handleChange} required />
          <input className="border p-2 rounded" name="founder_name" placeholder="Founder Name" value={form.founder_name} onChange={handleChange} required />
          <input className="border p-2 rounded" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input className="border p-2 rounded" type="number" name="monthly_revenue" placeholder="Revenue" value={form.monthly_revenue} onChange={handleChange} />
          <input className="border p-2 rounded col-span-2" name="website" placeholder="Website" value={form.website} onChange={handleChange} />
          <button className="col-span-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Add Brand
          </button>
        </form>
      </div>

      {/* FILTER */}
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div key={b._id} className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-bold">{b.brand_name}</h3>
            <p className="text-sm text-gray-600">{b.founder_name}</p>
            <p className="mt-2">Status: <b>{b.status}</b></p>

            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={() => updateStatus(b._id, "UNDER_REVIEW")} className="bg-yellow-400 px-2 py-1 rounded text-sm">Review</button>
              <button onClick={() => updateStatus(b._id, "SHORTLISTED")} className="bg-purple-400 px-2 py-1 rounded text-sm">Shortlist</button>
              <button onClick={() => updateStatus(b._id, "ACCEPTED")} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Accept</button>
              <button onClick={() => updateStatus(b._id, "REJECTED")} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;