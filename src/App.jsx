import { view } from "@transformd-ltd/sandbox-bridge";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import PropTypes from "prop-types"
import NotFound from "./components/NotFound";
import "./App.css";
import ApprovalTaskPage from "./pages/ApprovalTaskPage";
import HomePage from "./pages/Homepage";

function App(props) {
  const {history} = props;

  function handleComplete() {
    view.callBridge('reload');
  }

  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route index path="/complete-task/:submissionId" element={<ApprovalTaskPage {...props} onComplete={handleComplete} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HistoryRouter>
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
