const hostURL = "https://ledger-dev.herokuapp.com/";
// const hostURL = "http://localhost:3000/";
// const hostURL = "http://3.6.126.66:83/";

async function fetchUserSession() {
  let cookie = document.cookie;
  let res = await fetch(hostURL + "api/user/dashboard", {
    redirect: "follow",
    headers: {
      Cookie: cookie
    }
  });
  let userJson = await res.json();
  console.log(res);
  console.log(userJson);
  return userJson;
}

async function showUserInfo() {
  let sessionObj = await fetchUserSession();
  document.getElementById("user").innerText = sessionObj.username;
  let user = await fetch(hostURL + "api/user/" + sessionObj._id);
  const userJson = await user.json();
  console.log(userJson.data);
  console.log(userJson.data.project);
  try{
    userJson.data.projects.forEach(createProjectCard);
  }catch(error){
    console.error("error is", error.message)
  }
}

async function refreshUserInfo() {
  let sessionObj = await fetchUserSession();
  document.getElementById("live-proj").innerHTML = "";
  let user = await fetch(hostURL + "api/user/" + sessionObj._id);
  const userJson = await user.json();
  try{
    userJson.data.projects.forEach(createProjectCard);
  }catch(error){
    console.error("error is", error.message)
  }
}

showUserInfo();

function createProjectCard(project) {
  let projectPanel = document.getElementById("live-proj");
  let cardBody = document.createElement("div");
  cardBody.classList.add("projCard");
  let projName = document.createElement("p");
  projName.classList.add("card-title");
  projName.innerText = project.name;
  let projDesc = document.createElement("p");
  projDesc.classList.add("card-description");
  projDesc.innerHTML =
    "<span>Start Date</span> " +
    project.startDate +
    "<br/><span>Status </span>" +
    project.status;
  let button = document.createElement("button");
  button.classList.add("cardBtn", "tooltip");
  // console.log(project._id);'
  button.setAttribute("id", project.id);
  button.setAttribute("onclick", "goToProject(this.id)");
  button.innerHTML =
    '<i class="material-icons">double_arrow</i><span class="tooltiptext">Go to your project</span>';
  cardBody.appendChild(projName);
  cardBody.appendChild(projDesc);
  cardBody.appendChild(button);
  projectPanel.appendChild(cardBody);
}

async function logout() {
  fetch(hostURL + "api/user/logout", {
    method: "GET",
    redirect: "follow"
  })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log("error", error));

  window.location.assign(hostURL);
}

async function createNewProj() {
  let projName = document.getElementById("newProjName").value;
  console.log(projName);
  if (projName === "") {
    alert("project name cannot be empty");
    return Promise.reject({message : "empty project name"})
  }
  let user = await fetchUserSession();
  document.getElementById("newProjName").value = "";
  let userId = user._id;
  console.log(userId);
  let body = JSON.stringify({
    userId: userId,
    name: projName
  });
  console.log(body);
  await fetch(hostURL + "api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body,
    redirect: "follow"
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if (result.message === "new project added sucessfully") {
        console.log("adding new project");
        refreshUserInfo();
      }
    })
    .catch(error => console.log("error", error));
}

function goToProject(project_id) {
  console.log(project_id);
  document.cookie = project_id.toString() + ";path=/pages/dashboard";
  console.log(document.cookie);
  window.location.assign(
    hostURL + "pages/dashboard/index.html"
  );
}
