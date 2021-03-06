import React from 'react';
import Ranking from './Ranking';
import GeneralInfo from './GeneralInfo';
import StatsChart from './StatsChart';
import ProfileSideBar from './ProfileSideBar';
import { Link } from 'react-router-dom';
import get_data from './Utils';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { is_editing: false }
  }
  handle_save() {
    this.setState({ is_editing: false });
  }

  toggle_editting() {
    this.setState({ is_editing: true });
  }
  
  render() {

    return (
      <div className="container" id="profile-page">
        <div className="row">
          <ProfileSideBar username={this.props.match.params.username} />
          <div className="col-md-9">

            <div className='title' style={{marginBottom: "5%"}}>
              <h4 style={{ display: 'inline-block' }}> About me </h4>
              {this.props.match.params.username != localStorage.getItem('username') ? '' :
                // <button className='btn btn-outline-info btn-profile' > Edit </button>
                <i className="fas fa-edit edit-profile-btn" style={{ display: 'inline', marginLeft: '1%', marginTop: '-1%', cursor: 'pointer' }} onClick={this.toggle_editting.bind(this)}></i>
              }
            </div>

            <GeneralInfo username={this.props.match.params.username} is_editing={this.state.is_editing} handle={this.handle_save.bind(this)} />
            <div style={{marginTop: "10%"}} className='title'>

              <h4 style={{ display: 'inline-block' }}> Progress </h4>
              <i className="fas fa-chart-line" style={{ display: 'inline', marginLeft: '1%', marginTop: '-1%' }}></i>

            </div>
            <StatsChart username={this.props.match.params.username} />

          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
