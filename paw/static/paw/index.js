document.addEventListener('DOMContentLoaded', function () {

  let currentDate = getCurrentDate();
  loadCalendar(currentDate, 1)

  if (document.getElementById("calendar") != null) {
    let myPage = document.getElementById("calendar")
    myPage.onclick = event => {
      document.querySelector("h1").innerHTML = "Calendar";
      document.querySelector("h1").style.display = "block";
      if (document.querySelector(".message") != null) {
        document.querySelector(".message").remove();
      }
      loadCalendar(currentDate, 1)
    }
  }

  if (document.getElementById("search") != null) {
    let myPage = document.getElementById("search")
    myPage.onclick = async event => {
      document.querySelector("h1").innerHTML = "Search";
      document.querySelector("h1").style.display = "block"
      if (document.querySelector(".message") != null) {
        document.querySelector(".message").remove();
      }
      if (document.querySelector("#calendar-container") != null) {
        document.querySelector("#calendar-container").style.display = "none"
      }
      if (document.querySelector("#appointments_list") != null) {
        document.querySelector("#appointments_list").replaceChildren()
      }
      searchApp()
    }
  }

  if (document.getElementById('login') != null) {
    let loginButton = document.getElementById('login')
    loginButton.onclick = async event => {
      document.querySelector("#appointments_list").innerHTML = await fetchHtmlAsText("login")
      document.querySelector("h1").style.display = "none"
      document.querySelector(".pagination").style.display = "none"
      if (document.querySelector(".message") != null) {
        document.querySelector(".message").remove();
      }
      if (document.querySelector("#calendar-container") != null) {
        document.querySelector("#calendar-container").style.display = "none"
      }
    }
  }

  if (document.getElementById('register') != null) {
    let registerButton = document.getElementById('register')
    registerButton.onclick = async event => {
      document.querySelector("#appointments_list").innerHTML = await fetchHtmlAsText("register")
      document.querySelector("h1").style.display = "none"
      document.querySelector(".pagination").style.display = "none"
      if (document.querySelector(".message") != null) {
        document.querySelector(".message").remove();
      }
      if (document.querySelector("#calendar-container") != null) {
        document.querySelector("#calendar-container").style.display = "none"
      }
    }
  }

  if (document.getElementById('register-vet') != null) {
    let registerVetButton = document.getElementById('register-vet')
    registerVetButton.onclick = async event => {
      if (document.querySelector(".message") != null) {
        document.querySelector(".message").remove();
      }
      let appointmentsListElement = document.querySelector("#appointments_list")
      if (document.querySelector(".content-container") != null) {
        document.querySelector(".content-container").remove();
      }
      appointmentsListElement.style = "filter: none";
      loadRegisterVet()
    }
  }
});

function getCurrentDate() {
  const date = new Date();
  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  let currentYear = date.getFullYear();
  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
  return currentDate;
}

async function fetchHtmlAsText(url) {
  const response = await fetch(url);
  return await response.text();
}

async function loadRegisterVet() {
  document.querySelector("#new_app").style.display = "none"
  document.querySelector("#appointments_list").innerHTML = await fetchHtmlAsText("vet_register")
  document.querySelector("#appointments_list").style.display = "flex"
  document.querySelector("h1").style.display = "none"
  document.querySelector(".pagination").style.display = "none"
  if (document.querySelector("#calendar-container") != null) {
    document.querySelector("#calendar-container").style.display = "none"
  }
}

async function loadCalendar(someDate, page) {
  if (!page) {
    page = 1
  }
  return fetch("api/appointments/" + someDate + "?page=" + page)
    .then(response => response.json())
    .then(e => {
      getSchedule(e)
    })
    .then(() => {
      let year = someDate.substring(0, 4);
      let month = someDate.substring(5, 7);
      createCalendar(year, month);
    })
    .then(() => {
      let selectedDay = parseInt(someDate.substring(8, 10), 10);
      if (document.getElementById(`day ${selectedDay}`) != undefined) {
        document.getElementById(`day ${selectedDay}`).style = 'color: white; background-color: #2d5f95; border: #000000; border-radius: 50%;'
      }
    })
}

function getSchedule(response) {
  let formCont = document.querySelector(".content-container")
  if (formCont != null) {
    formCont.remove()
  }
  document.querySelector("#calendar-container").style = 'filter: none; pointer-events:auto;'
  document.querySelector("#appointments_list").style = 'filter: none; pointer-events:auto;'
  document.querySelector(".pagination").style = 'filter: none; pointer-events:auto;'
  document.querySelector('h1').style = 'filter: none; pointer-events:auto;'
  document.querySelector('#menuItems').style = 'filter: none; pointer-events:auto;'
  document.getElementById("new_app").style.display = "none"
  document.querySelector("#appointments_list").style.display = 'flex'
  document.querySelector(".pagination").style.display = 'block'
  let appointmentsListElement = document.querySelector("#appointments_list")
  if (appointmentsListElement != null) {
    appointmentsListElement.replaceChildren()
  }

  const appointmentDivCont = document.createElement("div");
  appointmentDivCont.id = 'app_div_cont'

  const today = response.current_date
  const appointmentsDate = document.createElement("div");
  appointmentsDate.id = `appointments-date-container`;
  appointmentsDate.innerHTML = `${today}`
  appointmentsListElement.appendChild(appointmentsDate);

  if (response.is_authenticated) {
    const newAppButton = document.createElement("button");
    newAppButton.id = `new-appointment-button`;
    newAppButton.innerHTML = `Set new appointment`
    appointmentsListElement.appendChild(newAppButton);
    newAppButton.onclick = event => {
      newApp(response.current_date)
    };
  }

  response.appointments.forEach(appointment => {
    const appointmentSlot = document.createElement("div");
    appointmentSlot.className = `appointment-slot`;
    appointmentSlot.id = `Container ${appointment.id}`;
    appointmentDivCont.appendChild(appointmentSlot);

    const scheduled_vet = document.createElement("div");
    scheduled_vet.className = "scheduled_details";
    scheduled_vet.id = `scheduled_vet${appointment.id}`;
    scheduled_vet.innerHTML = `Vet: ${appointment.vet}`;
    appointmentSlot.appendChild(scheduled_vet);

    const scheduled_client = document.createElement("div");
    scheduled_client.className = "scheduled_details";
    scheduled_client.id = `scheduled_client${appointment.id}`;
    scheduled_client.innerHTML = `Client: ${appointment.client}`;
    appointmentSlot.appendChild(scheduled_client);

    const scheduled_pet = document.createElement("div");
    scheduled_pet.className = "scheduled_details";
    scheduled_pet.id = `scheduled_pet${appointment.id}`;
    scheduled_pet.innerHTML = `Pet: ${appointment.pet}`;
    appointmentSlot.appendChild(scheduled_pet);

    const scheduled_timeslot = document.createElement("div");
    scheduled_timeslot.className = "scheduled_timeslot";
    scheduled_timeslot.id = `appointments-container${appointment.id}`;
    scheduled_timeslot.innerHTML = `${appointment.timeslot}`;
    appointmentSlot.appendChild(scheduled_timeslot);

    if (appointment.notes != null) {
      const notes = document.createElement("div");
      notes.className = "scheduled_details";
      notes.id = `appointments-container${appointment.id}`;
      notes.innerHTML = `${appointment.notes}`;
      appointmentSlot.appendChild(notes);
    }

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons-container";
    appointmentSlot.appendChild(buttonsDiv);

    if (response.is_authenticated && (response.current_user == appointment.created_by || response.is_superuser)) {
      const appEdit = document.createElement("button");
      appEdit.className = "edit-button"
      appEdit.id = `edit-button${appointment.id}`
      appEdit.innerHTML = `Edit`
      buttonsDiv.appendChild(appEdit)
      appEdit.onclick = event => {
        editApp(appointment.id)
      };
      const appDelete = document.createElement("button");
      appDelete.className = "delete-button"
      appDelete.id = `delete-button${appointment.id}`
      appDelete.innerHTML = `Delete`
      buttonsDiv.appendChild(appDelete)
      appDelete.onclick = event => {
        let delDay = appointment.appointment_date.substring(3, 5);
        let delMonth = appointment.appointment_date.substring(0, 2);
        let delYear = appointment.appointment_date.substring(6, 10);
        let dateDel = `${delYear}-${delMonth}-${delDay}`;
        deleteAppointment(appointment.id, dateDel)
      };
    }
  })

  appointmentsListElement.appendChild(appointmentDivCont);

  let currentPage = parseInt(response.page)
  let hasPrevious = (currentPage > 1)
  let totalPages = response.total
  let nextPage = currentPage + 1
  let thisDay = response.current_date

  paginationProcess(hasPrevious, currentPage, nextPage, totalPages, thisDay)
}

