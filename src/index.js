import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
  

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

var ReactBsTable  = require('react-bootstrap-table');

class Block extends React.Component{
  
  render(){ 
    return (
      <button className="block" style={{backgroundColor: this.props.color}} onClick={() => this.props.onClick()}>
      {this.props.value}
      </button>
    );
  }
}

class LastSelection extends React.Component {  
  render() {
    return (
      <div>
        <div className="board-row">
        <h3>Chosen block on height {this.props.blockheight}</h3>
        <Block
           value={'Parent Block: <p>'+this.props.hash+'</p>'}
           onClick={() => this.props.onClick()}
          />
        </div>
      </div>
    );
  }
}
class Button extends React.Component{
  render(){ 
    return (
      <div className="btn"  onClick={() => this.props.onClick()}>
      Select Block
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props){
         super(props);

         this.state = {
              selected: 1,
         }
  }
  handleClick(i) {
    this.setState({selected: i})   
  }
  renderBlock(i) {
    const color = (this.state.selected === i) ? "green" : "white";
    return <Block 
      value={'Block: <br>'+this.props.hashes[i].hash}
      color={color}
      onClick={() => this.handleClick(i)}
      />;
  }
  render() {
    this.questionSet = [];
    for( var l in this.props.hashes){
      var someData = this.props.hashes[l]
      let questions = []
      for (var i = 0; i < someData.questionsId.length; i++) {    
         questions.push({ 
              "key": i,
              "questionId" : someData.questionsId[i],
              "question"  : someData.questions[i],
              "answer"     : someData.answers[i],
          });
      }
      this.questionSet.push(questions)
    }
    console.log(this.questionSet)
    var blocks =  this.props.hashes.map((step, move) => {
      return (
        this.renderBlock(move)
      );
    });
    return (
      <div>
        <div className="board-row">
        {blocks}
        </div>
        <div className="node-inf"><h3><center>Blocks answers</center></h3></div>
          <BootstrapTable data={ this.questionSet[this.state.selected] } options={ { noDataText: 'This is custom text for empty data' } } striped={true} hover={true} bordered={ true }>
              <TableHeaderColumn dataField='questionId' isKey={ true } dataAlign="center" dataSort={true} tdStyle={ { whiteSpace: 'normal' } }>QuestionID</TableHeaderColumn>
              <TableHeaderColumn dataField='question' dataAlign="center" dataSort={true} width='450'>Question</TableHeaderColumn>
              <TableHeaderColumn dataField='answer'  dataAlign="center" border='10px'>Answer from Block</TableHeaderColumn>
          </BootstrapTable>
        <div>
          <Button
            onClick={() => this.props.onClick(this.props.hashes[this.state.selected].hash)}
          />
        </div>
      </div>
    );
  }
}

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
      {
        hash: "0xd8f99e9a9a8a7",
      },
      {
        hash: "0xef56e9a9a8a7",
      },
      ],
      blockheight: 2,
    };
    this.data = getData();
    this.maxWindow = 4;
  }
  handleClick(hash) {
    let newhistory = this.state.history.slice();
    newhistory.push({hash: hash,})
    let bh = this.state.blockheight + 1;
    this.setState({
      history: newhistory,
      blockheight: bh,
    });
  }
  jumpTo(step) {
    this.setState({
      history: this.state.history,
      blockheight: step,
    });
  }

  render() {
    
    console.log(this.state)
    const history = this.state.history.slice(0, this.state.blockheight);
    const current = history[this.state.blockheight-1];
    const choices = this.data[this.state.blockheight].filter(obj=> obj.parent_hash === current.hash);
    let status;
    if (this.state.blockheight === this.maxWindow) {
      status = 'No more recent blocks of answers exist';
    } else {
      status = 'Make your answers choices on blockheight: ' + (this.state.blockheight);
    }
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to blockheight #' + move :
        'Go to genesis block';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="Node">
      <div className="header">
      <h1> Reality Token Node </h1>
      <h3>  currently serving block <u>{current.hash}</u> for Dapps</h3>
      </div>
        <div className="node-content">
          <div className="node-parent">
            <LastSelection
              hash = {current.hash}
              blockheight = {this.state.blockheight-1}
              onClick={() => this.jumpTo(this.state.blockheight-1)}/>
          </div>
          <div className="node-info">
            <div><h3>{status}</h3></div>
          </div>
          <div className="node-board">
            <Board
              hashes={choices}
              blockheight = {this.state.blockheight}
              onClick={(hash) => this.handleClick(hash)}
            />
          </div>
        </div>
        <div className="sidebar">
        <h3>Chain:</h3>
        <ol>{moves}</ol>
        </div>
      </div>
     );
  }
}


