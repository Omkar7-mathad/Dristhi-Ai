const aiToggle = document.getElementById("ai");

const fpsSlider = document.getElementById("fps");

const fpsText = document.getElementById("fpsText");

const fpsValue = document.getElementById("fpsValue");

aiToggle.addEventListener("change", toggleAi);

fpsSlider.addEventListener("input", changeFps);

const video = document.getElementById("video");

const c1 = document.getElementById("c1");

const ctx1 = c1.getContext("2d");

/* Variables */

let cameraAvailable = false;

let aiEnabled = false;

let fps = 1000 / 50;

/* Camera Settings */

const constraints = {
    audio: false,
    video: {
        facingMode: "environment"
    }
};

/* Start Camera */

camera();

function camera() {

    navigator.mediaDevices
        .getUserMedia(constraints)

        .then(function (stream) {

            cameraAvailable = true;

            video.srcObject = stream;

            video.play();

        })

        .catch(function (err) {

            cameraAvailable = false;

            console.log(err);

            document.getElementById("loadingText").innerText =
                "Camera Permission Needed";

        });
}

/* Start Loop */

window.onload = function () {

    timerCallback();
};

/* Main Loop */

function timerCallback() {

    if (isReady()) {

        setResolution();

        ctx1.clearRect(0, 0, c1.width, c1.height);

        ctx1.drawImage(
            video,
            0,
            0,
            c1.width,
            c1.height
        );

        if (aiEnabled) {
            ai();
        }
    }

    setTimeout(timerCallback, fps);
}

/* Check Ready */

function isReady() {

    if (
        modelIsLoaded &&
        cameraAvailable &&
        video.readyState === 4
    ) {

        document.getElementById("loadingText").innerText =
            "AI Ready";

        aiToggle.disabled = false;

        return true;
    }

    return false;
}

/* Resolution */

function setResolution() {

    c1.width = video.videoWidth;

    c1.height = video.videoHeight;

    video.width = c1.width;

    video.height = c1.height;
}

/* Toggle AI */

function toggleAi() {

    aiEnabled = aiToggle.checked;
}

/* Change FPS */

function changeFps() {

    const value = fpsSlider.value;

    fps = 1000 / value;

    fpsText.innerText = `${value} FPS`;

    fpsValue.innerText = value;
}

/* AI Detection */

function ai() {

    objectDetector.detect(c1, (err, results) => {

        if (err) {

            console.log(err);

            return;
        }

        for (let index = 0; index < results.length; index++) {

            const element = results[index];

            /* Box */

            ctx1.beginPath();

            ctx1.lineWidth = 3;

            ctx1.strokeStyle = "#38bdf8";

            ctx1.rect(
                element.x,
                element.y,
                element.width,
                element.height
            );

            ctx1.stroke();

            /* Label */

            ctx1.fillStyle = "#38bdf8";

            ctx1.font = "16px Poppins";

            ctx1.fillText(
                `${element.label} ${(element.confidence * 100).toFixed(1)}%`,
                element.x + 10,
                element.y + 24
            );
        }
    });
}