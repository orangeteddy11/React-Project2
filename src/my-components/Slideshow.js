import React, { Component } from 'react';
import PropTypes from 'prop-types';
import movie0 from './images/movie0.jpg';
import movie1 from './images/movie1.jpg';
import movie2 from './images/movie2.jpg';
import movie3 from './images/movie3.jpg';
import movie4 from './images/movie4.jpg';

export class Slideshow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [movie0, movie1, movie2, movie3, movie4],
      currentIndex: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    if (this.state.currentIndex < this.state.images.length - 1) {
      this.setState(state => ({ currentIndex: state.currentIndex + 1 }));
    } else {
      this.setState({ currentIndex: 0 });
    }
  };

  render() {
    return (
      <div style={slideShoStyle}>
        <img style={{ height: '250px' }} src={this.state.images[this.state.currentIndex]} alt='image'></img>
      </div>
    );
  }
}

Slideshow.propTypes = {
  state: PropTypes.object
};

const slideShoStyle = {
  minHeight: '20vh',
  backgroundColor: 'gray',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default Slideshow;