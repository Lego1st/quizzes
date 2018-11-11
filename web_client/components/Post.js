import React from 'react';
import ProfileSideBar from './ProfileSideBar';

class Post extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	posts: [
	    		{
			    	category: 'Algebra',
			    	title: 'What can colors do to us?',
			    	content: 'Which color has the effect to make people seeing it feel hungry?',
			    	status: 'Approved',
			    	likes: '209',	    		
	    		},
	    		{
			    	category: 'Logical Thinking',
			    	title: 'Which is the truth?',
			    	content: 'Which thing is more dangerous, a swimming pool or a gun?',
			    	status: 'Pending',
			    	likes: '1611',	    		
	    		}
	    	],
	    	isLoaded: true,
	    	error: null
	    }
	}

	// componentDidMount() {
	// 	fetch("http://127.0.0.1:8000/api/profile/posts")
	//       .then(res => res.json())
	//       .then(
	//         (result) => {
 	//        	 	//
	// 			this.setState({
	// 				//
	// 			});
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
				<div className="userPost">
					<h2 style = {{display: 'inline-block', margin: '0px'}}> {post['title']} </h2>
					<p style = {{float:'right', margin: '0px'}}> {post['category']} </p>
					
					<div style={{marginTop: "2%"}}>
						<p> {post['content']} </p>
					</div>
					<hr/>
					<div>
						<div id="head-ava" style={{transform: "scale(0.5)", display: "inline-block"}}>N</div>
						<p style={{display: 'inline', fontSize: '15px'}}>by Someone   <i class="fas fa-heart"></i> {post['likes']}</p>
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