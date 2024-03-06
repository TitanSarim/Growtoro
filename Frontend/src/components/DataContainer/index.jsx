import Empty from './Empty';

const DataContainer = ({ loading, error, data, errorImg, errorMessage, errorLink, children }) =>
  loading ? (
    <div>Loading..</div>
  ) : error ? (
    <div>Something went wrong!</div>
  ) : (Array.isArray(data) ? data.length > 0 : data) ? (
    children
  ) : (
    <Empty img={errorImg} message={errorMessage} action={errorLink} />
  );

export default DataContainer;
