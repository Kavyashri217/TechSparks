import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import InternForm from './components/InternForm';
import ReportSubmission from './components/ReportSubmission';
import LocationTracker from './components/LocationTracker';
import InternDetails from './components/InternDetails';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';

// Protected Route component
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  
  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? (
          <Component {...props} userRole={currentUser.role} userId={currentUser.id} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/intern-form" component={InternForm} />
            <PrivateRoute path="/submit-report" component={ReportSubmission} />
            <PrivateRoute path="/location" component={LocationTracker} />
            <PrivateRoute path="/intern-details/:internId" component={InternDetails} />
            <Redirect exact from="/" to="/dashboard" />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
