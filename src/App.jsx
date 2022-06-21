import {useEffect, useMemo, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import { view } from "@transformd-ltd/sandbox-bridge";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  Link,
  useParams,
  useSearchParams
} from "react-router-dom";
import Formatic from "@transformd-ltd/sdk";
import ErrorBoundary from "./components/ErrorBoundary";

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

const apiKey = 'b0083d4a1c945b39B82beF1dEf1E560cbC9D40A15919F2902Fbf9fF1f2e2C0e1';
const Abc123Page = () => {

  return (
    <div className="container">
      <h1>abc-123</h1>
      <Link to="/abc-123">this pages!</Link>
      <Link to="/submission-show/123">sub-page</Link>
    </div>
  )
}

const SubmissionShowPage = ({ }) => {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const assignmentId = useMemo(() => searchParams.get('assignment_id'), []);

  return (
    <div className="">
      <h1 className="mb-4">Assignment: { assignmentId }</h1>
      <ErrorBoundary>
        <Formatic
          apiServerUrl={'https://api.transformd.com'}
          serverUrl={'http://localhost:8888/graphql'}
          subscriptionServerUrl={'ws://localhost:8888/subscriptions'}
          formId={2}
          apiKey={apiKey}
          environment="Development"
          submissionIdKey={params.submissionId}
          config="doNotPersistOnPageReload"
          channel="master"
          runReduxDevTools
        />
      </ErrorBoundary>
    </div>
  )
}
const NotFound = () => {
  return (
    <div>404 lol</div>
  )
}

function App() {
  console.log('App');
  const [history, setHistory] = useState(null);

  useEffect(() => {
    view.createHistory().then((newHistory) => setHistory(newHistory));
  }, []);

  return (
    <div className="max-w-screen-lg	 mx-auto py-4">
      {history ? (
        <HistoryRouter history={history}>
          <Routes>
            <Route index path="/" element={<Homepage/>} />
            <Route index path="/home" element={<Homepage/>} />
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
