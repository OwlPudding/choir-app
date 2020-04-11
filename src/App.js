import React from 'react';
import Countdown from "react-countdown";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import './App.css';
import sound from "./test/manasirdi.mp3";
// import video from "./test/baltasaule.mp4"

class App extends React.Component {
  state = {
    rtcInst: null,
    src: null,
    res: null,
    file: null
  };
  requestUserMedia = () => {
    this.getUserMedia(stream => {
      this.setState({ src: window.URL.createObjectURL(stream) })
    });
  }
  startRecord = () => {
    this.getUserMedia(stream => {
      this.setState({ rtcInst: RecordRTC(stream, { type: "video" }), res: null });
      this.state.rtcInst.startRecording();
    });
  }
  stopRecord = () => {
    const self = this;

    this.state.rtcInst.stopRecording(function() {
      // this.state.rtcInst.save();
      const blob = this.getBlob();
      const file = new File([blob], "filename.webm", {
        type: "video/webm"
      });
      self.state.rtcInst.save();
      self.setState({ rtcInst: null, res: URL.createObjectURL(file), file: file });
    });
    const audioTag = document.getElementsByClassName("guide-mp3")[0];
    audioTag.pause();
    audioTag.currentTime = 0;
  }
  getUserMedia = callback => {
    navigator.getUserMedia({
      audio: true,
      video: true
    }, callback, error => alert(JSON.stringify(error)));
  }
  renderer = ({ hours, minutes, seconds, completed }) => {
    const audioTag = document.getElementsByClassName("guide-mp3")[0];
    if (completed) {
      // Render a completed state
      audioTag.play();
      return <span className="recording">recording •</span>;
    } else {
      // Render a countdown
      audioTag.pause();
      audioTag.currentTime = 0;
      return <span className="countdown">{seconds}</span>;
    }
  };
  render() {
    return (
      <div className="App">
        <audio className="guide-mp3" src={sound} controls type="audio/mpeg" />
        {/* <video controls="controls" src={video} width="640" height="480">
          Your browser does not support the HTML5 Video element.
        </video> */}
        <br />
        {
          this.state.rtcInst ?
          <Countdown
            date={Date.now() + 3000}
            renderer={this.renderer} />
          : ""
        }
        <br />
        {
          this.state.res ?
          <video width="640" height="480" controls>
            <source src={`${this.state.res}#t=3`} type="video/webm"></source>
            Your browser does not support the video tag.
          </video> : <Webcam />
        }
        <br />
        {
          this.state.rtcInst ?
          <div>
            <button onClick={this.startRecord} disabled>START RECORDING</button>
            <button onClick={this.stopRecord}>STOP RECORDING</button>
          </div> :
          <div>
            <button onClick={this.startRecord}>START RECORDING</button>
            <button onClick={this.stopRecord} disabled>STOP RECORDING</button>
            {/* <br /> */}
            {/* { this.state.file ? <button onClick={this.sendVideo}>FINISHED</button> : "" } */}
          </div>
        }
      </div>
    );
  }
}

export default App;