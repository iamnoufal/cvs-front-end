var ids = firebase.firestore().collection("certid");
var db = firebase.firestore().collection("cert");

/*

Assumption of data:

type: JSON
data:
{
  MAIL_ID_1: {
    "name": NAME,
    "event": EVENT_NAME,
    "cert_type": CERTIFICATE_TYPE,
    "desc": DESCRIPTION
  },
  MAIL_ID_2: {
    "name": NAME,
    "event": EVENT_NAME,
    "cert_type": CERTIFICATE_TYPE,
    "desc": DESCRIPTION
  },
  .
  .
  .
}

*/



function update(mail, data, id) {
  ids.doc(String(id)).set({
    mail: mail,
    event: data.event
  }).then(() => {
    db.doc(mail).get().then((doc)=>{
      cert = doc.data().cert
      cert[data.event] = data;
      db.doc(mail).update({
        cert: cert
      })
      console.log(cert);
    })
  })
}

function hashing(mail, data) {
  var a = mail+data.event
  var hash = 0;
  var b;
  if (a.length == 0) {
    update(mail, data, hash);
  }
  for (i in a) {
    b = a.charCodeAt(i);
    hash = ((hash<<5)-hash)+b;
    hash = hash & hash;
  }
  update(mail, data, hash);
}

function start_update(json_data) {
  for (i in json_data) {
    var mail = i;
    var details = json_data[i];
    var data = {
      "name": details.name,
      "event": details.event,
      "type": details.type,
      "desc": details.desc,
      "o1": details.o1,
      "d1": details.d1,
      "s1": details.s1,
      "o2": details.o2,
      "d2": details.d2,
      "s2": details.s2
    }
    hashing(mail, data);
  }
}

var json_data = {
  "21f1005287@student.onlinedegree.iitm.ac.in": {
    "name": "Noufal Rahman", 
    "event": "invictus",
    "desc": "Web Developer and Architect", 
    "type": "MERIT", 
    "o1": "Hariharan", 
    "d1": "President", 
    "s1": "pres1",
    "o2": "Andrew", 
    "d2": "Coordinator",
    "s2": "pres1",
  }, "21f1003826@student.onlinedegree.iitm.ac.in": {
    "name": "Someone", 
    "event": "invictus",
    "desc": "Web Developer and Architect", 
    "type": "MERIT", 
    "o1": "Hariharan", 
    "d1": "President",
    "s1": "pres1", 
    "o2": "Andrew", 
    "d2": "Coordinator",
    "s2": "pres1",
  }, "21f1000157@student.onlinedegree.iitm.ac.in": {
    "name": "Someone", 
    "event": "treehouse",
    "desc": "Web Developer and Architect", 
    "type": "MERIT", 
    "o1": "Hariharan", 
    "d1": "President",
    "s1": "pres1", 
    "o2": "Andrew", 
    "d2": "Coordinator",
    "s2": "pres1"
  }
}