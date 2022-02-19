function showMsg(type, msg) {
  var renderedMsg = "<h1 class='msg-heading'>"+type+"</h1><p class='msg'>"+msg+"</p><div class='btn-placeholder'><div class='btn' onclick='back()'>OK</div></div>";
  document.querySelector(".mask").style.display="flex";
  document.querySelector(".msg").style.display = "block";
  document.querySelector(".msg").innerHTML = renderedMsg;
}

function back() {
  document.querySelector(".msg").style.display = "none";
  document.querySelector(".mask").style.display="none";
  document.querySelector(".cert").style.display="none";
  document.querySelector(".cert-x").style.display="none";
}