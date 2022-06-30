import { useEffect, useState } from "react";
import { view } from "@transformd-ltd/sandbox-bridge";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import PropTypes from "prop-types";

import NotFound from "./components/NotFound";
import "./App.css";
import API from "./API";
import ApprovalTaskPage from "./pages/ApprovalTaskPage";

// todo - fix history loop!

function App(props) {
  const [history, setHistory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    pat,
    apiUrl
  } = props;

  useEffect(() => {
    API.init(`${apiUrl}/v3/`, pat);
    view.createHistory()
      .then((newHistory) => {
        setHistory(newHistory);
        setIsLoaded(true);
      });
  }, [props]);

  return (
    isLoaded
      ? (
        <HistoryRouter history={history}>
          <Routes>
            <Route index path="/complete-task/:submissionId" element={<ApprovalTaskPage {...props} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HistoryRouter>
      )
      : (
        "Loading..."
      )
  );
}

App.propTypes = {
  pat: PropTypes.string,
  apiUrl: PropTypes.string,
  sdkApiUrl: PropTypes.string,
  subscriptionApiUrl: PropTypes.string,
};
App.defaultProps = {
  pat: null,
  apiUrl: "https://api.transformd.com",
  sdkApiUrl: "https://api.transformd.com/graphql",
  subscriptionApiUrl: "https://api.transformd.com/subscriptions",
};

export default App;
