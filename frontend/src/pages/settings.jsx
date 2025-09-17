import '../styles/index.css'
import DeleteAccountForm from '../deleteAccountForm';
import Navbar from '../navbar';

function Settings() {

  return (
    <div className='centered-page'>
      <Navbar />
      <section className='settings-container'>
        <h1>Settings</h1>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <DeleteAccountForm />
        </div> 
      </section>
    </div>
  );
};

export default Settings;