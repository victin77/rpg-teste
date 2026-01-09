import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CharacterPage from './pages/CharacterPage.jsx';
import ChroniclePage from './pages/ChroniclePage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/characters/:slug" element={<CharacterPage />} />
      <Route path="/cronicas/:id" element={<ChroniclePage />} />
      <Route path="/inicio" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
