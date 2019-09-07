let firebaseConfig = {
  apiKey: "AIzaSyC95n5erhcyiI163n2Dr_LHIXvFZSJ2NZQ",
  authDomain: "train-scheduler-d4f3d.firebaseapp.com",
  databaseURL: "https://train-scheduler-d4f3d.firebaseio.com",
  projectId: "train-scheduler-d4f3d",
  storageBucket: "train-scheduler-d4f3d.appspot.com",
  messagingSenderId: "255862839376",
  appId: "1:255862839376:web:7cef739d038e895d511955"
};

  firebase.initializeApp(firebaseConfig);
  let database = firebase.database();

let nameTrain = "";
let destinationStation = "";
let trainoClock = "";
let trainFrequency = "";
let Arrival = "";
let awaitFate = "";

let mainTrain = $("#train-name");
let destinysTrain = $("#train-destination");
let presentTrain = $("#train-time");
let ticktockTrain = $("#time-freq");


database.ref("/trains").on("child_added", function(snapshot) {

let trainDiff = 0;
let trainRemainder = 0;
let minutesTillArrival = "";
let nextTrainTime = "";
let frequency = snapshot.val().frequency;
trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");
trainRemainder = trainDiff % frequency;
minutesTillArrival = frequency - trainRemainder;
nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");
 $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    $("tr").hover(
    function() {
    $(this).find("span").show();
    },
    function() {
     $(this).find("span").hide();
    });

    $("#table-data").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref("/trains/");
        console.log(trainRef);
    });
});

let storeInputs = function(event) {
    event.preventDefault();

    nameTrain = mainTrain.val().trim();
    destinationStation = destinysTrain.val().trim();
    trainoClock = moment(presentTrain.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = ticktockTrain.val().trim();

    database.ref("/trains").push({
        name: nameTrain,
        destination: destinationStation,
        time: trainoClock,
        frequency: trainFrequency,
        nextArrival: Arrival,
        minutesAway: awaitFate,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Train added!");
    mainTrain.val("");
    destinysTrain.val("");
    presentTrain.val("");
    ticktockTrain.val("");
};

$("#btn-add").on("click", function(event) {
    if (mainTrain.val().length === 0 || destinysTrain.val().length === 0 || presentTrain.val().length === 0 || ticktockTrain === 0) {
    alert("Required fields not filled out.");
    } else {
    storeInputs(event);
    }
});

$('form').on("keypress", function(event) {
    if (event.which === 13) {
        if (mainTrain.val().length === 0 || destinysTrain.val().length === 0 || presentTrain.val().length === 0 || ticktockTrain === 0) {
            alert("Required fields not filled out.");
        } else {
            storeInputs(event);
        }
    }
});