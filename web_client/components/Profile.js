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
  render() {

    return (
      <div className="container" id="profile-page">
        <div className="row">
          <ProfileSideBar username={this.props.match.params.username} />
          <div className="col-md-9">
            {this.props.match.params.username != localStorage.getItem('username') ? '' :
              <button className='btn btn-outline-info btn-profile' id='editbtn' onClick={() => { this.setState({ is_editing: true }) }}> Edit </button>
            }
            <ul className="nav nav-tabs" >
              <li className="nav-item" >
                <a className="nav-link active" style={{ backgroundColor: "#f7f7f7" }} data-toggle="tab" href="#general-info">
                  <strong>General Info</strong>
                </a>
              </li>
            </ul>

            <div >
              <div id="general-info">
                <GeneralInfo username={this.props.match.params.username} is_editing={this.state.is_editing} handle={this.handle_save.bind(this)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-9">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" style={{ backgroundColor: "#f7f7f7" }} data-toggle="tab" href="#ranking">
                  <strong>Ranking</strong>
                </a>
              </li>
            </ul>
            <div >
              <div id="ranking" >
                <Ranking username={this.props.match.params.username} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-9">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" style={{ backgroundColor: "#f7f7f7" }}  data-toggle="tab" href="#progress">
                <strong>Progress</strong></a>
              </li>
            </ul>
            <div >
              <div id="progress" >
                <StatsChart username={this.props.match.params.username} />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-md-5" style={{ textAlign: 'center' }}>
            <strong><h4>PROCESS</h4></strong>
            <div id='chart'>
              <StatsChart />
            </div>
           </div>  */}

      </div >
    );
  }
}

export default Profile;
