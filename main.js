const video = document.getElementById("video");

const LEFT = window.innerWidth/2
const RIGHT = window.innerWidth - window.innerWidth/2

let PrintEyeDirection = getEyeDirection

webgazer .setGazeListener((data,timestamp) => {
  if (data.x < LEFT){
    PrintEyeDirection = timestamp
  } else (data.x > RIGHT){
    PrintEyeDirection = timestamp
  }
  console.log(data,timestamp)
}).begin()

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}
function getEyeDirection() 

video.addEventListener("playing", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize); 

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100);
});