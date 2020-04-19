const hostURL = "https://ledger-dev.herokuapp.com/";
// const hostURL = "http://localhost:3000/";
// const hostURL = "http://3.6.126.66:83/";
const loginbtn = document.getElementById("loginbtn");
const modal = document.getElementById("signin-modal");

// When the user clicks on the button, open the modal
loginbtn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//script for animation

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

let signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", signUpUser);

async function signUpUser() {
  event.preventDefault();
  let signUpEle = document.forms.signUpForm.elements;
  let data = JSON.stringify({
    username: signUpEle.name.value,
    email: signUpEle.email.value,
    password: signUpEle.password.value
  });
  try {
    let res = await fetch(hostURL + "api/user/register", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
    let dataJson = await res.json();
    console.log("Success:", JSON.stringify(dataJson));
    console.log("Successful Signup");
    document.forms.signUpForm.reset();
    document.getElementById("signIn").click();
    document.getElementById("signInFormMsg").innerHTML =
      '<p style="color:green" >login with you new credentials</p>';
  } catch (error) {
    console.log("error", error);
  }
}

async function loginUser() {
  event.preventDefault();
  let loginEle = document.forms.signInForm.elements;
  let userEmail = loginEle.email.value;
  let userPass = loginEle.password.value;
  console.log(userEmail);
  if (userEmail == "" && userPass == "") {
    document.getElementById("signInFormMsg").innerText =
      "email and password field cannot be empty";
  } else if (userEmail == "") {
    document.getElementById("signInFormMsg").innerText =
      "email field cannot be empty";
  } else if (userPass == "") {
    document.getElementById("signInFormMsg").innerText =
      "password field cannot be empty";
  } else {
    let data = JSON.stringify({
      email: userEmail,
      password: userPass
    });

    let res = await fetch(hostURL + "api/user/login", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow"
    });
    if (res.status == "404") {
      // document.getElementById('signInFormMsg').innerText = "please register first";
      alert("no user exist with this name , please register first");
      document.getElementById("signUp").click();
    } else if (res.status == "200") {
      window.location.assign(
        hostURL + "pages/projects/index.html"
      );
      document.getElementById('signInFormMsg').innerText = "";
    } else {
      alert(res.text());
    }
    document.forms.signInForm.reset();
  }
}
