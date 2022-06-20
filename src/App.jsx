import {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import { view } from "@transformd-ltd/sandbox-bridge";
import {unstable_HistoryRouter as HistoryRouter, Routes, Route, Link, useParams} from "react-router-dom";

const Homepage = () => {
  function post(evt) {
    // invoke('history.push', { path: 'home' });
  }

  const [count, setCount] = useState(0)


  return (
    <header className="App-header">
      <h1>Home</h1>
      <Link to="/">This page</Link>
      <Link to="/abc-123">Abc-123</Link>
    </header>
  )
}

const Abc123Page = () => {
  return (
    <div>
      <h1>abc-123</h1>
      <Link to="/">home</Link>
      <Link to="/abc-123">this pages!</Link>
      <Link to="/submission-show/123">sub-page</Link>
    </div>
  )
}

const SubmissionShowPage = (props) => {
  const params = useParams();

  return (
    <div>
      <div>ID: { params.submissionId }</div>
      <Link to="/">home</Link>
      <Link to="/abc-123">this pages!</Link>
    </div>
  )
}
const NotFound = () => {
  return (
    <div>404 lol</div>
  )
}

function App() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    view.createHistory().then((newHistory) => setHistory(newHistory));
  }, []);

  return (
    <div className="App">
      {history ? (
        <HistoryRouter history={history}>
          <Routes>
            <Route index path="/" element={<Homepage/>} />
            <Route path="/abc-123" element={<Abc123Page />}/>
            <Route path="/submission-show/:submissionId" element={<SubmissionShowPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HistoryRouter>
      ) : (
        "Loading..."
      )}
    </div>
  )
}

export default App