function createCalendar(year, month) {
  const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthsNames[parseInt(month) - 1]
  let prevMonthName = ''
  if (month > 1) {
    prevMonthName = monthsNames[parseInt(month) - 2]
  } else {
    prevMonthName = monthsNames.slice(-1)
  }
  let nextMonthName = ''
  if (month < 12) {
    nextMonthName = monthsNames[parseInt(month)]
  } else {
    nextMonthName = monthsNames[0]
  }

  const yearNav = document.createElement("div");
  yearNav.id = `year-nav`;
  const viewedYear = document.createElement("div");
  viewedYear.id = `viewed-year`;
  viewedYear.innerHTML = `${year}`
  const prevYear = document.createElement("div");
  prevYear.id = `prev-year`;
  prevYear.innerHTML = `${parseInt(year) - 1}`
  const nextYear = document.createElement("div");
  nextYear.id = `next-year`;
  nextYear.innerHTML = `${parseInt(year) + 1}`
  yearNav.append(prevYear, viewedYear, nextYear)

  const monthsNav = document.createElement("div");
  monthsNav.id = `months-nav`;
  const viewedMonth = document.createElement("div");
  viewedMonth.id = `viewed-date`;
  viewedMonth.innerHTML = `${monthName}`
  const prevMonth = document.createElement("div");
  prevMonth.id = `prev-date`;
  prevMonth.innerHTML = `${prevMonthName}`
  const nextMonth = document.createElement("div");
  nextMonth.id = `next-date`;
  nextMonth.innerHTML = `${nextMonthName}`
  monthsNav.append(prevMonth, viewedMonth, nextMonth)

  let elem = document.getElementById("calendar-container")
  elem.replaceChildren()
  const d = new Date(year, month - 1);
  const tableCreated = document.createElement("table");
  tableCreated.id = `calendar_table`;
  let table = `
            <thead class="thead-dark">
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
            </thead>
            <tbody id="tableBody">
              <tr>
  `;

  for (let i = 0; i < d.getDay(); i++) {
    table += '<td></td>';
  }

  while (d.getMonth() == month - 1) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      table += `<td id="day ${d.getDate()}" class="weekend day">` + d.getDate() + '</td>';
    }
    else {
      table += `<td id="day ${d.getDate()}" class="day">` + d.getDate() + '</td>';
    }
    if (d.getDay() % 7 == 6) {
      table += '</tr><tr>';
    }
    d.setDate(d.getDate() + 1);
  }

  if (d.getDay() != 0) {
    for (let i = d.getDay; i < 7; i++) {
      table += '<td></td>';
    }
  }
  table += '</tbody>';
  tableCreated.innerHTML = table;
  elem.append(yearNav, monthsNav, tableCreated);

  document.querySelectorAll('.day').forEach(dayElement => {
    dayElement.onclick = event => {
      let dayNum = dayElement.innerHTML
      if (dayNum <= 9) {
        dayNum = "0".concat(dayNum)
      }
      let dayDisplayed = `${year}-${month}-${dayNum}`
      loadCalendar(dayDisplayed, 1)
    }
  })

  let dayNum = "01"
  let monthDisplayed = parseInt(month)
  let yearDisplayed = parseInt(year)

  prevYear.onclick = event => {
    yearDisplayed = yearDisplayed - 1
    let mon = monthDisplayed.toString()
    if (monthDisplayed < 10) {
      mon = "0" + mon
    }
    let dateDisplayed = `${yearDisplayed.toString()}-${mon}-${dayNum}`
    loadCalendar(dateDisplayed, 1)
  }

  nextYear.onclick = event => {
    yearDisplayed = yearDisplayed + 1
    let mon = monthDisplayed.toString()
    if (monthDisplayed < 10) {
      mon = "0" + mon
    }
    let dateDisplayed = `${yearDisplayed.toString()}-${mon}-${dayNum}`
    loadCalendar(dateDisplayed, 1)
  }

  prevMonth.onclick = event => {
    if (month == "01") {
      monthDisplayed = 12
      yearDisplayed = yearDisplayed - 1
    } else {
      monthDisplayed = monthDisplayed - 1
    }
    let mon = monthDisplayed.toString()
    if (monthDisplayed < 10) {
      mon = "0" + mon
    }
    let dateDisplayed = `${yearDisplayed.toString()}-${mon}-${dayNum}`
    loadCalendar(dateDisplayed, 1)
  }

  nextMonth.onclick = event => {
    if (month == "12") {
      monthDisplayed = 1
      yearDisplayed = yearDisplayed + 1
    } else {
      monthDisplayed = monthDisplayed + 1
    }
    let mon = monthDisplayed.toString()
    if (monthDisplayed < 10) {
      mon = "0" + mon
    }
    let dateDisplayed = `${yearDisplayed.toString()}-${mon}-${dayNum}`
    loadCalendar(dateDisplayed, 1)
  }
}

async function searchApp(page) {
  if (!page) {
    page = 1
  }
  return fetch("api/apps" + "?page=" + page)
    .then(response => response.json())
    .then(e => {
      selectFilters(e)
    })
}

function selectFilters(response) {
  let appointmentsListElement = document.querySelector("#appointments_list")
  if (document.querySelector(".content-container") != null) {
    document.querySelector(".content-container").remove();
  }
  appointmentsListElement.style = "filter: none";

  const filterContainer = document.createElement("div");
  filterContainer.id = `filter-container`;
  filterContainer.style = 'background: white;'
  appointmentsListElement.appendChild(filterContainer)

  const filterLabel = document.createElement("label");
  filterLabel.innerHTML = 'Select filter: '
  filterContainer.appendChild(filterLabel);
  filterLabel.id = "filter_label";

  const filterSelect = document.createElement("select");
  filterContainer.appendChild(filterSelect);
  filterSelect.id = "select_filter";

  const option1 = document.createElement("option");
  option1.value = "Vet";
  option1.text = "Vet";
  filterSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = "Client";
  option2.text = "Client";
  filterSelect.appendChild(option2);

  const option3 = document.createElement("option");
  option3.value = "Pet";
  option3.text = "Pet";
  filterSelect.appendChild(option3);

  showSearch(response.vets)

  document.getElementById("select_filter").onchange = function () {
    if (document.getElementById("select_filter").value === "Vet") {
      showSearch(response.vets)
    } else if (document.getElementById("select_filter").value === "Client") {
      showSearch(response.clients)
    } else if (document.getElementById("select_filter").value === "Pet") {
      showSearch(response.pets)
    }
  }
}

