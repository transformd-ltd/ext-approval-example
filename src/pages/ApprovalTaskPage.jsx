import { useEffect, useMemo, useState } from "react";
import Formatic, { Data } from "@transformd-ltd/sdk";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import get from "lodash/get";

import ErrorBoundary from "../components/ErrorBoundary";
import API from "../API";
import axios from "axios";

function ObjectDescriptor({ value }) {
  return (
    <div>
      {Object.keys(value).map(key => {
        return (
          <div>
            <b>{key}</b> : {JSON.stringify(value[key], null, 2)}
          </div>
        )
      })}
    </div>
  )
}

function DatumDescriptor({ config, data }) {
  const type = get(data, 'type');
  const value = get(data, `value`)
  const span = get(config, 'span', 1);
  const isObject = typeof value === 'object';
  const isAbnLookup = type === 'abnLookup';

  if (!data) {
    return null;
  }

  return (
    <div className={`col-span-${span}`}>
      <h5 className="text-gray-400 font-normal">{config.title}</h5>
      <div>
        {!isObject && (<div>{value}</div>)}
        {(isObject && !isAbnLookup) && (<ObjectDescriptor value={value} />)}
        {isAbnLookup && (<div dangerouslySetInnerHTML={{__html: get(data, `value.abn.details`) }}></div>)}
      </div>
    </div>
  )
}

function DetailSection({ submission, section }) {
  const cols = get(section, 'columns', 2);

  return (
    <div className="bg-white rounded-lg mb-4 shadow-sm">
      <div className="px-4 border-b py-2">
        <h4 className="leading-8 font-normal">{section.title}</h4>
      </div>
      <span className="grid-cols-4 grid-cols-2 grid-cols-3 grid-cols-1">
      {/*  Leave this here so tailwind can pick up the classnames*/}
      </span>

      <div className={`p-4 grid grid-cols-${cols} gap-2`}>
        {section.data.map((config, i) => <DatumDescriptor data={get(submission, `values.${config.id}`)} config={config} key={i}/>)}
      </div>
    </div>
  )
}

function SubmissionDetailList({ config, submission }) {
  return (
    <div className="col-span-3">
      {config.submission.map((section, i) => <DetailSection submission={submission} section={section} key={i}/>)}
    </div>
  )
}
function TaskCompletionForm(props) {
  const {
    apiUrl,
    sdkApiUrl,
    subscriptionApiUrl,
    dataHelper,
    submission,
    task,
    env
  } = props;

  const formaticProps = {
    data: dataHelper,
    apiServerUrl: apiUrl,
    serverUrl: sdkApiUrl,
    subscriptionServerUrl: subscriptionApiUrl,
    submissionIdKey: submission.id,
    formId: env.FORM_ID,
    apiKey: env.API_KEY,
    environment: env.BRANCH,
    channel: env.CHANNEL,
  };

  return (
    <div className="col-span-2">
      <div className="border rounded-lg bg-white">
        <div className="px-4 border-b py-2">
          <h4 className="leading-8 font-normal">Approval<span className="text-gray-500">(required)</span></h4>
        </div>

        <div className="p-4">
          <Formatic {...formaticProps} />
        </div>

        <div className="">
          <label htmlFor="" className="block">Outcome</label>
          {get(task, "template.possible_outcomes", []).map((outcome, i) => (
            <div key={i}>
              <input type="checkbox" value={outcome} />{" "}{outcome}
            </div>
          ))}

          <label htmlFor="" className="block">Resolution Message</label>
          <textarea className="form-input" name="resolution_message" id="" rows="3" />
        </div>
      </div>
    </div>
  )
}
TaskCompletionForm.propTypes = {
  env: PropTypes.shape({
    FORM_ID: PropTypes.string,
    API_KEY: PropTypes.string,
    BRANCH: PropTypes.string,
    CHANNEL: PropTypes.string,
  })
}
TaskCompletionForm.defaultProps = {
  env: {
    FORM_ID: null,
    API_KEY: null,
    BRANCH: null,
    CHANNEL: null,
  }
}

function ApprovalTaskScreen(props) {
  const { task, assignment, rootAppUrl, env } = props;

  const [config, setConfig] = useState(null);
  const dataHelper = useMemo(() => new Data(), []);
  const params = useParams();
  const { submissionId } = params;
  const [submission, setSubmission] = useState(null);

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

  useEffect(() => {
    axios
      .get(`${rootAppUrl}/config.json`)
      .then(res => setConfig(res.data));

    API.submissions.retrieve(submissionId)
      .then((res) => setSubmission(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!config || !submission) {
    return (<div>Loading..</div>);
  }


  return (
    <ErrorBoundary>
      <div className="max-w-screen-xl	h-full px-8 mx-auto ">
        <div className="leading-8 py-6">
          <h2>{config.title}</h2>
        </div>

        <div className="grid grid-cols-5 h-full gap-6">
          <SubmissionDetailList
            config={config}
            submission={submission}
          />

          <TaskCompletionForm
            dataHelper={dataHelper}
            submission={submission}
            task={task}
            env={env}
            apiUrl={props.apiUrl}
            sdkApiUrl={props.sdkApiUrl}
            subscriptionApiUrl={props.subscriptionApiUrl}
          />
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
  rootAppUrl: PropTypes.string,
  sdkApiUrl: PropTypes.string,
  subscriptionApiUrl: PropTypes.string,
};
ApprovalTaskScreen.defaultProps = {
  rootAppUrl: '',
}

export default ApprovalTaskScreen;
