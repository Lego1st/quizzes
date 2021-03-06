import React, { Component } from 'react';
import { EMOTICON } from './Constants';
import * as ReactMarkdown from "react-markdown";
import MathJax from "@matejmazur/react-mathjax";
import * as RemarkMathPlugin from "remark-math";
import MarkdownRender from "./MarkdownRender";

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
    if(this.props.viewOnly) return;
    // console.log(option);
    updateQuizAnswer.apply(this, [[option]]);
  }

  render() {
    var x = this.props.quest_detail;
    return (
      <div className="row">
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-8"}>
          <MarkdownRender source={x.content}/>
          <br/>
        </div>
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-4"}>
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Choose one option: </p>
          <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons" style={{"width" : "100%"}}>
            {
              x.options.map((option, idx) => 
                <label 
                  key={idx} 
                  className={"btn " + (option == this.props.doQuiz[x.index] ? "active btn-info-active" : "btn-info")}
                  onClick={event => this.handleOnClick(event, option)}
                  style={{"margin" : "10px 10px"}}>
                  <input type="radio" name="options" autoComplete="off" disabled={this.props.viewOnly}/> <MarkdownRender source={option}/>
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
    if(this.props.viewOnly) return;
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
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-8"}>
          <MarkdownRender source={x.content}/>
          <br/>
        </div>
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-4"}>
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Choose all options that satisfy: </p>
          <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons" style={{"width" : "100%"}}>
            {
              x.options.map((option, idx) => 
                <label 
                  key={idx} 
                  className={"btn " + (this.props.doQuiz[x.index] && this.props.doQuiz[x.index].includes(option) ? "active btn-info-active" : "btn-info")}
                  onClick={event => this.handleOnClick(event, option)}
                  style={{"margin" : "10px 10px"}}
                  disabled={this.props.viewOnly}>
                  <input type="checkbox" name="options" autoComplete="off" disabled={this.props.viewOnly}/> <MarkdownRender source={option}/>
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
    if(this.props.viewOnly) return;
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
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-8"}>
          <MarkdownRender source={x.content}/>
          <ul style={{"listStyleType" : "none"}}>
            {
              x.matchings.map((matching, idx) => 
                <div key={idx} style={{"display":"table", "width" : "100%"}}> 
                  <span style={{"display":"table-cell", "verticalAlign": "middle", "width" : "50%"}}> <MarkdownRender source={matching}/> </span>
                  <span style={{"display":"table-cell", "verticalAlign": "middle", "width" : "50%"}}>
                    <li
                    onDrop={event => this.onDrop(event, matching)}
                    onDragOver={event => this.onDragOver(event)}
                    onClick={event => this.handleOnClick(event, matching)}
                    className="btn btn-outline-info disabled"
                    style={{"display" : "block", "margin" : "10px 10px", "padding" : "15px 15px"}}>
                    <MarkdownRender source={matchedOption[matching]}/>
                    </li>
                  </span>
                </div>
              )
            }
          </ul>
        </div>
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-4"}>
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
                  <MarkdownRender source={option}/>
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
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-8"}>
          <MarkdownRender source={x.content}/>
          <ul style={{"listStypeType" : "none"}}>
            {x.options.map((y, idx) => (<li key={idx}>{y} ?</li>))}
          </ul>
        </div>
        <div className={this.props.viewOnly && this.props.approvalOnly ? "col-lg-12" : "col-lg-4"}>
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

        <div align="center" style={{fontSize : "20px"}}>
          {
            this.props.viewOnly && (!this.props.approvalOnly)
            && 
            ( 
              <div>
                {
                  x.correct 
                  ? <div> 
                      <img style={{height:"50px"}} src={ EMOTICON['smile']}/> 
                      <div style={{color : "green"}}>Correct</div> 
                    </div>
                  : <div>
                      <img style={{height:"50px"}} src={ EMOTICON['sad']}/>
                      <div style={{color : "red"}}>Incorrect</div>
                    </div>
                }
                <div style={{color : "green"}}>Solution: <MarkdownRender source={x.answer.toString()}/></div>
              </div>
            )
          }
               
        </div>

        {x.type=='si' && <SingleChoiceQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly} approvalOnly={this.props.approvalOnly}/>}
        {x.type=='mu' && <MultipleChoiceQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly} approvalOnly={this.props.approvalOnly}/>}
        {x.type=='ma' && <MatchingQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly} approvalOnly={this.props.approvalOnly}/>}
        {x.type=='fi' && <FillingQuest key={x.index} quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz} viewOnly={this.props.viewOnly} approvalOnly={this.props.approvalOnly}/>}
      </div>
    );
  }
}

export default QuestDetail;