import React from "react";

function Adder(props) {
	return (
		<div className={'whatever-' + props.index} style={{ display: 'inline', textAlign: 'center' }}>
			<button type="button" className="btn btn-default" style={{ border: 'dashed', backgroundColor: 'white', width: "40%", marginLeft: '5%', marginRight: '5%', marginBottom: '2%' }}
				data-toggle="modal" data-target={"#adder-" + props.index} onClick={props.handleAddQuestion.bind(this, props.index)}>Adding question {props.order}</button>
		</div>
	);
}

export default Adder;