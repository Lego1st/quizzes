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

  render() {

    return (
      <div className="container" id="profile-page">
        <div className="row">
          <ProfileSideBar username={this.props.match.params.username}/>
          <div className="col-md-5">
            { this.props.match.params.username != localStorage.getItem('username') ? '' :
              <button className='btn btn-info btn-profile' id='editbtn' onClick={() => { this.setState({ is_editing: true }) }}> Edit </button>
            }
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#general-info">General Info</a>
              </li>
            </ul>

            <div className="tab-content">
              <div id="general-info" className="container tab-pane active">
                <GeneralInfo username={this.props.match.params.username} is_editing={this.state.is_editing} />
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-5">
            <ul className="nav nav-tabs">

              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#ranking">Ranking</a>
              </li>
            </ul>
            <div className="tab-content">
              <div id="ranking" className="container tab-pane active">
                <Ranking />
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