function showSearch(data) {
  if (document.getElementById('search_container') != null) {
    document.getElementById('search_container').remove()
  }
  if (document.querySelector("#searched_list_container") != null) {
    document.querySelector("#searched_list_container").remove()
  }
  if (document.querySelector('#profile_container') != null) {
    document.querySelector("#profile_container").remove()
  }
  document.querySelector(".pagination").style.display = 'none'
  if (document.querySelector('#filter-container') != null) {
    document.querySelector('#filter-container').style.display = "block"
  }

  if (document.querySelector('#back-button') != null) {
    document.querySelector('#back-button').remove()
  }

  let appointmentsListElement = document.querySelector("#appointments_list")
  const searchContainer = document.createElement("div");
  searchContainer.id = 'search_container';
  appointmentsListElement.appendChild(searchContainer);

  const searchName = document.createElement("input");
  searchName.type = "text";
  searchName.id = 'searchInput';
  searchContainer.appendChild(searchName);

  const searchUL = document.createElement("ul");
  searchUL.id = 'searchUL';
  searchContainer.appendChild(searchUL);

  if (data.length === 0) {
    searchName.placeholder = 'No data';
  } else if (data[0].vet_name != null) {
    searchName.placeholder = 'Search for vets';
    searchUL.innerHTML = `Vets:`
    for (i = 0; i < data.length; i++) {
      const vetName = document.createElement("li");
      vetName.value = `${data[i].id}`
      vetName.innerHTML = `${data[i].vet_name}`
      vetName.className = 'list_element'
      searchUL.appendChild(vetName)
    }
  } else if (data[0].client_name != null) {
    searchName.placeholder = 'Search for clients';
    searchUL.innerHTML = `Clients: `
    for (i = 0; i < data.length; i++) {
      const clientName = document.createElement("li");
      clientName.value = `${data[i].id}`
      clientName.innerHTML = `${data[i].client_name}`
      clientName.className = 'list_element'
      searchUL.appendChild(clientName)
    }
  } else if (data[0].pet_name != null) {
    searchName.placeholder = 'Search for pets';
    searchUL.innerHTML = `Pets: `
    for (i = 0; i < data.length; i++) {
      const petName = document.createElement("li");
      petName.value = `${data[i].id}`
      petName.innerHTML = `${data[i].pet_name}`
      petName.className = 'list_element'
      searchUL.appendChild(petName)
    }
  }

  document.querySelectorAll('.list_element').forEach(listElement => {
    listElement.onclick = event => {
      if (document.querySelector('#profile_container') != null) {
        document.querySelector('#profile_container').remove()
      }
      if (document.querySelector('#search_container') != null) {
        document.querySelector('#search_container').remove()
      }
      if (document.querySelector('#filter-container') != null) {
        document.querySelector('#filter-container').style.display = "none"
      }
      const backButton = document.createElement("button");
      backButton.id = "back-button";
      backButton.innerHTML="Back";
      document.getElementById("appointments_list").appendChild(backButton);

      backButton.onclick = event => {
        showSearch(data)
      }

      if (data[0].vet_name != null) {
        getAppsForVet(listElement.value, 1)
      } else if (data[0].client_name != null) {
        getAppsForClient(listElement.value, 1)
      } else if (data[0].pet_name != null) {
        getAppsForPet(listElement.value, 1)
      }
    }
  })
  document.getElementById('searchInput').onkeyup = function () { searchFunction() }
}

