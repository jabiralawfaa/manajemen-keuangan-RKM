import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Members } from './pages/Members'
import { Payments } from './pages/Payments'
import { Expenses } from './pages/Expenses'
import { Reports } from './pages/Reports'
import { Users } from './pages/Users'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/members" element={<Members />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  )
}

export default App