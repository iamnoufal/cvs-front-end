// import { initializeApp } from "firebase/app"
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore"; 

// const db = getFirestore();
// const ids = collection(db, "certid");
// const db = collection(db, "cert");

var ids = firebase.firestore().collection("certid");
var db = firebase.firestore().collection("cert");
var sign = firebase.storage().ref("signatures");

if (sessionStorage.cert_id!=undefined) {
  document.getElementById("search").style.display="none";
  document.getElementById("cert").style.display="block";
  setTimeout(()=>{verify()}, 2000);
}

function show_cert(a, b) {
  console.log(a);
  document.getElementById("name").innerHTML = a.name;
  document.getElementById("desc").innerHTML = a.desc;
  document.getElementById("qr").src = "https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=iitmbsc.org/v?cid="+b;
  document.getElementById("cert_type").innerHTML = a.type;
  document.getElementById("o1").innerHTML = a.o1;
  document.getElementById("d1").innerHTML = a.d1;
  document.getElementById("o2").innerHTML = a.o2;
  document.getElementById("d2").innerHTML = a.d2;
  sign.child(a.s1).getDownloadURL().then((url)=>{
    document.getElementById("sign1").src = url;
  })
  sign.child(a.s2).getDownloadURL().then((url) =>  {
    document.getElementById("sign2").src = url;
    document.getElementById("search").style.display="none";
    document.getElementById("cert").style.display="block";
  })
}

function fetch_details(mail, event, cert_id) {
  var event_details;
  db.doc(mail).get().then((resp) => {
    event_details = resp.data().cert[event];
    show_cert(event_details, cert_id);
  })
}

function verify() {
  var cert_id = sessionStorage.cert_id;
  var mail, event, details;
  ids.doc(cert_id).get().then((resp) => {
    mail = resp.data().mail;
    event = resp.data().event;
    document.getElementById("search").innerHTML="Loading...";
    fetch_details(mail, event, cert_id);
  }).catch((err) => {
    alert("Invalid Certificate ID");
  })
}

// -1433678179
// 1473754802
// 925325989