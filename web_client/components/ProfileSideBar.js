import React from 'react';
import {Link} from 'react-router-dom';
// import Profile from './Profile';
import Post from './Post';
import Favorite from './Favorite';
import Answered from './Answered';

class ProfileSideBar extends React.Component {
 
  render() {

    return (
    	
        <div className="col-md-3">
          <img src={"/static/quizzes/images/default_avatar.jpg"} alt="default avatar" className="img-circle avatar"/>
          <br/>
          <br/>
          <ul className="list-group">
            <li className="list-group-item  list-profile ">
	            <Link to="/profile">
	                Profile
				</Link>
            </li>
            <li className="list-group-item  list-profile ">
	            <Link to="/myquizzes">
	                Post
				</Link>
            </li>
            <li className="list-group-item  list-profile ">
	            <Link to="/favorite">
	                Favorite
				</Link>
            </li>
            <li className="list-group-item  list-profile ">
	            <Link to="/answered">
	                Answered
	            </Link>
            </li>
          </ul>
        </div>
        
    );
  }
}

export default ProfileSideBar;