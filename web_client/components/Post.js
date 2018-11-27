import React from 'react';
import ProfileSideBar from './ProfileSideBar';
import get_data from './Utils';
import {CATEGORY_CODE, STATUS_QUIZ} from './Constants';
import {Link} from 'react-router-dom';

var Config = require('Config');
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
				console.log(result);
				this.setState({
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
		        <ProfileSideBar/>
		        <div className="col-md-8">
		        { (posts.length == 0) ? (
		        	<div>
			        	<h3>You currently do not have any post ^^</h3>

			        	<h4>Click 
				        	<Link to="/addquiz">
		                      <i className="fas fa-plus-circle"></i>
		                    </Link>
		                    to add one!
		                </h4>
	                </div>
		        	) : (
		            posts
		        		)
		        }
		        
		        </div>
		        
		      </div>
		    </div>
		);
	}
}

export default Post;