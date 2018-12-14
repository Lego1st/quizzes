import React from 'react';

class EquationEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   EqEditor.embed('editor','');

  //   var a=new EqTextArea('equation', 'testbox');
  //   EqEditor.add(a,false);

  //   // a.addExportArea('exportarea1','html');
  //   // a.addExportArea('exportarea3','tw');
  //   // a.addExportArea('exportarea4','url');
  //   // a.addExportArea('exportarea5','url');
  // }

  onmouseout() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  }

  render() {
    return (
      <div className="eq-editor">

        <div id={"editor-" + this.props.index }></div>
        <textarea id="testbox" rows="3" cols="40"></textarea>
        <img id="equation" className="eq-preview" />

        {/*<h3>Selection of Export Areas</h3>
        <p>HTML:</p> 
        <textarea id="exportarea1" rows="3" cols="40"></textarea>

        <p>HTML with hyperlink to edit equation, placed within a DIV layer:</p> 
        <div id="exportarea2"></div>

        <p>Tidly Wiki</p>
        <textarea id="exportarea3" rows="3" cols="40"></textarea>

        <p>Equation URL, placed within an image element:</p>
        <img id="exportarea4"/>

        <p>Equation URL:</p>
        <textarea id="exportarea5" rows="3" cols="40"></textarea>*/}
      </div>
    );
  }
}



export default EquationEditor;