function searchFunction() {
  let input, filter, ul, li;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("searchUL");
  li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i++) {
    let selectedName = li[i].innerHTML;
    if (selectedName.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

async function getAppsForPet(pet_id, page) {
  if (!page) {
    page = 1
  }
  const response = await fetch("api/pet_apps/" + pet_id + "?page=" + page);
  const e = await response.json();
  getPetProfile(e);
  getAppointments(e);
}

async function getAppsForClient(client_id, page) {
  if (!page) {
    page = 1
  }
  const response = await fetch("api/client/" + client_id + "?page=" + page);
  const e = await response.json();
  getPetProfile(e);
  getAppointments(e);
}

async function getAppsForVet(vet_id, page) {
  if (!page) {
    page = 1
  }
  const response = await fetch("api/vet/" + vet_id + "?page=" + page);
  const e = await response.json();
  getPetProfile(e);
  getAppointments(e);
}

function getPetProfile(data) {
  let appointmentsListElement = document.querySelector("#appointments_list")
  const profileContainer = document.createElement("div");
  profileContainer.id = `profile_container`;
  profileContainer.className = "appointment-container";
  appointmentsListElement.appendChild(profileContainer);

  const detailsContainer = document.createElement("div");
  detailsContainer.id = "details_container";

  const actionContainer = document.createElement("div");
  actionContainer.id = "action_container";

  profileContainer.append(detailsContainer, actionContainer);

  const info_name = document.createElement("div");
  info_name.className = "scheduled_details";
  info_name.id = `info_name`;
  detailsContainer.appendChild(info_name)

  const info_notes = document.createElement("div");
  info_notes.id = `info_notes`;

  if (data.info_set == "pet") {
    info_name.innerHTML = `Pet name: ${data.pet.pet_name}`;
    info_name.value = `${data.pet.id}`
    const owner_details = document.createElement("div");
    owner_details.className = "scheduled_details";
    owner_details.id = `owner_details`;
    owner_details.innerHTML = `Owner: ${data.pet.owner_name}`;
    owner_details.value = `${data.pet.owner_id}`
    detailsContainer.appendChild(owner_details)
    if (data.pet.notes != "") {
      info_notes.innerHTML = `Notes: ${data.pet.notes}`
    } else {
      info_notes.innerHTML = `There are no notes for ${data.pet.pet_name}`
    }
    detailsContainer.appendChild(info_notes)

    if (data.is_authenticated && (data.current_user == data.pet.created_by || data.is_superuser)) {
      const petEdit = document.createElement("button");
      petEdit.className = "edit-button"
      petEdit.id = `edit-button${data.pet.id}`
      petEdit.innerHTML = `Edit`
      actionContainer.appendChild(petEdit)
      petEdit.onclick = event => {
        editPet(data.pet.id)
      };
      const petDelete = document.createElement("button");
      petDelete.className = "delete-button"
      petDelete.id = `delete-button${data.pet.id}`
      petDelete.innerHTML = `Delete`
      actionContainer.appendChild(petDelete)
      petDelete.onclick = event => {
        deletePet(data.pet.id)
      };
    }
  } else if (data.info_set == "client") {
    info_name.innerHTML = `Client name: ${data.client.client_name}`;
    info_name.value = `${data.client.id}`
    if (data.client.notes != "") {
      info_notes.innerHTML = `${data.client.notes}`
    } else {
      info_notes.innerHTML = `There are no notes for ${data.client.client_name}`
    }
    detailsContainer.appendChild(info_notes)

    if (data.is_authenticated && (data.current_user == data.client.created_by || data.is_superuser)) {
      const clientEdit = document.createElement("button");
      clientEdit.className = "edit-button"
      clientEdit.id = `edit-button${data.client.id}`
      clientEdit.innerHTML = `Edit`
      actionContainer.appendChild(clientEdit)
      clientEdit.onclick = event => {
        editClient(data.client.id)
      };
      const clientDelete = document.createElement("button");
      clientDelete.className = "delete-button"
      clientDelete.id = `delete-button${data.client.id}`
      clientDelete.innerHTML = `Delete`
      actionContainer.appendChild(clientDelete)
      clientDelete.onclick = event => {
        deleteClient(data.client.id)
      };
    }
  } else if (data.info_set == "vet") {
    info_name.innerHTML = `Vet name: ${data.vet.vet_name}`;
    info_name.value = `${data.vet.id}`

    if (data.vet.notes != "") {
      info_notes.innerHTML = `Notes: ${data.vet.notes}`
    } else {
      info_notes.innerHTML = `There are no notes for ${data.vet.vet_name}`
    }
    detailsContainer.appendChild(info_notes)

    if (data.is_superuser) {
      const vetEdit = document.createElement("button");
      vetEdit.className = "edit-button"
      vetEdit.id = `edit-button${data.vet.id}`
      vetEdit.innerHTML = `Edit`
      actionContainer.appendChild(vetEdit)
      vetEdit.onclick = event => {
        editVet(data.vet.id)
      };
      const vetDelete = document.createElement("button");
      vetDelete.className = "delete-button"
      vetDelete.id = `delete-button${data.vet.id}`
      vetDelete.innerHTML = `Delete`
      actionContainer.appendChild(vetDelete)
      vetDelete.onclick = event => {
        deleteVet(data.vet.id)
      };
    }
  }
}

function getAppointments(response) {
  document.querySelector(".pagination").style.display = 'block'
  let appointmentsListElement = document.querySelector("#appointments_list")
  if (document.querySelector("#searched_list_container") != null) {
    document.querySelector("#searched_list_container").remove()
  }
  const searchedListContainer = document.createElement("div");
  searchedListContainer.id = `searched_list_container`;

  const searchedListTitle = document.createElement("div");
  searchedListTitle.id = `searched_list_title`;
  searchedListTitle.innerHTML = `Appointments:`
  searchedListTitle.style = 'display:block';
  searchedListContainer.appendChild(searchedListTitle);

  const searchedList = document.createElement("div");
  searchedList.id = `searched_list`;
  searchedListContainer.appendChild(searchedList);

  response.appointments.forEach(appointment => {
    const appointmentContent = document.createElement("div");
    appointmentContent.className = "appointment-container";
    appointmentContent.id = `appointment-container${appointment.id}`;

    const scheduled_vet = document.createElement("div");
    scheduled_vet.className = "scheduled_details";
    scheduled_vet.id = `scheduled_vet${appointment.id}`;
    scheduled_vet.innerHTML = `Vet: ${appointment.vet}`;

    const scheduled_client = document.createElement("div");
    scheduled_client.className = "scheduled_details";
    scheduled_client.id = `scheduled_client${appointment.id}`;
    scheduled_client.innerHTML = `Client: ${appointment.client}`;

    const scheduled_pet = document.createElement("div");
    scheduled_pet.className = "scheduled_details";
    scheduled_pet.id = `scheduled_pet${appointment.id}`;
    scheduled_pet.innerHTML = `Pet: ${appointment.pet}`;

    const scheduled_date = document.createElement("div");
    scheduled_date.className = "scheduled_details";
    scheduled_date.id = `scheduled_date${appointment.id}`;
    scheduled_date.innerHTML = `${appointment.appointment_date}`;

    const scheduled_timeslot = document.createElement("div");
    scheduled_timeslot.className = "scheduled_details";
    scheduled_timeslot.id = `appointments-container${appointment.id}`;
    scheduled_timeslot.innerHTML = `${appointment.timeslot}`;

    const notes = document.createElement("div");
    notes.className = "scheduled_details";
    notes.id = `appointments-container${appointment.id}`;
    notes.innerHTML = `${appointment.notes}`;

    appointmentsListElement.appendChild(searchedListContainer);
    searchedList.appendChild(appointmentContent)
    appointmentContent.append(scheduled_vet, scheduled_client, scheduled_pet, scheduled_date, scheduled_timeslot)

    if (appointment.notes != null) {
      appointmentContent.appendChild(notes)
    }

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons-container"
    appointmentContent.appendChild(buttonsDiv)

    if (response.is_authenticated && (response.current_user == appointment.created_by || response.is_superuser)) {
      const appEdit = document.createElement("button");
      appEdit.className = "edit-button"
      appEdit.id = `edit-button${appointment.id}`
      appEdit.innerHTML = `Edit`
      buttonsDiv.appendChild(appEdit)
      appEdit.onclick = event => {
        editApp(appointment.id)
      };
      const appDelete = document.createElement("button");
      appDelete.className = "delete-button"
      appDelete.id = `delete-button${appointment.id}`
      appDelete.innerHTML = `Delete`
      buttonsDiv.appendChild(appDelete)
      appDelete.onclick = event => {
        let delDay = appointment.appointment_date.substring(3, 5);
        let delMonth = appointment.appointment_date.substring(0, 2);
        let delYear = appointment.appointment_date.substring(6, 10);
        let dateDel = `${delYear}-${delMonth}-${delDay}`;
        deleteAppointment(appointment.id, dateDel)
      };
    }
  })

  let currentPage = parseInt(response.page)
  let hasPrevious = (currentPage > 1)
  let totalPages = response.total
  let nextPage = currentPage + 1
  let thisDay = response.current_date

  paginationProcess(hasPrevious, currentPage, nextPage, totalPages, thisDay)
}

function paginationProcess(hasPrevious, currentPage, nextPage, totalPages, thisDay) {
  let pagination = document.querySelector(".pagination")
  if (pagination != null) {
    pagination.replaceChildren()
  }
  const step = document.createElement("span");
  step.className = "step-links"
  if (pagination != null && totalPages > 0) {
    pagination.appendChild(step)
    let pageName = document.querySelector("h1").innerHTML
    if (hasPrevious) {
      const linkPrevious = document.createElement("button")
      linkPrevious.id = 'previous'
      linkPrevious.innerHTML = `previous`
      step.appendChild(linkPrevious)

      linkPrevious.onclick = event => {
        if (document.getElementById('info_name') != null) {
          let selectedID = document.getElementById('info_name').value
          if (document.getElementById('info_name').innerHTML.charAt(0) === "V") {
            getAppsForVet(selectedID, currentPage - 1)
          } else if (document.getElementById('info_name').innerHTML.charAt(0) === "C") {
            getAppsForClient(selectedID, currentPage - 1)
          } else if (document.getElementById('info_name').innerHTML.charAt(0) === "P") {
            getAppsForPet(selectedID, currentPage - 1)
          }
          document.getElementById('profile_container').remove()
        } else {
          loadCalendar(thisDay, currentPage - 1)
            .then(() =>
              setTimeout(() => {
                document.querySelector('nav').scrollIntoView({ block: "center", behavior: "smooth" })
              })
            )
        }
      }

    };

    const current = document.createElement("span")
    current.className = "current"
    current.innerHTML = `Page ${currentPage} of ${totalPages}`
    step.appendChild(current)

    if (nextPage <= totalPages) {
      const linkNext = document.createElement("button")
      linkNext.innerHTML = `next`
      linkNext.id = 'next'
      step.appendChild(linkNext)
      linkNext.onclick = event => {
        if (document.getElementById('info_name') != null) {
          let selectedID = document.getElementById('info_name').value
          if (document.getElementById('info_name').innerHTML.charAt(0) === "V") {
            getAppsForVet(selectedID, nextPage)
          } else if (document.getElementById('info_name').innerHTML.charAt(0) === "C") {
            getAppsForClient(selectedID, nextPage)
          } else if (document.getElementById('info_name').innerHTML.charAt(0) === "P") {
            getAppsForPet(selectedID, nextPage)
          }
          document.getElementById('profile_container').remove()
        } else {
          loadCalendar(thisDay, nextPage)
            .then(() =>
              setTimeout(() => {
                document.querySelector('nav').scrollIntoView({ block: "center", behavior: "smooth" })
              })
            )
        }
      }
    }
  } else {
    if (pagination != null) {
      pagination.appendChild(step)
      const noPage = document.createElement("span")
      noPage.className = "no-page"
      noPage.innerHTML = `No appointments found`
      step.appendChild(noPage)
    }
  }
}

async function editApp(id) {
  fetch(`/api/appointment/edit/` + id, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(e => {
      createEditFileds(e)
    });
}

function createEditFileds(response) {
  const appointmentsListElement = document.querySelector("#appointments_list");
  if (appointmentsListElement != null) {
    appointmentsListElement.replaceChildren()
  }

  const pag = document.querySelector(".pagination");
  pag.replaceChildren();

  const editContent = document.createElement("div");
  editContent.className = "appointment-container";
  appointmentsListElement.appendChild(editContent);

  const editForm = document.createElement("form");
  editForm.className = "form-container";
  editContent.appendChild(editForm);

  const inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.name = 'csrfmiddlewaretoken';
  inputElem.value = '{{ csrf_token }}';
  editForm.appendChild(inputElem);

  const addVetContainer = document.createElement("div");
  editForm.appendChild(addVetContainer);

  const vetLabel = document.createElement("label");
  vetLabel.innerHTML = "Select Vet:";
  addVetContainer.appendChild(vetLabel);

  const vetSelect = document.createElement("select");
  editForm.appendChild(vetSelect);
  vetSelect.id = "add_vet";

  for (let i = 0; i < response.vets.length; i++) {
    const option = document.createElement("option");
    option.value = response.vets[i].id;
    option.text = response.vets[i].vet_name;
    if (response.vets[i].id == response.appointment.vet_id) {
      option.setAttribute('selected', 'true')
    }
    vetSelect.appendChild(option);
  }

  const addClientContainer = document.createElement("div");
  addClientContainer.id = 'add_client_container';
  editForm.appendChild(addClientContainer);

  const addClientButton = document.createElement("button");
  addClientButton.className = "save-button";
  addClientButton.id = "client-button";
  addClientButton.innerHTML = `Add new client`;
  addClientContainer.appendChild(addClientButton);

  document.querySelector("#client-button").onclick = async function (event) {
    event.preventDefault();
    createNewClient(response);
  }

  const clientLabel = document.createElement("label");
  clientLabel.innerHTML = "Select Client:";
  addClientContainer.appendChild(clientLabel);

  const clientSelect = document.createElement("select");
  addClientContainer.appendChild(clientSelect);
  clientSelect.id = "add_client";

  for (let i = 0; i < response.clients.length; i++) {
    const option = document.createElement("option");
    option.value = response.clients[i].id;
    option.text = response.clients[i].client_name;
    if (response.clients[i].id == response.appointment.client_id) {
      option.setAttribute('selected', 'true')
    }
    clientSelect.appendChild(option);
  }

  const addPetContainer = document.createElement("div");
  addPetContainer.id = 'add_pet_container'
  editForm.appendChild(addPetContainer);

  const addPetButton = document.createElement("button");
  addPetButton.className = "save-button";
  addPetButton.id = "pet-button";
  addPetButton.innerHTML = `Add new pet`;
  addPetContainer.appendChild(addPetButton);

  document.querySelector("#pet-button").onclick = async function (event) {
    event.preventDefault();
    createNewPet(response);
  }

  const petLabel = document.createElement("label");
  petLabel.id = 'label_add_pet';
  petLabel.innerHTML = "Select Pet:";
  addPetContainer.appendChild(petLabel);

  addPetOptions(document.getElementById('add_client').value)

  document.getElementById('add_client').onchange = function () {
    document.getElementById('add_pet').remove()
    addPetOptions(document.getElementById('add_client').value)
  };

  const editDate = document.createElement("div");
  editForm.appendChild(editDate);

  const editDateLabel = document.createElement("label");
  editDateLabel.innerHTML = "Appointment date:";
  editDate.appendChild(editDateLabel);

  const editDateInput = document.createElement("input");
  let oldDate = response.appointment.appointment_date;
  let oldYear = oldDate.substring(6, 10);
  let oldMonth = oldDate.substring(0, 2);
  let oldDay = oldDate.substring(3, 5)
  const newDate = oldYear.concat("-", oldMonth, "-", oldDay);
  editDateInput.value = newDate;
  editDateInput.type = "date";
  editDateInput.id = "add_app_date";
  editDate.appendChild(editDateInput);

  const editTime = document.createElement("div");
  editForm.appendChild(editTime);
  editTime.id = "add_app_time";

  const editTimeslotLabel = document.createElement("label");
  editTimeslotLabel.innerHTML = "Choose a timeslot for the appointment:";
  editTime.appendChild(editTimeslotLabel);

  let openSlots = response.timeslot_choices
  let usedVetSlots = response.all_used_timeslots
  getTimeslots(openSlots, usedVetSlots)
  const prevTimeslot = response.appointment.timeslot

  let selected_timeslot_id
  for (let i = 0; i < response.timeslot_choices.length; i++) {
    if (response.timeslot_choices[i][1] == prevTimeslot){
      selected_timeslot_id = response.timeslot_choices[i][0]
    }
  }

  const option = document.createElement("option");
  option.text = prevTimeslot;
  option.value = selected_timeslot_id;
  option.selected = true;
  document.getElementById('add_timeslot').appendChild(option);

  document.getElementById('add_vet').onchange = function () {
    getTimeslots(openSlots, usedVetSlots)
  };

  const editNotesContainer = document.createElement("div");
  editForm.appendChild(editNotesContainer);

  const editNotes = document.createElement("textarea");
  editNotes.setAttribute("rows", "5");
  editNotes.id = "add_notes"
  editNotesContainer.appendChild(editNotes);
  document.querySelector("#add_notes").value = response.appointment.notes;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-container";
  editForm.appendChild(buttonsDiv);

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.id = "modify";
  saveButton.innerHTML = `Save`;
  buttonsDiv.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.id = "cancelEdit";
  cancelButton.innerHTML = `Cancel`;
  buttonsDiv.appendChild(cancelButton);

  document.querySelector('#modify').onclick = async function (event) {
    event.preventDefault();
    const csrfToken = document.cookie.split('=')[1].split('%')[0];
    const add_vet = document.querySelector('#add_vet').value
    const add_client = document.querySelector('#add_client').value
    const add_pet = document.querySelector('#add_pet').value
    const add_app_date = document.querySelector('#add_app_date').value
    const add_timeslot = document.querySelector('#add_timeslot').value
    const add_notes = document.querySelector('#add_notes').value

    fetch(`/api/appointment/edit/` + response.appointment.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({
        add_notes: add_notes,
        add_vet: add_vet,
        add_client: add_client,
        add_pet: add_pet,
        add_app_date: add_app_date,
        add_timeslot: add_timeslot
      }), credentials: 'same-origin'
    })
      .then(response => loadCalendar(add_app_date, 1));
  }

  document.querySelector('#cancelEdit').onclick = async function (event) {
    event.preventDefault();
    const openDate = document.querySelector('#add_app_date').value
    loadCalendar(openDate, 1)
  }
}

function deleteAppointment(id, date) {
  fetch(`/api/appointment/delete/` + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': document.cookie.split('=')[1].split('%')[0]
    },
    credentials: 'same-origin'
  }).then(response => {
    let currentDate = getCurrentDate();
    loadCalendar(currentDate, 1)
  })
}

