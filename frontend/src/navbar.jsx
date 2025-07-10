import { Link } from 'react-router-dom';
import './styles/index.css'

function Navbar({ stats }) {
	// handle the user logout
	const handleLogout = () => {
		// Clear user data from local storage
		localStorage.removeItem('userId');
		localStorage.removeItem('username');
		localStorage.removeItem('password');
	};
	return (
		<div>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<aside className='nav-container'>
			<div className='nav-header'>
				<img src='/images/muscle-logo.png' alt='logo'></img>
				<h2>FitnessTracker</h2>
			</div>
			<ul className='nav-links'>
				<h4>
					<span>Main Menu</span>
					<div className='menu-separator'></div>
				</h4>
				<li>
				<Link to='/home'><span class="material-symbols-outlined">
					dashboard
					</span>Dashboard</Link>
				</li>
				<li>
				<Link to='/stats'><span class="material-symbols-outlined">
					monitoring
					</span>Stats</Link>
				</li>
				<li>
				<Link to='/notifications'><span class="material-symbols-outlined">
					notifications_active
					</span>Notifications</Link>
				</li>
				<li>
				<Link to='/profile'><span class="material-symbols-outlined">
					account_circle
					</span>Profile</Link>
				</li>
				<li>
				<Link to='/settings'><span class="material-symbols-outlined">
					settings
					</span>Settings</Link>
				</li>
				<li>
				<Link to='/' onClick={handleLogout}><span class="material-symbols-outlined">
					logout
					</span>Logout</Link>
				</li>
			</ul>
				<div className='user-account'>
					<div className='user-profile'>
						<img src={stats.profile_pic}
						alt='profile-img'></img>
						<div className='user-detail'>
							<h3>{stats.fname} {stats.lname}</h3>
							<span>{stats.occupation}</span>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
};

export default Navbar;