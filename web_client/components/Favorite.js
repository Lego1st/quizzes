import React from 'react';
import ProfileSideBar from './ProfileSideBar';
import get_data from './Utils';
import {CATEGORY_FROM_CODE} from './Constants';
import {Link} from 'react-router-dom';


class Favorite extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        posts: [],
        isLoaded: true,
        error: null
      }
  }

  componentDidMount() {
    get_data("/api/favorite_quiz/", true)
      .then(res => {
        return res.json();
      })
      .then((result) => {
        this.setState({
          posts: result || []
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

  render() {
    const posts = [];
    for (var i = this.state.posts.length - 1; i >= 0; i--) {
      let post = this.state.posts[i].quiz;
      posts.push(
        <div className="userPost" key = {i}>
          <h2 style = {{display: 'inline-block', margin: '0px'}}> {post['title']} </h2>
          <p style = {{float:'right', margin: '0px'}}> {CATEGORY_FROM_CODE[post['category']]} </p>
          
          <div style={{marginTop: "2%"}}>
            <p> {post['brief']} </p>
          </div>
          <hr/>
          <div>
            <Link to={`/profile/${post.author.user.username}`} style={{ textDecoration : 'none'}}>
              <p style={{display: 'inline', fontSize: '15px'}}>by {post.author.user.username}   <i className="fas fa-heart"></i> {post['likes']}</p>
            </Link>

            </div>
        </div>
      );
    }
    return (
      <div className="container" id="profile-page">
          <div className="row">
            <ProfileSideBar username={this.props.match.params.username}/>
            <div className="col-md-8">
                {posts}
            </div>
            
          </div>
        </div>
    );
  }
}

export default Favorite;