async function editVet(vet_id) {
  fetch(`/api/vet/edit/` + vet_id, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(e => {
      createVetEditFileds(e)
    });
}

function createVetEditFileds(response) {
  const appointmentsListElement = document.querySelector("#appointments_list");
  if (appointmentsListElement != null) {
    appointmentsListElement.replaceChildren()
  }
  const pag = document.querySelector(".pagination");
  pag.replaceChildren();

  const editContent = document.createElement("div");
  editContent.className = "appointment-container";
  appointmentsListElement.appendChild(editContent);

  const editForm = document.createElement("form");
  editForm.className = "form-container";
  editContent.appendChild(editForm);

  const inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.name = 'csrfmiddlewaretoken';
  inputElem.value = '{{ csrf_token }}';
  editForm.appendChild(inputElem);

  const editNameContainer = document.createElement("div");
  editForm.appendChild(editNameContainer);
  const editName = document.createElement("input");
  editName.id = "edit_vet_name"
  editNameContainer.appendChild(editName);
  document.querySelector("#edit_vet_name").value = response.vet.vet_name;

  const editNotesContainer = document.createElement("div");
  editForm.appendChild(editNotesContainer);
  const editNotes = document.createElement("textarea");
  editNotes.setAttribute("rows", "5");
  editNotes.id = "edit_vet_notes"
  editNotesContainer.appendChild(editNotes);
  document.querySelector("#edit_vet_notes").value = response.vet.notes;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-container";
  editForm.appendChild(buttonsDiv);

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.id = "modify";
  saveButton.innerHTML = `Save`;
  buttonsDiv.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.id = "cancelEdit";
  cancelButton.innerHTML = `Cancel`;
  buttonsDiv.appendChild(cancelButton);

  document.querySelector('#modify').onclick = async function (event) {
    event.preventDefault();
    const csrfToken = document.cookie.split('=')[1].split('%')[0];
    const edit_vet_name = document.querySelector('#edit_vet_name').value
    const edit_vet_notes = document.querySelector('#edit_vet_notes').value

    fetch(`/api/vet/edit/` + response.vet.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({
        edit_vet_name: edit_vet_name,
        edit_vet_notes: edit_vet_notes,
      }), credentials: 'same-origin'
    })
      .then(response => loadCalendar(getCurrentDate(), 1));
  }

  document.querySelector('#cancelEdit').onclick = async function (event) {
    event.preventDefault();
    loadCalendar(getCurrentDate(), 1)
  }
}

