(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    //join room screen
    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username").value;
        if (!username || username.trim().length === 0) return;  //check if the user entered an username
        socket.emit("newuser", username);
        uname = username;
        //switch to the second screen
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    //send message logic
    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;   //read the message
        if(!message || message.trim().length === 0) return;
        renderMesage("my",{
            username:uname,
            text:message
        });
        //send message
        socket.emit("chat",{
            username:uname,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value =""; //empty input
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser",uname);
        window.location.href = window.location.href;    //reload page
    });

    socket.on("update", function(update){
        renderMesage("update",update);
    })

    socket.on("chat", function(message){
        renderMesage("other",message);
    })

    function renderMesage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type=="my"){
            let el = document.createElement("div"); //create a new div element
            el.setAttribute("class","message my-message");  //set the class of the element
            el.innerHTML = `
                        <div>
                            <div class="name">You</div>
                            <div class="text">${message.text}</div>
                        </div>            
            `;
            messageContainer.appendChild(el);
        }else if (type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
                        <div>
                            <div class="name">${message.username}</div>
                            <div class="text">${message.text}</div>
                        </div>            
            `;
            messageContainer.appendChild(el);
        }else if (type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerHTML = message;
            messageContainer.appendChild(el);
        }
        //scroll chat 
         messageContainer.scrollTop =messageContainer.scrollHeight - messageContainer.clientHeight;
       
    }

})();