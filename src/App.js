import Individial from './routes/Home/individualPage';
import LgaResult from './routes/Home/lgaResult';
import Addscore from './routes/Home/addscore';
import {
  BrowserRouter as Router,
  Routes,
  Route, useParams
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Addscore" element={<Addscore />} />
        <Route path="/LgaResult" element={<LgaResult />} />
        <Route path="/" element={<Individial />} />
      </Routes>
    </Router>
  );
}

export default App;
