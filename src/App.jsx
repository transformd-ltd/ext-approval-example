import {useEffect, useMemo, useState} from 'react'
import { view } from "@transformd-ltd/sandbox-bridge";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import NotFound from "./components/NotFound";
import './App.css'
import API from "./API";
import ApprovalTaskPage from "./pages/ApprovalTaskPage";

function App(props) {
  const [history, setHistory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    API.init(`${props.apiUrl}/v3/`, props.pat);
    view.createHistory()
      .then((newHistory) => {
        setHistory(newHistory)
        setIsLoaded(true);
      });
  }, [props]);

  return (
    <>
      {isLoaded ? (
        <HistoryRouter history={history}>
          <Routes>
            <Route index path="/complete-task/:submissionId" element={<ApprovalTaskPage {...props} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HistoryRouter>
      ) : (
        "Loading..."
      )}
    </>
  )
}

export default App
