import React from 'react';
import Countdown from "react-countdown";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import './App.css';

class App extends React.Component {
  state = {
    rtcInst: null,
    src: null
  };
  requestUserMedia = () => {
    this.getUserMedia(stream => {
      this.setState({ src: window.URL.createObjectURL(stream) })
    });
  }
  startRecord = () => {
    this.getUserMedia(stream => {
      this.setState({ rtcInst: RecordRTC(stream, { type: "video" }) });
      this.state.rtcInst.startRecording();
    });
  }
  stopRecord = () => {
    this.state.rtcInst.stopRecording(function() {
      // this.state.rtcInst.save();
      const blob = this.getBlob();
      const file = new File([blob], "filename.webm", {
        type: "video/webm"
      });
      console.log("FILE");
      console.log(file);
    });
  }
  getUserMedia = callback => {
    navigator.getUserMedia({
      audio: false,
      video: true
    }, callback, error => alert(JSON.stringify(error)));
  }
  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      // Render a countdown
      return <span className="countdown">{seconds}</span>;
    }
  };
  render() {
    return (
      <div className="App">
        {/* <Webcam /><br /> */}
        <video width="320" height="240" controls>
          <source src="movie.mp4" type="video/mp4"></source>
          <source src="movie.ogg" type="video/ogg"></source>
          Your browser does not support the video tag.
        </video>
        <Countdown
          date={Date.now() + 3000}
          renderer={this.renderer} />
        <br />
        <button onClick={this.startRecord}>START RECORDING</button>
        <button onClick={this.stopRecord}>STOP RECORDING</button>
      </div>
    );
  }
}

export default App;