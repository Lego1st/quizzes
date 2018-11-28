import React, { Component } from 'react';

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
          <p>{x.content}</p>
          <br/>
          <div className="text-center">
            <img src={"/static/quizzes/images/cat.png"} className="rounded-circle avatar align-middle"/>
          </div>
        </div>
        <div className="col-lg-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Choose one option: </p>
          <div className="btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons" style={{"width" : "100%"}}>
            {
              x.options.map((option, idx) => 
                <label 
                  key={idx} 
                  className={"btn btn-info " + (option == this.props.doQuiz[x.index] ? "focus active" : "")}
                  onClick={event => this.handleOnClick(event, option)}
                  style={{"margin" : "10px 10px"}}>
                  <input type="radio" name="options" autoComplete="off" /> {option}
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
  }

  render() {
    var x = this.props.quest_detail;
    return(<div></div>)
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
        <div className="col-md-8">
          <p>{x.content}</p>
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
        <div className="col-md-4">
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Match the following options into their right position:</p>
            <ul style={{"listStyleType": "none"}} id="answer-list">
            {
              toMatchOptions.map((option, idx) => 
                <li 
                  key={idx} 
                  draggable
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
      answer: ""
    }
  }

  componentDidMount() {
    var answerVal = this.props.doQuiz[this.props.quest_detail.index];
    answerVal = answerVal ? answerVal : '';
    this.setState ({
      answer: answerVal
    })
  }

  handleOnChange(event) {
    updateQuizAnswer.apply(this, [[event.target.value]]);
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
          <p className="font-weight-bold" style={{"textAlign" : "center"}}>Filling in the ???:</p>
            <input className="form-control" type="text" placeholder="???" onChange={event => this.handleOnChange(event)} value={this.state.answer}/>
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
        {x.type=='si' && <SingleChoiceQuest quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz}/>}
        {x.type=='mu' && <MultipleChoiceQuest quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz}/>}
        {x.type=='ma' && <MatchingQuest quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz}/>}
        {x.type=='fi' && <FillingQuest quest_detail={x} callbackQuiz={this.props.callbackQuiz} doQuiz={this.props.doQuiz}/>}
      </div>
    );
  }
}


export default QuestDetail;
