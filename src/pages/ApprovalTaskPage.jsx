import { useEffect, useMemo, useState } from "react";
import Formatic, { Data } from "@transformd-ltd/sdk";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import get from "lodash/get";

import ErrorBoundary from "../components/ErrorBoundary";
import API from "../API";
import axios from "axios";

function ApprovalTaskScreen(props) {
  const { task, assignment } = props;

  const [config, setConfig] = useState(null);
  const dataHelper = useMemo(() => new Data(), []);
  const params = useParams();
  const { submissionId } = params;
  const [submission, setSubmission] = useState(null);

  console.log({ assignment, task });

  const formaticProps = {
    data: dataHelper,
    apiServerUrl: props.apiUrl,
    serverUrl: props.sdkApiUrl,
    subscriptionServerUrl: props.subscriptionApiUrl,
    formId: props.env.FORM_ID,
    apiKey: props.env.API_KEY,
    environment: props.env.BRANCH,
    submissionIdKey: params.submissionId,
    // config: doNotPersistOnPageReload,
    channel: props.env.CHANNEL,
  };

  function handleFormComplete() {
    console.log("handleFormComplete");
    API.assignments.update(props.assignment.task.id, props.assignment.id, { status: "complete" })
      .then((res) => {
        console.log(res.data);
      });
  }

  useEffect(() => {
    if (dataHelper.store) {
      console.log({ dataHelper });
      dataHelper.getEmitter().on("SessionComplete", handleFormComplete);
    }
  }, [dataHelper]);

  // todo - have some sort of "completion modal" for the entire thing
  // todo - make the submission button show some sort of MODAL that closes the submission

  useEffect(() => {
    axios
      .get('/config.json')
      .then(res => setConfig(res.data))

    API.submissions.retrieve(submissionId)
      .then((res) => setSubmission(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!config) {
    return <div>{JSON.stringify(config, null, 2)}</div>
  }

  return (
    <ErrorBoundary>
      <div className="max-w-screen-xl	h-full px-8 mx-auto ">
        <div className="leading-8 py-6">
          <h2>{config.title}</h2>
        </div>

        <div className="grid grid-cols-5 h-full gap-6">
          <div className="col-span-3">
            {config.submission.map((section, i) => (
              <div className="bg-white rounded-lg mb-4 shadow-sm" key={i}>
                <div className="px-4 border-b py-2">
                  <h4 className="leading-8 font-normal">{section.title}</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {section.data.map((datum, i) => (
                    <div key={i}>
                      <h5 className="text-gray-400 font-normal">{datum.title}</h5>
                      <div>
                        {JSON.stringify(get(submission, `values.${datum.id}.value`), null, 2) || "No Data"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 bg-white">
              <pre>{JSON.stringify(submission, null, 2)}</pre>
            </div>
          </div>

          <div className="col-span-2">
            <div className="border rounded-lg bg-white">
              <div className="px-4 border-b py-2">
                <h4 className="leading-8 font-normal">
                  Approval
                  <span className="text-gray-500">(required)</span>
                </h4>
              </div>

              <div className="p-4">
                <Formatic {...formaticProps} />
              </div>

              <div className="hidden">
                <label htmlFor="" className="block">Outcome</label>
                {get(task, "template.possible_outcomes", []).map((outcome, i) => (
                  <div key={i}>
                    <input type="checkbox" value={outcome} />
                    {" "}
                    {outcome}
                    ;
                  </div>
                ))}

                <label htmlFor="" className="block">Resolution Message</label>
                <textarea className="form-input" name="resolution_message" id="" rows="3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

ApprovalTaskScreen.propTypes = {
  task: PropTypes.object,
  assignment: PropTypes.object,
  env: PropTypes.object,
  apiUrl: PropTypes.string,
  sdkApiUrl: PropTypes.string,
  subscriptionApiUrl: PropTypes.string,
};

export default ApprovalTaskScreen;