async function editClient(client_id) {
  fetch(`/api/client/edit/` + client_id, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(e => {
      createClientEditFileds(e)
    });
}

function createClientEditFileds(response) {
  const appointmentsListElement = document.querySelector("#appointments_list");
  if (appointmentsListElement != null) {
    appointmentsListElement.replaceChildren()
  }
  const pag = document.querySelector(".pagination");
  pag.replaceChildren();

  const editContent = document.createElement("div");
  editContent.className = "appointment-container";
  appointmentsListElement.appendChild(editContent);

  const editForm = document.createElement("form");
  editForm.className = "form-container";
  editContent.appendChild(editForm);

  const inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.name = 'csrfmiddlewaretoken';
  inputElem.value = '{{ csrf_token }}';
  editForm.appendChild(inputElem);

  const editNameContainer = document.createElement("div");
  editForm.appendChild(editNameContainer);
  const editName = document.createElement("input");
  editName.id = "edit_client_name"
  editNameContainer.appendChild(editName);
  document.querySelector("#edit_client_name").value = response.client.client_name;

  const editNotesContainer = document.createElement("div");
  editForm.appendChild(editNotesContainer);
  const editNotes = document.createElement("textarea");
  editNotes.setAttribute("rows", "5");
  editNotes.id = "edit_client_notes"
  editNotesContainer.appendChild(editNotes);
  document.querySelector("#edit_client_notes").value = response.client.notes;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-container";
  editForm.appendChild(buttonsDiv);

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.id = "modify";
  saveButton.innerHTML = `Save`;
  buttonsDiv.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.id = "cancelEdit";
  cancelButton.innerHTML = `Cancel`;
  buttonsDiv.appendChild(cancelButton);

  document.querySelector('#modify').onclick = async function (event) {
    event.preventDefault();
    const csrfToken = document.cookie.split('=')[1].split('%')[0];
    const edit_client_name = document.querySelector('#edit_client_name').value
    const edit_client_notes = document.querySelector('#edit_client_notes').value

    fetch(`/api/client/edit/` + response.client.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({
        edit_client_name: edit_client_name,
        edit_client_notes: edit_client_notes,
      }), credentials: 'same-origin'
    })
      .then(response => loadCalendar(getCurrentDate(), 1));
  }

  document.querySelector('#cancelEdit').onclick = async function (event) {
    event.preventDefault();
    loadCalendar(getCurrentDate(), 1)
  }
}

async function editPet(pet_id) {
  fetch(`/api/pet/edit/` + pet_id, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(e => {
      createPetEditFileds(e)
    });
}

function createPetEditFileds(response) {
  const appointmentsListElement = document.querySelector("#appointments_list");
  if (appointmentsListElement != null) {
    appointmentsListElement.replaceChildren()
  }
  const pag = document.querySelector(".pagination");
  pag.replaceChildren();

  const editContent = document.createElement("div");
  editContent.className = "appointment-container";
  appointmentsListElement.appendChild(editContent);

  const editForm = document.createElement("form");
  editForm.className = "form-container";
  editContent.appendChild(editForm);

  const inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.name = 'csrfmiddlewaretoken';
  inputElem.value = '{{ csrf_token }}';
  editForm.appendChild(inputElem);

  const editNameContainer = document.createElement("div");
  editForm.appendChild(editNameContainer);
  const editName = document.createElement("input");
  editName.id = "edit_pet_name"
  editNameContainer.appendChild(editName);
  document.querySelector("#edit_pet_name").value = response.pet.pet_name;

  const editOwnerContainer = document.createElement("div");
  editOwnerContainer.innerHTML = `Owner: ${response.pet.owner_name}`;
  editForm.appendChild(editOwnerContainer);

  const editNotesContainer = document.createElement("div");
  editForm.appendChild(editNotesContainer);
  const editNotes = document.createElement("textarea");
  editNotes.setAttribute("rows", "5");
  editNotes.id = "edit_pet_notes"
  editNotesContainer.appendChild(editNotes);
  document.querySelector("#edit_pet_notes").value = response.pet.notes;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-container";
  editForm.appendChild(buttonsDiv);

  const saveButton = document.createElement("button");
  saveButton.className = "save-button";
  saveButton.id = "modify";
  saveButton.innerHTML = `Save`;
  buttonsDiv.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.id = "cancelEdit";
  cancelButton.innerHTML = `Cancel`;
  buttonsDiv.appendChild(cancelButton);

  document.querySelector('#modify').onclick = async function (event) {
    event.preventDefault();
    const csrfToken = document.cookie.split('=')[1].split('%')[0];
    const edit_pet_name = document.querySelector('#edit_pet_name').value
    const edit_pet_notes = document.querySelector('#edit_pet_notes').value

    fetch(`/api/pet/edit/` + response.pet.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({
        edit_pet_name: edit_pet_name,
        edit_pet_notes: edit_pet_notes,
      }), credentials: 'same-origin'
    })
      .then(response => loadCalendar(getCurrentDate(), 1));
  }

  document.querySelector('#cancelEdit').onclick = async function (event) {
    event.preventDefault();
    loadCalendar(getCurrentDate(), 1)
  }
}

function deletePet(pet_id) {
  fetch(`/api/pet/delete/` + pet_id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': document.cookie.split('=')[1].split('%')[0]
    },
    credentials: 'same-origin'
  }).then(response => {
    let currentDate = getCurrentDate();
    loadCalendar(currentDate, 1)
  })
}

function deleteClient(client_id) {
  fetch(`/api/client/delete/` + client_id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': document.cookie.split('=')[1].split('%')[0]
    },
    credentials: 'same-origin'
  }).then(response => {
    let currentDate = getCurrentDate();
    loadCalendar(currentDate, 1)
  })
}

function deleteVet(vet_id) {
  fetch(`/api/vet/delete/` + vet_id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': document.cookie.split('=')[1].split('%')[0]
    },
    credentials: 'same-origin'
  }).then(response => {
    if (response.status === 400) {
      alert('Assign all appointments to another vet, before deleting the profile')
    } else {
      let currentDate = getCurrentDate();
      loadCalendar(currentDate, 1)
    }
  })
}