// ========================================

ReactDOM.render(
  <Node />,
  document.getElementById('root')
);


function getData(){
  return [[{
        hash: "0xd8f99e9a9a8a7",
        parent_hash: "0xd8f99e9a9a8a7",
        questionsId: Array(1).fill(null),
        questions: Array(1).fill(null),
        answers: Array(1).fill(null),
        blockheight: 0,
        xIsSelected: false,}],
        [{
          hash: "0xef56e9a9a8a7",
          parent_hash: "0xd8f99e9a9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Does the UK belongs to EU','Who is the president of USA?','Is crypto in a bubble?'],
          answers: ['Yes','Trump','No'],
          blockheight: 1,
        }],[{
          hash: "0x8898a8df6e9a9",
          parent_hash: "0xef56e9a9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is BTC the right Bitcoin','Who is the president of USA?','Is crypto in a bubble?'],
          answers: ['Yes','Trump','No'],
          blockheight: 2,
        },{
          hash: "0x234faebba9a8a7",
          parent_hash: "0xef56e9a9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is BTC the right Bitcoin','Who is the president of USA?','Is crypto in a bubble?'],
          answers: ['Yes','Trump','Yes'],
          blockheight: 2,
        },{
          hash: "0x34785798abb9c89c",
          parent_hash: "0xef56e9a9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is BTC the right Bitcoin','Who is the president of USA?','Is crypto in a bubble?'],
          answers: ['No','Trump','No'],
          blockheight: 2,
        }],[{
          hash: "0xef23643e9a9a8a7",
          parent_hash: "0x8898a8df6e9a9",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['Yes','25309','6'],
          blockheight: 3,
        },{
          hash: "0xef32452349a9a8a7",
          parent_hash: "0x8898a8df6e9a9",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['Yes','26309','6'],
          blockheight: 3,
        },{
          hash: "0xcbbcbcef56e9a9a8a7",
          parent_hash: "0x8898a8df6e9a9",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['Yes','25309','7'],
          blockheight: 3,
        },{
          hash: "0xef23643e9a9a8a7",
          parent_hash: "0x234faebba9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['No','25309','6'],
          blockheight: 3,
        },{
          hash: "0xef32452349a9a8a7",
          parent_hash: "0x234faebba9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['No','26309','6'],
          blockheight: 3,
        },{
          hash: "0xcbbcbcef56e9a9a8a7",
          parent_hash: "0x234faebba9a8a7",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['Yes','25309','7'],
          blockheight: 3,
        },,{
          hash: "0xef23643e9a9a8a7",
          parent_hash: "0x34785798abb9c89c",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['No','25309','6'],
          blockheight: 3,
        },{
          hash: "0xef32452349a9a8a7",
          parent_hash: "0x34785798abb9c89c",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['No','26309','6'],
          blockheight: 3,
        },{
          hash: "0xcbbcbcef56e9a9a8a7",
          parent_hash: "0x0x34785798abb9c89c",
          questionsId: ['0x8498468','0x548451','0x584894638'],
          questions: ['Is TRON a scam?','What is the DOW 30 today?','What is the earthquake rating for chile?'],
          answers: ['Yes','25309','7'],
          blockheight: 3,
        }]]
}