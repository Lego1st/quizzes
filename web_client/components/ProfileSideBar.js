import React from 'react';
import { Link } from 'react-router-dom';
// import Profile from './Profile';
import Post from './Post';
import Favorite from './Favorite';
import Answered from './Answered';
import { UPLOAD_AVATAR_API } from './Constants';
import get_data from './Utils';

var Config = require('Config');

class ProfileSideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded_ava: false,
            avatar: "/static/quizzes/images/default_avatar.jpg",

        }
    }
    componentDidMount(){
        get_data("/profile/api/get/?profileid=" + localStorage.getItem('id'), true)
        .then((res) => res.json())
        .then(
            (result) => {
                console.log('general-info', result);
                if (result['avatar']) {
                    this.setState({
                        avatar: '/static/' + result['avatar']					
                    });
                }
            })
    }

    handle_upload(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onload = function() {
            document.getElementById('avatar').src = reader.result;
        };
        reader.readAsDataURL(file);
        this.setState({ loaded_ava: true, avatar: file });
    }
    
    handle_save(e,data) {
        let formData = new FormData();
        formData.append('avatar', data);
        console.log(formData);
        fetch(Config.serverUrl + UPLOAD_AVATAR_API, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                 Accept: 'application/json, text/plain, */*',
            },
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    this.setState({ loaded_ava: false });
                } else {
                    console.log(res);
                }
            });
    }
    render() {

        return (

            <div className="col-md-3">

                <img id='avatar' src={this.state.avatar} alt="default avatar" className="img-circle avatar"/>

                <div className="avatar-upload">
                    <label className="btn-upload">
                        Upload new picture
                        <input type="file" accept="image/jpeg,image/png" onChange={e => this.handle_upload(e)} style={{ display: "none" }} />
                    </label>

                    <div className="upload-state">
                        <button type="button" hidden={!this.state.loaded_ava} onClick={e => {this.handle_save(e,this.state.avatar)}}>
                            Save
                        </button>
                        <button type="button" hidden={!this.state.loaded_ava} onClick={this.handle_cancel}>
                            Cancel
                       </button>
                    </div>
                </div>

                <br />
                <br />
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
            </div >

        );
    }
}

export default ProfileSideBar;