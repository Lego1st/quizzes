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
    componentDidMount() {
        console.log(this.props.username);
        get_data("/profile/api/current_avatar/?username="+ this.props.username, true)
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
        reader.onload = function () {
            document.getElementById('avatar').src = reader.result;
        };
        reader.readAsDataURL(file);
        this.setState({ loaded_ava: true, avatar: file });
    }

    handle_save(e, data) {
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

                <img id='avatar' src={this.state.avatar} alt="default avatar" className="img-circle avatar" />
                
                {this.props.username != localStorage.getItem('username') ? '' :
                    <div className="avatar-upload">
                        <br/>
                        <label className="btn btn-outline-primary btn-upload">
                            <i class="fas fa-camera-retro"></i>
                            <strong>  New picture </strong>
                        <input type="file" accept="image/jpeg,image/png" onChange={e => this.handle_upload(e)} style={{ display: "none" }} />
                        </label>

                        <div className="upload-state">
                            <button type="button" className='btn btn-outline-primary' hidden={!this.state.loaded_ava} onClick={e => { this.handle_save(e, this.state.avatar) }}>
                                Save
                        </button>
                            <button type="button" className='btn btn-outline-danger' hidden={!this.state.loaded_ava} onClick={this.handle_cancel}>
                                Cancel
                       </button>
                        </div>
                    </div>
                }

                <br />
                <br />
                <ul className="list-group list-group-flush" style={{textAlign: "center"}}>
                    <li className="list-group-item  list-profile " style={{padding:"2px"}}>
                        <Link to={`/profile/${this.props.username}`} className="nav-link active">
                            Profile
				</Link>
                    </li>
                    <li className="list-group-item  list-profile " style={{padding:"2px"}}>
                        <Link to={`/myquizzes/${this.props.username}`} className="nav-link active">
                            Post
				</Link>
                    </li>
                    <li className="list-group-item  list-profile " style={{padding:"2px"}}>
                        <Link to={`/favorite/${this.props.username}`} className="nav-link active">
                            Favorite
				</Link>
                    </li>
                    <li className="list-group-item  list-profile " style={{padding:"2px"}}>
                        <Link to={`/answered/${this.props.username}`} className="nav-link active">
                            Answered
	            </Link>
                    </li>
                </ul>
            </div>

        );
    }
}

export default ProfileSideBar;