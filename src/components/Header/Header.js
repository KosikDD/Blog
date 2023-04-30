import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onClickMainPage, IsLogedIn, UserInfo, onLogOut }) {
  let username = '';
  let path = '';
  if (UserInfo !== null) {
    username = UserInfo.profile.username;
    path = UserInfo.profile.image;
  }
  const unAuthorized = (
    <div className="App-header-btns">
      <Link to="/sign-in">
        <button className="LogIn_btn">Sign In</button>
      </Link>
      <Link to="/sign-up">
        <button className="LogUp_btn">Sign Up</button>
      </Link>
    </div>
  );
  const Authorized = (
    <div className="App-header-btns">
      <Link to="/new-article">
        <button className="Create_btn">Create article</button>
      </Link>
      <Link to="/profile" className="Profile-info">
        <span>{username}</span>
        <img src={path}></img>
      </Link>
      <Link to="/">
        <button className="LogOut_btn" onClick={onLogOut}>
          Log Out
        </button>
      </Link>
    </div>
  );
  return (
    <div className="App-header">
      <Link to={'/'} className="App-header-title" onClick={onClickMainPage}>
        {'Realworld Blog'}
      </Link>
      {IsLogedIn ? Authorized : unAuthorized}
    </div>
  );
}

export default Header;
