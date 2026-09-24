import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import RiskProfiler from './pages/RiskProfiler/RiskProfiler';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
