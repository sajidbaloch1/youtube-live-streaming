import GoogleLogin from 'react-google-login';
import './App.css';
import CreateLiveBroadcast from './pages';

function App() {
  const clientId = '180118076243-b4rontnsqgrqk93tvn8s5qcjon0hbd71.apps.googleusercontent.com'; 

  const handleSuccess = (response) => {
    // Handle successful sign-in
    console.log('Google Sign-In successful:', response);
  };

  const handleFailure = (error) => {
    // Handle failed sign-in
    console.error('Google Sign-In failed:', error);
  };
  return (
    <div className="App">
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign in with Google"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
      />
      <CreateLiveBroadcast />
    </div>
  );
}

export default App;