async function newApp(date) {
  fetch(`/api/new_app_save/` + date, {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(response => response.json())
    .then(e => {
      createNewApp(e, date)
    })
}

function createNewApp(response, date) {
  if (response.vets.length === 0) {
    if (response.is_superuser){
      loadRegisterVet()
    } else{
      alert('There are not vets registered. Please contact the admin to create a vet account')
    }
  } else {
    const calendarBack = document.querySelector('#calendar-container');
    const appBack = document.querySelector('#appointments_list');
    calendarBack.style = 'filter: blur(8px); pointer-events:none;'
    appBack.style = 'filter: blur(8px); pointer-events:none;'
    document.querySelector('h1').style = 'filter: blur(8px); pointer-events:none;'
    document.querySelector('#menuItems').style = 'filter: blur(8px); pointer-events:none;'

    const pag = document.querySelector(".pagination");
    pag.style = 'filter: blur(8px); pointer-events:none;'

    const pageDisp = document.querySelector('#page_display')
    pageDisp.style = 'position: relative;'

    let newAppContainer
    if (document.getElementById("new-appointment-container")!=null){
      newAppContainer=document.getElementById("new-appointment-container")
    } else {
      newAppContainer = document.createElement("div");
      newAppContainer.id = `new-appointment-container`;
      pageDisp.appendChild(newAppContainer)
    }
    const newContent = document.createElement("div");
    newContent.className = "content-container";
    newAppContainer.appendChild(newContent);

    const newAppForm = document.createElement("form");
    newAppForm.className = "form-container";
    newContent.appendChild(newAppForm);

    const inputElem = document.createElement('input');
    inputElem.type = 'hidden';
    inputElem.name = 'csrfmiddlewaretoken';
    inputElem.value = '{{ csrf_token }}';
    newAppForm.appendChild(inputElem);

    const addVetContainer = document.createElement("div");
    addVetContainer.id="vet-container";
    newAppForm.appendChild(addVetContainer);

    const vetLabel = document.createElement("label");
    vetLabel.innerHTML = "Select Vet:";
    addVetContainer.appendChild(vetLabel);

    const vetSelect = document.createElement("select");
    addVetContainer.appendChild(vetSelect);
    vetSelect.id = "add_vet";

    for (let i = 0; i < response.vets.length; i++) {
      const option = document.createElement("option");
      option.value = response.vets[i].id;
      option.text = `${response.vets[i].vet_name} -- ${response.vets[i].notes}`;
      vetSelect.appendChild(option);
    }

    const addClientContainer = document.createElement("div");
    addClientContainer.id = 'add_client_container'
    newAppForm.appendChild(addClientContainer);

    const addClientButton = document.createElement("button");
    addClientButton.className = "save-button";
    addClientButton.id = "client-button";
    addClientButton.innerHTML = `Add new client`;
    addClientContainer.appendChild(addClientButton);

    document.querySelector("#client-button").onclick = async function (event) {
      event.preventDefault();
      createNewClient(response);
    }

    if (response.clients.length > 0) {
      const clientLabel = document.createElement("label");
      clientLabel.innerHTML = "Select Client:";
      addClientContainer.appendChild(clientLabel);

      const clientSelect = document.createElement("select");
      addClientContainer.appendChild(clientSelect);
      clientSelect.id = "add_client";

      for (let i = 0; i < response.clients.length; i++) {
        const option = document.createElement("option");
        option.value = response.clients[i].id;
        option.text = response.clients[i].client_name;
        clientSelect.appendChild(option);
      }
    }
    const addPetContainer = document.createElement("div");
    addPetContainer.id = 'add_pet_container'
    newAppForm.appendChild(addPetContainer);

    const addPetButton = document.createElement("button");
    addPetButton.className = "save-button";
    addPetButton.id = "pet-button";
    addPetButton.innerHTML = `Add new pet`;
    addPetContainer.appendChild(addPetButton);

    document.querySelector("#pet-button").onclick = async function (event) {
      event.preventDefault();
      createNewPet(response);
    }
    if (document.getElementById('add_client') != null) {
      addPetOptions(document.getElementById('add_client').value)
      document.getElementById('add_client').onchange = function () {
        document.getElementById('add_pet').remove()
        addPetOptions(document.getElementById('add_client').value)
        enableSave()
      };
    }

    const editDate = document.createElement("div");
    newAppForm.appendChild(editDate);

    const editDateLabel = document.createElement("label");
    editDateLabel.innerHTML = "Appointment date:";
    editDate.appendChild(editDateLabel);

    const editDateInput = document.createElement("input");
    editDateInput.type = "date";
    editDateInput.id = "add_app_date";
    editDateInput.value = `${document.querySelector('#appointments-date-container').innerHTML}`;
    editDate.appendChild(editDateInput);

    const editTimeslotDiv = document.createElement("div");
    editTimeslotDiv.id = "add_app_time"
    newAppForm.appendChild(editTimeslotDiv);

    const editTimeslotLabel = document.createElement("label");
    editTimeslotLabel.innerHTML = "Choose a timeslot for the appointment:";
    editTimeslotDiv.appendChild(editTimeslotLabel);

    let openSlots = response.timeslot_choices
    let usedVetSlots = response.all_used_timeslots
    getTimeslots(openSlots, usedVetSlots)

    document.getElementById('add_vet').onchange = function () {
      getTimeslots(openSlots, usedVetSlots)
    };

    const editNotesContainer = document.createElement("div");
    editNotesContainer.id="notes_container"
    newAppForm.appendChild(editNotesContainer);

    const editNotesLabel = document.createElement("label");
    editNotesLabel.innerHTML = "Add notes:";
    editNotesContainer.appendChild(editNotesLabel);

    const editNotes = document.createElement("textarea");
    editNotes.setAttribute("rows", "5");
    editNotes.id = "add_notes"
    editNotesContainer.appendChild(editNotes);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons-container";
    newAppForm.appendChild(buttonsDiv);

    const saveButton = document.createElement("button");
    saveButton.className = "save-button";
    saveButton.id = "modify";
    saveButton.innerHTML = `Save`;
    saveButton.disabled = false;
    buttonsDiv.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-button";
    cancelButton.id = "cancelNewApp";
    cancelButton.innerHTML = `Cancel`;
    buttonsDiv.appendChild(cancelButton);

    document.querySelector('#menuItems').disabled = true;

    document.querySelector('#modify').onclick = async function (event) {
      event.preventDefault();
      const csrfToken = document.cookie.split('=')[1].split('%')[0];
      const add_vet = document.querySelector('#add_vet').value
      const add_client = document.querySelector('#add_client').value
      const add_pet = document.querySelector('#add_pet').value
      const add_app_date = document.querySelector('#add_app_date').value
      const add_timeslot = document.querySelector('#add_timeslot').value
      const add_notes = document.querySelector('#add_notes').value
      saveAndLoad(csrfToken, add_vet, add_client, add_pet, add_app_date, add_timeslot, add_notes)
    }

    document.querySelector('#cancelNewApp').onclick = async function (event) {
      event.preventDefault();
      const openDate = document.querySelector('#appointments-date-container').innerHTML
      loadCalendar(openDate, 1)
    }
  }
  enableSave();
}

function getTimeslots(openSlots, usedVetSlots) {
  if (document.getElementById('add_timeslot') != null) {
    document.getElementById('add_timeslot').remove()
  }
  let vetSlots = []
  let vetInput = document.getElementById('add_vet').value;
  let editTimeslotDiv = document.querySelector('#add_app_time');
  const editTimeslot = document.createElement("select");
  editTimeslotDiv.appendChild(editTimeslot);
  editTimeslot.id = "add_timeslot";
  let vetUsedSlots = []
  usedVetSlots.forEach(element => {
    if (element[0] == vetInput) {
      vetUsedSlots = [...element[1]]
    }
  })

  if (vetUsedSlots.length === 0) {
    vetSlots = [...openSlots]
  } else {
    for (let i = 0; i < openSlots.length; i++) {
      if (!vetUsedSlots.includes(openSlots[i][1])) {
        vetSlots.push(openSlots[i])
      }
    }
  }

  for (let i = 0; i < vetSlots.length; i++) {
    const option = document.createElement("option");
    option.value = vetSlots[i][0];
    option.text = vetSlots[i][1];
    editTimeslot.appendChild(option);
  }
}

function createNewClient(response) {
  let addClientContainer = document.querySelector('#add_client_container')
  document.querySelector("#client-button").style.display = 'none';
  if (document.querySelector('#existing_client_name') != null) {
    document.querySelector('#existing_client_name').remove()
  }

  const newClientForm = document.createElement("form");
  newClientForm.className = "form-container";
  newClientForm.id = 'new-client-form';
  addClientContainer.appendChild(newClientForm);

  const inputElem = document.createElement('input');
  inputElem.type = 'hidden';
  inputElem.name = 'csrfmiddlewaretoken';
  inputElem.value = '{{ csrf_token }}';
  newClientForm.appendChild(inputElem);

  const addNewClientContainer = document.createElement("div");
  addNewClientContainer.id = "new_client_container";
  newClientForm.appendChild(addNewClientContainer);

  const newClientName = document.createElement("input");
  newClientName.type = "text";
  newClientName.id = 'client_name';
  newClientName.placeholder = 'New client name'
  addNewClientContainer.appendChild(newClientName);

  const newClientNotes = document.createElement("textarea");
  newClientNotes.name = "client_notes"
  newClientNotes.rows = "4"
  newClientNotes.cols = "50"
  newClientNotes.type = "text";
  newClientNotes.id = 'client_notes';
  newClientNotes.placeholder = 'New client notes'
  addNewClientContainer.appendChild(newClientNotes);

  const newClientButtons = document.createElement("div");
  newClientButtons.id = "new_client_buttons";
  newClientButtons.style = "display:block";
  addNewClientContainer.appendChild(newClientButtons);

  const saveNewClient = document.createElement("button");
  saveNewClient.className = "save-button";
  saveNewClient.id = "save-client-button";
  saveNewClient.innerHTML = `Save`;
  newClientButtons.appendChild(saveNewClient);

  const cancelNewClient = document.createElement("button");
  cancelNewClient.className = "cancel-button";
  cancelNewClient.id = "cancel-client-button";
  cancelNewClient.innerHTML = `Cancel`;
  newClientButtons.appendChild(cancelNewClient);

  document.querySelector('#cancel-client-button').onclick = async function (event) {
    event.preventDefault();
    document.querySelector("#client-button").style.display = 'inline';
    document.querySelector("#new-client-form").remove();
  }

  document.querySelector('#save-client-button').onclick = async function (event) {
    event.preventDefault();
    const client_name = document.querySelector('#client_name').value
    const client_notes = document.querySelector('#client_notes').value
    let clientExists = false
    for (let i = 0; i < response.clients.length; i++) {
      if (document.querySelector("#client_name").value == response.clients[i].client_name) {
        clientExists = true
      }
    }
    if (clientExists === false) {
      const csrfToken = document.cookie.split('=')[1].split('%')[0];
      addNewClient(csrfToken, client_name, client_notes)
      event.preventDefault();
      document.querySelector("#new-client-form").remove();
      document.querySelector("#client-button").style.display = 'block';
    } else {
      document.querySelector("#client-button").style.display = 'block';
      document.querySelector("#new-client-form").remove()
      const existingClientName = document.createElement("div");
      existingClientName.id = 'existing_client_name';
      existingClientName.innerHTML = 'Client already exists'
      document.querySelector('#add_client_container').appendChild(existingClientName);
    }
  }
}

function createNewPet(response) {
  document.querySelector("#pet-button").style.display = 'none';
  if (document.querySelector('#existing_pet_name') != null) {
    document.querySelector('#existing_pet_name').remove()
  }

  const addPetContainer = document.querySelector('#add_pet_container')
  const newPetForm = document.createElement("form");
  newPetForm.className = "form-container";
  newPetForm.id = 'new-pet-form';
  addPetContainer.appendChild(newPetForm);

  const inputPetElem = document.createElement('input');
  inputPetElem.type = 'hidden';
  inputPetElem.name = 'csrfmiddlewaretoken';
  inputPetElem.value = '{{ csrf_token }}';
  newPetForm.appendChild(inputPetElem);

  const addNewPetContainer = document.createElement("div");
  addNewPetContainer.id = "new_pet_container";
  newPetForm.appendChild(addNewPetContainer);

  const newPetName = document.createElement("input");
  newPetName.type = "text";
  newPetName.id = 'pet_name';
  newPetName.placeholder = 'New pet name'
  addNewPetContainer.appendChild(newPetName);

  const newPetNotes = document.createElement("textarea");
  newPetNotes.name = "pet_notes"
  newPetNotes.rows = "4"
  newPetNotes.cols = "50"
  newPetNotes.type = "text";
  newPetNotes.id = 'pet_notes';
  newPetNotes.placeholder = 'New pet notes'
  addNewPetContainer.appendChild(newPetNotes);

  const newPetButtons = document.createElement("div");
  newPetButtons.id = "new_pet_buttons";
  newPetButtons.style = "display:block";
  addNewPetContainer.appendChild(newPetButtons);

  const saveNewPet = document.createElement("button");
  saveNewPet.className = "save-button";
  saveNewPet.id = "save-pet-button";
  saveNewPet.innerHTML = `Save`;
  newPetButtons.appendChild(saveNewPet);

  const cancelNewPet = document.createElement("button");
  cancelNewPet.className = "cancel-button";
  cancelNewPet.id = "cancel-pet-button";
  cancelNewPet.innerHTML = `Cancel`;
  newPetButtons.appendChild(cancelNewPet);

  document.querySelector('#cancel-pet-button').onclick = async function (event) {
    event.preventDefault();
    document.querySelector("#pet-button").style.display = 'inline';
    document.querySelector("#new-pet-form").remove();
  }

  document.querySelector('#save-pet-button').onclick = async function (event) {
    event.preventDefault();
    const pet_name = document.querySelector('#pet_name').value
    const pet_notes = document.querySelector('#pet_notes').value
    const owner_id = document.querySelector('#add_client').value
    let petExists = false
    for (let i = 0; i < response.pets.length; i++) {
      if (document.querySelector("#pet_name").value == response.pets[i].pet_name) {
        petExists = true
      }
    }
    if (petExists === false) {
      const csrfToken = document.cookie.split('=')[1].split('%')[0];
      event.preventDefault();
      document.querySelector("#new-pet-form").remove();
      document.querySelector("#pet-button").style.display = 'block';
      addNewPet(csrfToken, pet_name, pet_notes, owner_id);
      document.querySelector(`#add_pet`).remove();
      addPetOptions(owner_id);
    } else {
      document.querySelector("#pet-button").style.display = 'block';
      document.querySelector("#new-pet-form").remove()
      const existingPetName = document.createElement("div");
      existingPetName.id = 'existing_pet_name';
      existingPetName.innerHTML = 'Pet already exists'
      document.querySelector('#add_pet_container').appendChild(existingPetName);
    }
  }
}

function addNewPet(csrfToken, pet_name, pet_notes, owner_id) {
  fetch(`/api/add/pet`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
      pet_name: pet_name,
      pet_notes: pet_notes,
      owner_id: owner_id,
    }), credentials: 'same-origin',
  })
    .then(response => response.json())
    .then(e => {
      addPetOptions(e.owner)
    })
}

