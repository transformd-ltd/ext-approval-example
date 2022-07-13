import { useEffect, useState } from "react";
import { view } from "@transformd-ltd/sandbox-bridge";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import PropTypes from "prop-types";
import { ExclamationIcon, BadgeCheckIcon } from "@heroicons/react/outline";
import NotFound from "./components/NotFound";
import "./App.css";
import API from "./API";
import ApprovalTaskPage from "./pages/ApprovalTaskPage";

function HomePage() {

  return (
     <div className="max-w-2xl mx-auto py-16">
      <div className="bg-blue-100 p-4 rounded-lg flex justify-start gap-4">
        <BadgeCheckIcon className="text-blue-700 w-12"/>
        <div>
          <h3 className="text-blue-700">Approvals App</h3>
          <p className="text-blue-800">Please navigate to this application using a deeplink.</p>
        </div>
      </div>
    </div>
  );
}

function App(props) {
  const [history, setHistory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const {pat, apiUrl} = props;

  useEffect(() => {
    API.init(`${apiUrl}/v3/`, pat);
    view.createHistory()
      .then((newHistory) => {
        setHistory(newHistory);
        setIsLoaded(true);
      });
  }, [props.csrfToken]);


  return (
    isLoaded
      ? (
        <HistoryRouter history={history}>
          <Routes>
            <Route path="*" element={<HomePage />} />
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
