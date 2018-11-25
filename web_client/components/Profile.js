import React from 'react';
 import Ranking from './Ranking'; 
import GeneralInfo from './GeneralInfo';
 import StatsChart from './StatsChart'; 
import ProfileSideBar from './ProfileSideBar';
import { Link } from 'react-router-dom';

class Profile extends React.Component {

  render() {

    return (
      <div className="container" id="profile-page">
        <div className="row">
          <ProfileSideBar />
          <div className="col-md-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#general-info">General Info</a>
              </li>

               {/* <li className="nav-item"> 
                  <a className="nav-link" data-toggle="tab" href="#ranking">Ranking</a>
              </li>  */}
            </ul>

            <div className="tab-content">
              <div id="general-info" className="container tab-pane active">
                <GeneralInfo />
              </div>


              {/* <div id="ranking" className="container tab-pane fade">
                <Ranking />
              </div> */}
            </div>

          </div>
           {/* <div className="col-md-5" style={{ textAlign: 'center' }}>
            <strong><h4>PROCESS</h4></strong>
            <div id='chart'>
              <StatsChart />
            </div>
           </div>  */}
        </div>
      </div>
    );
  }
}

export default Profile;
