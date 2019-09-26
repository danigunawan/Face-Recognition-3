//Face recognition
//Made by Luxifer

const video = document.getElementById('video')                  //ottiene video tag da face.html

Promise.all([                                                   //importa i moduli dalla cartella modules
    faceapi.nets.tinyFaceDetector.loadFromUri('./weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('./weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./weights')
]).then(startVideo)                                             //solo dopo aver importato i moduli esegue
                                                                //la funzione startVideo()

function startVideo() {                                         //funzione per catturare WebCam
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }

video.addEventListener('play', () => {                          //eventListener per vedere quando la webcam è attiva
                                                                //e comnciare a riconoscere la faccia
    const canvas = faceapi.createCanvasFromMedia(video)       
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)                                                     //la funzione è eseguita ogni 100 millisecondi
  })

// problema con weights/face_expression_model-weights_manifest.js