async function addPetOptions(client_id) {
  const response = await fetch(`/api/pet/` + client_id);
  const e = await response.json();
  getPets(e);
}

function getPets(response) {
  if (document.querySelector('#label_add_pet') != null) {
    document.querySelector('#label_add_pet').remove()
  }
  if (document.querySelector('#add_pet') != null) {
    document.querySelector('#add_pet').remove()
  }

  let addPetContainer = document.querySelector('#add_pet_container');
  if (addPetContainer === null) {
    addPetContainer = document.createElement('div');
    addPetContainer.id = 'add_pet_container'
  }
  const petLabel = document.createElement("label");
  petLabel.id = 'label_add_pet';
  petLabel.innerHTML = "Select Pet:";
  addPetContainer.appendChild(petLabel);

  const addPet = document.createElement("select");
  addPet.id = "add_pet";
  addPetContainer.appendChild(addPet);

  if (response.pets.length === 0) {
    if (document.querySelector('#add_pet') != null) {
      document.querySelector('#add_pet').style = "display:none;";
      document.querySelector('#label_add_pet').style = "display:none;";
    }
  } else {
    for (let i = 0; i < response.pets.length; i++) {
      const option = document.createElement("option");
      option.value = response.pets[i].id;
      option.text = response.pets[i].pet_name;
      addPet.appendChild(option);
    }
    document.getElementById('add_pet').lastChild.selected = 'selected'
  }
  enableSave();
}

function enableSave() {
  if (document.querySelector('#add_pet') === null || document.querySelector('#add_client') === null) {
    if (document.getElementById('modify') != null) {
      document.getElementById('modify').disabled = true;
    }
  } else if (document.querySelector('#add_vet').value === '' || document.querySelector('#add_client').value === '' || document.querySelector('#add_pet').value === '') {
    document.getElementById('modify').disabled = true;
  } else {
    document.getElementById('modify').disabled = false;
  }
}

function addNewClient(csrfToken, client_name, notes) {
  fetch(`/api/add/client`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
      client_name: client_name,
      notes: notes,
    }), credentials: 'same-origin',
  })
    .then(response => response.json())
    .then(e => {
      getClients(e)
    })
    .then(e => {
      addPetOptions(document.getElementById('add_client').value);
    })
}

function getClients(response) {
  if (document.getElementById('add_client') == null) {
    const addClientContainer = document.querySelector('#add_client_container')
    const clientLabel = document.createElement("label");
    clientLabel.innerHTML = "Select Client:";
    addClientContainer.appendChild(clientLabel);

    const clientSelect = document.createElement("select");
    addClientContainer.appendChild(clientSelect);
    clientSelect.id = "add_client";
  } else {
    const clientSelect = document.getElementById('add_client');
    while (clientSelect.firstChild) {
      clientSelect.removeChild(clientSelect.lastChild);
    }
  }
  if (response.clients.length === 0) {
    document.querySelector('#add_client').disabled = true;
  }

  for (let i = 0; i < response.clients.length; i++) {
    const option = document.createElement("option");
    option.value = response.clients[i].id;
    option.text = response.clients[i].client_name;
    document.getElementById('add_client').appendChild(option);
  }
  document.getElementById('add_client').lastChild.selected = 'selected'
}

async function saveAndLoad(csrfToken, add_vet, add_client, add_pet, add_app_date, add_timeslot, add_notes) {
  fetch(`/api/new_app_save/` + add_app_date, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
      add_notes: add_notes,
      add_vet: add_vet,
      add_client: add_client,
      add_pet,
      add_app_date: add_app_date,
      add_timeslot: add_timeslot,
    }), credentials: 'same-origin',
  })
    .then(response => {
      loadCalendar(add_app_date, 1)
    });
}

