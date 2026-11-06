import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getLinkStyle = (i, activeId) => {
    if (i === activeId) {
      return {
        color: 'black',
        fontWeight: 'bold',
        margin: '2px',
        padding: '1.0em',
        border: '1px black solid',
        textDecoration: 'none',
        backgroundColor: 'orange'
      };
    } else {
      return {
        color: 'black',
        fontWeight: 'bold',
        margin: '2px',
        padding: '1.0em',
        border: '1px black solid',
        textDecoration: 'none'
      };
    }
  };

  render() {
    return (
      <div>
        <nav style={navStyle}>
          <Link to="/" style={this.getLinkStyle(0, this.props.active)}>HOME</Link>
          <Link to="/advancedJS" style={this.getLinkStyle(1, this.props.active)}>EXTENSTION</Link>
          <Link to="/repairbookingsheet" style={this.getLinkStyle(2, this.props.active)}>REPAIR BOOKING</Link>
          <Link to="/faq" style={this.getLinkStyle(3, this.props.active)}>FQA</Link>
        </nav>
      </div>
    );
  }
}

NavBar.propTypes = {
  active: PropTypes.number
};

const navStyle = {
  minHeight: '5vh',
  backgroundColor: '#CCC',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default NavBar;