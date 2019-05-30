import React from "react";
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: 0 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countUp = this.countUp.bind(this);
    this.startTimer();
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countUp, 1000);
    }
  }

  countUp() {    
    this.setState(prevState=>{
        return {
            time: this.secondsToTime(prevState.seconds),
            seconds: prevState.seconds+1
          }
    });   
  }

  render() {
    return (
      <div>
        minutes: {this.state.time.m} secondes: {this.state.time.s}
      </div>
    );
  }
}
export default Timer;
