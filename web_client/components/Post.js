import React from 'react';
import ProfileSideBar from './ProfileSideBar';
import get_data from './Utils';
import {CATEGORY_FROM_CODE} from './Constants';

class Post extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	posts: [],
	    	isLoaded: true,
	    	error: null
	    }
	}

	componentDidMount() {
		get_data("/api/posted_quiz/", true)
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
			let post = this.state.posts[i];
			posts.push(
				<div className="userPost" key = {i}>
					<h2 style = {{display: 'inline-block', margin: '0px'}}> {post['title']} </h2>
					<p style = {{float:'right', margin: '0px'}}> {CATEGORY_FROM_CODE[post['category']]} </p>
					
					<div style={{marginTop: "2%"}}>
						<p> {post['brief']} </p>
					</div>
					<hr/>
					<div>
						{/* <div id="head-ava" style={{transform: "scale(0.5)", display: "inline-block"}}>N</div> */}
						<p style={{display: 'inline', fontSize: '15px'}}>by {post.author.user.username}   <i className="fas fa-heart"></i> {post['likes']}</p>
						<p style={{float: 'right', margin: '0px', fontSize: '15px'}}>{post['status']}</p>
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

export default Post;