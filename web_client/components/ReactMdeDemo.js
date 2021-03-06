import React from 'react';
import {MarkdownEditor} from 'react-markdown-editor';
// import Editor from 'react-md-editor';

const myProps = {
	styleMarkdownTextArea: {
		height : '500px'
	}
}

class ReactMdeDemo extends React.Component{
		constructor(props) {
			super(props);
			const ic = props.initialContent ? props.initialContent  : '# This is a Markdown Editor';
			this.state = {
				intialContent: ic,
			};
		}


		handleOnChange(_content) {
			this.props.handleOnChange(_content);
		}

		render() {
				return (
						// <MarkdownEditor initialContent="Test" iconsSet="font-awesome"/>
						// <MarkdownEditor initialContent="Test" iconsSet="font-awesome" styles = {myProps}/>
						<MarkdownEditor initialContent={this.state.intialContent}
														iconsSet="materialize-ui" 
														onContentChange = {this.handleOnChange.bind(this)}/>
						// <Editor value="# Markdown"/>
				);
		}
}


export default ReactMdeDemo;