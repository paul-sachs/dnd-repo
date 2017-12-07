import React, { Component } from 'react';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import logo from './logo.svg';
import './App.css';

const View = ({ text, children, id}) => <div id={id}>
  hello view: {text}
  { children && <div>
    {children}
  </div> }
</div>;

const source = {
  beginDrag(props) {
    return {
      text: props.text
    };
  }
};

const target = {
  canDrop() {
    return true;
  },
  drop(props, monitor, component) {
    const source = monitor.getItem();
    props.onDrop(source);
  }
}

const DraggableView = DragSource('DRAG1', source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(({ ...props, connectDragSource }) => connectDragSource(<div><View {...props}/></div>));

const DroppableView = DropTarget('DRAG1', target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(({ ...props, connectDropTarget }) => connectDropTarget(<div><View {...props}/></div>));

class App extends Component {
  state = {
    texts: []
  }

  onDrop = item => {
    console.log(item);
    this.setState(({ texts }) => ({ texts: [...texts, item] }));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 autp' }}>
            <DraggableView text='yo1' id='drag-source-yo1'/>
            <DraggableView text='yo2' id='drag-source-yo2'/>
            <DraggableView text='yo3' id='drag-source-yo3'/>
          </div>
          <div style={{ flex: '1 1 auto' }} id='drop-target'>
            <DroppableView text='Drop here!' onDrop={this.onDrop}>
              {this.state.texts.map(item => <div>
                Dropped: {item.text}
              </div>)}
            </DroppableView>
          </div>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
