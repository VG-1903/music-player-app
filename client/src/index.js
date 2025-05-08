// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css'; // You can style your app here
// import App from './App'; // The main App component
// // import reportWebVitals from './reportWebVitals'; // Optional: for performance monitoring

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// reportWebVitals();




import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import path for React 18+
import './index.css';  // You can style your app here
import App from './App'; // The main App component
// import reportWebVitals from './reportWebVitals'; // Optional: for performance monitoring

// Create the root element for React to mount
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you'd like to measure performance, you can use the following:
// reportWebVitals();
