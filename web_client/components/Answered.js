import React from 'react';
import {Link} from 'react-router-dom';
import ProfileSideBar from './ProfileSideBar';

class Answered extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        posts: [
          {
            category: 'Algebra',
            title: 'What can colors do to us?',
            content: 'Which color has the effect to make people seeing it feel hungry?',
            'status': 1,
            likes: '209',         
          },
          {
            category: 'Logical Thinking',
            title: 'Which is the truth?',
            content: 'Which thing is more dangerous, a swimming pool or a gun?',
            'status': 0,
            likes: '1611',          
          }
        ],
        isLoaded: true,
        error: null
      }
  }

  // componentDidMount() {
  //  fetch("http://127.0.0.1:8000/api/profile/posts")
  //       .then(res => res.json())
  //       .then(
  //         (result) => {
  //            //
  //      this.setState({
  //        //
  //      });
  //         },
  //         // Note: it's important to handle errors here
  //         // instead of a catch() block so that we don't swallow
  //         // exceptions from actual bugs in components.
  //         (error) => {
  //           this.setState({
  //             isLoaded: true,
  //             error
  //           });
  //         }
  //       )
  // },

  render() {
    const posts = [];
    for (var i = this.state.posts.length - 1; i >= 0; i--) {
      let post = this.state.posts[i];
      posts.push(
        <div className="userPost" key = {i}>
          <h2 style = {{display: 'inline-block', margin: '0px'}}> {post['title']} </h2>
          <p style = {{float:'right', margin: '0px'}}> {post['category']} </p>
          
          <div style={{marginTop: "2%"}}>
            <p> {post['content']} </p>
          </div>
          <hr/>
          <div>
            <div id="head-ava" style={{transform: "scale(0.5)", display: "inline-block"}}>N</div>
            <p style={{display: 'inline', fontSize: '15px'}}>by Someone   <i className="fas fa-heart"></i> {post['likes']}</p>
            {post['status'] == 0 ? (
              <span style={{float: 'right', margin: '0px', fontSize: '15px'}}><i className="fas fa-times-circle"></i></span>
              
              ) : (
              <span style={{float: 'right', margin: '0px', fontSize: '15px'}}><i className="fas fa-check-circle"></i></span>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="container" id="profile-page">
          <div className="row">
            <ProfileSideBar/>
            <div className="col-md-8">
                {posts}
            </div>
            
          </div>
        </div>
    );
  }
}

export default Answered;