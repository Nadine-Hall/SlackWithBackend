//fixing the original change channel function since it kept throwing errors. Used Gemini to help.

function changeChannel(e) {

//check for active element
  let activeChannel = document.querySelector(".active");
  //only remove class if active channel is found
  if (activeChannel){
    activeChannel.classList.remove("active")
  }
  //add active state to clicked channel
  e.currentTarget.classList.add("active");
  populateMessages(e.currentTarget.getAttribute("data-channel"));
  document.querySelector("#channel-title").innerText =
    e.currentTarget.innerText;
}

//for Message display
async function populateMessages(chat) {
  document.querySelectorAll(".message").forEach((item) => item.remove());
  let template = document.querySelector("template");
  let chatContainer = document.querySelector("#chat-messages");


  try{
    //fetch messages for the current channel
    let response = await fetch(`https://slackclonebackendapi.onrender.com/messages?channelId=${chat}`);
    let messages = await response.json();

    //loop through each message in the returned message array
    for (let message of messages){
      //fetch the sender details
      let userResponse = await fetch(`https://slackclonebackendapi.onrender.com/users?id=${message.senderId}`);
      let userArray = await userResponse.json();

      //check if results exist and make sure to set the sender name and message texts
      let senderName = "Unknown";
      if (userArray.length > 0){
        senderName = userArray[0].name;
      }

      //clone the template element and set the sender name / message text
      let clone = template.content.cloneNode(true);
      clone.querySelector(".sender").innerText = senderName + ":";
      clone.querySelector(".text").innerText = message.content;

      //append the cloned message into the chat container
      chatContainer.appendChild(clone);
    }
  }catch (error){
    console.log(error);
  }
  

}


async function init(){
   
  //fetch channels from API and build channel buttons
  try{
    //fetch channels
    let response = await fetch("https://slackclonebackendapi.onrender.com/channels");
    let channels = await response.json();
    let channelList = document.querySelector(".channel-list");

    //loop through channels and create elements
    channels.forEach((channel, index) => {
      let button = document.createElement("button");
      button.setAttribute("class", "channel");
      button.setAttribute("data-channel", channel.id);
      button.innerText = channel.name

      channelList.appendChild(button);

    });

  }catch (error){
    console.log(error);
  }

    document
      .querySelectorAll(".channel")
      .forEach((item) => item.addEventListener("click", changeChannel));
  
}

init();
