import React from "react";
// import "./ErrorMessageBox.css";

interface ErrorMessageBoxProps {
  heading: string;
  description: string;
  onClose: () => void;
}

const ErrorMessageBox: React.FC<ErrorMessageBoxProps> = ({
  heading,
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="min-w-40 max-w-96 flex-1 bg-white p-5 rounded shadow-lg text-center">
        <h2 className="mt-0 text-md font-bold">{heading}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <button
          onClick={onClose}
          className="mt-5 px-5 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorMessageBox;
