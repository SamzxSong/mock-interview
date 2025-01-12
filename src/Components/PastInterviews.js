import React from "react";

const formatDateTime = (isoString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(isoString));
};

const PastInterviews = ({ interviews, onDelete, onView }) => {
  return (
    <div>
      {interviews.map((interview) => (
        <div key={interview.id} className="past-interview-item">
          <div className="past-interview-details">
            <h3>{interview.name}</h3>
            <p>{formatDateTime(interview.date)}</p>
            {/* <p>{interview.questions} question(s)</p> */}
          </div>
          <div>
            <button
              className="action-button delete"
              onClick={() => onDelete(interview.id)}
            >
              Delete
            </button>
            <button
              className="action-button view"
              onClick={() => onView(interview.id)}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastInterviews;
