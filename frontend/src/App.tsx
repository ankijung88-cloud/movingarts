import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import ResearchArchive from './pages/ResearchArchive'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/subscription" element={<Pricing />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/archive" element={<ResearchArchive />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
