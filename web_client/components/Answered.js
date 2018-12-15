import React from 'react';
import ProfileSideBar from './ProfileSideBar';
import get_data from './Utils';
import TableView from './TableView';
import {CATEGORY_CODE, STATUS_QUIZ} from './Constants';
import {Link} from 'react-router-dom';

var Config = require('Config');
var page_size = 5;

class Favorite extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        posts: [],
        next: null,
        isLoaded: true,
        error: null
      }
  }

  componentDidMount() {
    get_data(`/api/answered_quiz/?page_size=${page_size}&username=${this.props.match.params.username}`, true)
      .then(res => {
        return res.json();
      })
      .then((result) => {
        this.setState({
          next: result.next,
          posts: result.results || []
        })
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  handleScrollToBottom(completed) {
      // load more
      if(this.state.next == null) {
        completed();
        return;
      }
      get_data(this.state.next.replace(Config.serverUrl, ''), true).then(res => res.json()).then(result=> {
        var newData = Object.assign([], this.state.posts);
        newData.push.apply(newData, result.results);
        console.log("Scroll-load: ", result.results);
        completed();
        this.setState({
          posts: newData,
          next: result.next
        })
      });
  }

  render() {
    const posts = [];
    for (var i = this.state.posts.length - 1; i >= 0; i--) {
      let post = this.state.posts[i];
      console.log(post);
      posts.push(
        <div className="userPost" key={post.id} onClick={() => window.location.replace(Config.serverUrl + "/editquiz/" + post.id + "/")}>
          <h2 style = {{display: 'inline-block', margin: '0px'}}> {post['title']} </h2>
          <p style = {{float:'right', margin: '0px'}}> {CATEGORY_CODE[post['category']]} </p>
          
          <div style={{marginTop: "2%"}}>
            <p> {post['brief']} </p>
          </div>
          <hr/>
          <div>
            {/* <div id="head-ava" style={{transform: "scale(0.5)", display: "inline-block"}}>N</div> */}
            <p style={{display: 'inline', fontSize: '15px'}}>by {post.author}   <i className="fas fa-heart"></i> {post['likes']}</p>
            <p style={{float: 'right', margin: '0px', fontSize: '15px'}}>{STATUS_QUIZ[post['status']]}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="container" id="profile-page">
          <div className="row">
            <ProfileSideBar username={this.props.match.params.username}/>
            <div className="col-md-8">
            <div className="hero-text toTitle">
              <h3>Answered Quizzes</h3>
            </div>
            { (posts.length == 0) ? (
              <div style={{textAlign: 'center'}}>
                {
									(this.props.match.params.username == localStorage.getItem('username')) ? (
										<div>
											<h3>You have not answered any quiz yet ^^</h3>

                      <h4>Go 
                        <Link to="/">
                          <i className="fas fa-home" style={{margin: '1%'}}></i>
                        </Link>
                        to explore more quizzes!
                      </h4>
										</div>
									) : (
										<h3>This user has not answered any quiz yet ^^</h3>
									)
								}
              </div>
              ) : (
                  <TableView 
                        dataSource={this.state.posts}
                        onScrollToBottom={this.handleScrollToBottom.bind(this)}
                      />
                )
            }
            
            </div>
            
          </div>
        </div>
    );
  }
}

export default Favorite;