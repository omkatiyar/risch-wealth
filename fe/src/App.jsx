import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import WhoWeServe from './pages/WhoWeServe';
import Solutions from './pages/Solutions';
import Testimonials from './pages/Testimonials';
import Perspective from './pages/Perspective';
import Disclosure from './pages/Disclosure';
import Contact from './pages/Contact';
import EmployeeLogin from './pages/EmployeeLogin';
import ClientLogin from './pages/ClientLogin';
import ClientPortal from './pages/ClientPortal';
import NotFound from './pages/NotFound';
import RiskProfiler from './pages/RiskProfiler/RiskProfiler';
import ScrollToTop from './components/ScrollToTop';
import RouteHead from './components/RouteHead';

// The router itself is supplied by the caller: BrowserRouter in the
// browser (main.jsx), StaticRouter when prerendering (entry-server.jsx).
export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <RouteHead />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/who-we-serve" element={<WhoWeServe />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/risk-profiler" element={<RiskProfiler />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/perspective" element={<Perspective />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/client-portal" element={<ClientPortal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
