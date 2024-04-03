import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);

	sessionUser ? (
		<div className="yes-session-outer-container">
			<div className="yes-session-inner-container">
				<ul className='nav-left' style={{ listStyle: "none" }}>
					<NavLink to='/inv'>Inventory</NavLink>
					<NavLink to='/shop'>Shop</NavLink>
					<NavLink to='/battle'>Battle</NavLink>
				</ul>
				<li className='nav-profile'>
					[Mesos]
					<ProfileButton user={sessionUser} />
				</li>
			</div>
			[Insert container for user info]
		</div>
	) : (
		<>
			<div className="no-session-outer-container">
				<div className="no-session-inner-container">
					<li>
						<OpenModalButton
							buttonText="Log In"
							modalComponent={<LoginFormModal />}
						/>
					</li>
					<li>
						<NavLink to="/signup">Sign Up</NavLink>
					</li>
				</div>
			</div>
		</>
	);

	return (
		<div className='nav-main-outer'>
			<div className='nav-main-inner'>
				<ul className='nav-main-list'>
					<li className='nav-home'>
						{
							sessionUser ?
								<div className='nav-left'>

									<NavLink to="/" className="yes-user-nav">To-Do&apos;s</NavLink>
									<NavLink to='/inv'>Inventory</NavLink>
									<NavLink to='/shop'>Shop</NavLink>
									<NavLink to='/battle'>Battle</NavLink>
								</div>
								:
								<>
									<NavLink to="/" className="no-user-nav">Home</NavLink>
								</>
						}

					</li>
					<li className='nav-avatar'>

					</li>
					{isLoaded && (
						<li className='nav_list' id='nav_profile'>
							<ProfileButton user={sessionUser} />
						</li>)}
				</ul>
			</div>
		</div>
	);
}


export default Navigation;