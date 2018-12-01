import React, { Component } from 'react';
const ReactMarkdown = require('react-markdown');

function updateQuizAnswer(user_answer) {
  const quest_detail = this.props.quest_detail;
  let data = {};
  data[quest_detail.index] = user_answer

  this.setState({
    answer: user_answer
  })
  this.props.callbackQuiz(data);
}

class SingleChoiceQuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer : []
    }
  }

  componentDidMount() {
    console.log(this.props.doQuiz[this.props.quest_detail.index])
  }
  handleOnClick(event, option) {
    updateQuizAnswer.apply(this, [[option]]);
  }

  render() {
    var x = this.props.quest_detail;
    return (
      <div className="row">
        <div className="col-lg-8">
          <ReactMarkdown source={x.content}/>
          <br/>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Choose one option: </p>
          <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons" style={{"width" : "100%"}}>
            {
              x.options.map((option, idx) => 
                <label 
                  key={idx} 
                  className={"btn " + (option == this.props.doQuiz[x.index] ? "active btn-warning" : "btn-info")}
                  onClick={event => this.handleOnClick(event, option)}
                  style={{"margin" : "10px 10px"}}>
                  <input type="radio" name="options" autoComplete="off" disabled={this.props.viewOnly}/> {option}
                </label>
              )
            }              
          </div>  
      </div>
      </div>
    )
  }
}

class MultipleChoiceQuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer : []
    }
  }

  handleOnClick(event, option) {
    let { answer } = this.state;
    const idx = answer.indexOf(option);
    if(idx > -1) {
      answer.splice(idx, 1);
    } else {
      answer.push(option);
    }
    this.setState({
      answer: answer
    });
    updateQuizAnswer.apply(this, [answer]);
  }

  render() {
    var x = this.props.quest_detail;
    return(
      <div className="row">
        <div className="col-lg-8">
          <ReactMarkdown source={x.content}/>
          <br/>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Choose all options that satisfy: </p>
          <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons" style={{"width" : "100%"}}>
            {
              x.options.map((option, idx) => 
                <label 
                  key={idx} 
                  className={"btn " + (this.props.doQuiz[x.index] && this.props.doQuiz[x.index].includes(option) ? "active btn-warning" : "btn-info")}
                  onClick={event => this.handleOnClick(event, option)}
                  style={{"margin" : "10px 10px"}}>
                  <input type="checkbox" name="options" autoComplete="off" disabled={this.props.viewOnly}/> {option}
                </label>
              )
            }              
          </div>  
      </div>
      </div>
    )
  }
}

class MatchingQuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toMatchOptions: [],
      matchedOption: {},
      draggedOption: {},
      answer: []
    }
  }

  componentDidMount() {
    let doQuiz = this.props.doQuiz[this.props.quest_detail.index];
    let toBeMatched = doQuiz ? doQuiz.reduce((map, x, idx) => {
      map[this.props.quest_detail.matchings[idx]] = x;
      return map;
    }, {}) : {};
    this.setState({
      matchedOption: toBeMatched,
      toMatchOptions: this.props.quest_detail.options,
    });
  }

  onDrag = (event, option) => {
    event.preventDefault();
    this.setState({
      draggedOption: option
    });
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  getMatchedAnswer(matchedOption) {
    const answer = this.props.quest_detail.matchings.map((match) => matchedOption[match]);
    return answer;
  }

  onDrop = (event, matching) => {
    const { matchedOption, draggedOption, toMatchOptions } = this.state;
    if(matchedOption[matching]) return;
    let toUpdateMatched = {}
    toUpdateMatched[matching] = draggedOption;
    const toBeMatchedOption = {...matchedOption, ...toUpdateMatched}
    this.setState({
      matchedOption: toBeMatchedOption,
      toMatchOptions: toMatchOptions.filter(option => option !== draggedOption),
      draggedOption: {},
    });
    updateQuizAnswer.apply(this, [this.getMatchedAnswer(toBeMatchedOption)]);
  }

  handleOnClick = (event, matching) => {
    const { matchedOption, toMatchOptions } = this.state;
    if(matchedOption[matching] === undefined)
      return;
    const toBeMatchedOption = Object.keys(matchedOption)
                              .filter(key => key != matching)
                              .reduce((obj, key) => {
                                return {
                                  ...obj,
                                  [key]: matchedOption[key]
                                };
                              }, {});
    this.setState({
      matchedOption: toBeMatchedOption,
      toMatchOptions: [...toMatchOptions, matchedOption[matching]]
    });
    updateQuizAnswer.apply(this, [this.getMatchedAnswer(toBeMatchedOption)]);
  }

  render() {
    var x = this.props.quest_detail;
    const { toMatchOptions, matchedOption } = this.state;
    return (
      <div className="row">
        <div className="col-lg-8">
          <ReactMarkdown source={x.content}/>
          <ul style={{"listStyleType" : "none"}}>
            {
              x.matchings.map((matching, idx) => 
                <div key={idx} style={{"display":"table", "width" : "100%"}}> 
                  <span style={{"display":"table-cell", "verticalAlign": "middle", "width" : "50%"}}> {matching} </span>
                  <span style={{"display":"table-cell", "verticalAlign": "middle", "width" : "50%"}}>
                    <li
                    onDrop={event => this.onDrop(event, matching)}
                    onDragOver={event => this.onDragOver(event)}
                    onClick={event => this.handleOnClick(event, matching)}
                    className="btn btn-outline-info disabled"
                    style={{"display" : "block", "margin" : "10px 10px", "padding" : "15px 15px"}}>
                    {matchedOption[matching]}
                    </li>
                  </span>
                </div>
              )
            }
          </ul>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Match the following options into their right position:</p>
            <ul style={{"listStyleType": "none"}} id="answer-list">
            {
              toMatchOptions.map((option, idx) => 
                <li 
                  key={idx} 
                  draggable={!this.props.viewOnly}
                  onDrag={(event) => this.onDrag(event, option)} 
                  className="btn btn-info" 
                  style={{"display" : "block"}}>
                  {option}
                </li>
              )
            }
            </ul>
        </div>
      </div>
    );
  }
}

class FillingQuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: []
    }
  }

  handleOnChange(event) {
    updateQuizAnswer.apply(this, [[event.target.value]]);
  }

  render() {
    var x = this.props.quest_detail;
    return(
      <div className="row">
        <div className="col-lg-8">
          <ReactMarkdown source={x.content}/>
          <ul style={{"listStypeType" : "none"}}>
            {x.options.map((y, idx) => (<li key={idx}>{y} ?</li>))}
          </ul>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Filling in the ???:</p>
            <input className="form-control" type="text" placeholder="???" 
                    onChange={event => this.handleOnChange(event)} 
                    disabled={this.props.viewOnly}
                    value={this.props.doQuiz[x.index] && this.props.doQuiz[x.index][0] ? this.props.doQuiz[x.index][0] : "" }/>
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
      <div className="quest-box">
        <h2> Quesiton {x.index}</h2>
        <br/>
        {x.type=='si' && <SingleChoiceQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly}/>}
        {x.type=='mu' && <MultipleChoiceQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly}/>}
        {x.type=='ma' && <MatchingQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly}/>}
        {x.type=='fi' && <FillingQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly}/>}
      </div>
    );
  }
}


export default QuestDetail;
