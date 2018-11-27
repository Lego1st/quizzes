import React, { Component } from 'react';

class SingleChoiceQuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var x = this.props.quest_detail;
    return (
      <div className="row">
        <div className="col-lg-8">
          <p>{x.content}</p>
          <ul style={{"listStypeType" : "none"}}>
            {x.type == 'ma' && x.options.map((y, idx) => (<li key={idx}>{y} ?</li>))}
          </ul>
          <br/>
          <div className="text-center">
            <img src={"/static/quizzes/images/cat.png"} className="rounded-circle avatar align-middle"/>
          </div>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold">And your answer is:</p>
            <ul style={{"listStyleType": "none"}} id="answer-list">
            {x.options.map((y, idx) => (<li key={idx} className="btn btn-info" style={{"display":"block"}}>{y}</li>))}
            </ul>
        </div>
      </div>
    )
  }
}

class MultipleChoiceQuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var x = this.props.quest_detail;
    return(<div></div>)
  }
}

class MatchingQuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var x = this.props.quest_detail;
    return (
      <div className="row">
        <div className="col-lg-8">
          <p>{x.content}</p>
          <ul style={{"listStypeType" : "none"}}>
            {x.options.map((y, idx) => (<li key={idx}>{y} ?</li>))}
          </ul>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold">Match the following options into their right position:</p>
            <ul style={{"listStyleType": "none"}} id="answer-list">
            {x.options.map((y, idx) => (<li key={idx}><input key={idx} className="form-control" placeholder="test"/></li>))}
            </ul>
        </div>
      </div>
    );
  }
}

class FillingQuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var x = this.props.quest_detail;
    return(
      <div className="row">
        <div className="col-lg-8">
          <p>{x.content}</p>
          <ul style={{"listStypeType" : "none"}}>
            {x.options.map((y, idx) => (<li key={idx}>{y} ?</li>))}
          </ul>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold">Match the following options into their right position:</p>
            <ul style={{"listStyleType": "none"}} id="answer-list">
              {<li><input className="form-control" placeholder="???"/></li>}
            </ul>
        </div>
      </div>
    );
  }
}

class QuestDetail extends Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    var x = this.props.quest_detail;
    return (
      <div>
        <h2> Quesiton {x.index}</h2>
        <br/>
        {x.type=='si' && <SingleChoiceQuest quest_detail={x} />}
        {x.type=='mu' && <MultipleChoiceQuest quest_detail={x} />}
        {x.type=='ma' && <MatchingQuest quest_detail={x} />}
        {x.type=='fi' && <FillingQuest quest_detail={x} />}
      </div>
    );
  }
}


export default QuestDetail;
