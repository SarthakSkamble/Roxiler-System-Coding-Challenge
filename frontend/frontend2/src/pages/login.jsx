import { useSearchParams } from "react-router-dom";
import { Mainlogin } from "../components/mainlogin";

export function Login() {
  const [us] = useSearchParams();
  const usertype = us.get("name");

  // Convert underscores to spaces for display
  const displayType = usertype?.replace("_", " ");

  return (
    <>
      {displayType && <Mainlogin usertype={displayType} />}
    </>
  );
}
