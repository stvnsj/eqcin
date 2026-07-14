import logo from './logo.svg';
import './App.css';
import ClippedDrawer from './components/ClippedDrawer';
import { useEffect } from 'react';


function App() {


  useEffect(() => {
    document.title = 'EQC App';
  }, []);
  return (
    <>
        <div className="App">
        <ClippedDrawer/>
        </div>

    </>
  );
}

export default App;
