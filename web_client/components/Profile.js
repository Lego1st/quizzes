import React from 'react';
import Ranking from './Ranking';
import GeneralInfo from './GeneralInfo';
import StatsChart from './StatsChart';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      default_avatar: "{% static 'quizzes/default_avatar.jpg' %}",
    }
  }

  render() {

    return (
    <div className="container" id="profile-page">
      <div className="row">
        <div className="col-md-3">
          <img src="#" alt="default avatar" className="img-circle avatar"/>
          <br/>
          <br/>
          <ul className="list-group">
            <li className="list-group-item  list-profile active">Profile</li>
            <li className="list-group-item  list-profile ">My Quizzes</li>
            <li className="list-group-item  list-profile ">Favorite</li>
            <li className="list-group-item  list-profile ">Answered</li>
          </ul>
        </div>
        <div className="col-md-4">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#general-info">General Info</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#ranking">Ranking</a>
                </li>
              </ul>

              <div className="tab-content">
                <div id="general-info" className="container tab-pane active"><br/>
                  <GeneralInfo/>
                </div>
                <div id="ranking" className="container tab-pane fade"><br/>
                  <Ranking/>
                </div>
              </div>

        </div>
        <div className="col-md-5" style={{textAlign: 'center'}}>
          <strong><h4>PROCESS</h4></strong>              
              <div id ='chart'>
              <StatsChart/>
              </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Profile;
