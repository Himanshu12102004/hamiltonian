import ErrorMessageBoxReturnEnum from "../enums/ErrorMessageBoxReturnEnum";
import { useState } from "react";

function useErrorMessage(): ErrorMessageBoxReturnEnum {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorHeading, setErrorHeading] = useState("");
  const [description, setDescription] = useState("");

  const showError = (heading: string, description: string = "") => {
    setErrorHeading(heading);
    setDescription(description);
    setIsErrorVisible(true);
  };

  const hideError = () => {
    setIsErrorVisible(false);
  };

  return {
    isErrorVisible,
    errorHeading,
    description,
    showError,
    hideError,
  };
}

export default useErrorMessage;
