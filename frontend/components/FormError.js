const Error = ({ message }) => {
  return message ? (
    <div className="ml-1 mt-2 text-xs text-red-600">{message}</div>
  ) : null;
};

export default Error;
