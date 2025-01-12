import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const RedirectToNewSession = () => {
  const navigate = useNavigate();
  const sessionId = uuidv4();
  navigate(`/create-interview/${sessionId}`);
  return null;
};

export default RedirectToNewSession;
