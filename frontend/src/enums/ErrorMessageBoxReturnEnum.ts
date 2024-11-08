interface ErrorMessageBoxReturnEnum {
  isErrorVisible: boolean;
  errorHeading: string;
  description: string;
  showError: (heading: string, description: string) => void;
  hideError: () => void;
}

export default ErrorMessageBoxReturnEnum;
