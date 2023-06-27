Distinctiveness and Complexity: 

Regarding the distinctiveness of this project, I have opted to design and implement a web application for the internal use of a veterinary clinic. This application will provide the following services:
- the admin can create users that are able to manage the activity within the clinic;
- the admin can add or remove veterinarians. A veterinary can only be removed after assigning past and future appointment to another veterinary, therefore all medical history can be retained and all future appointment can be distributed on a case-by-case basis; 
- the admin can choose to edit or delete vets, clients, pets and their medical histories and past appointments, regardless of the user that created them;
- the users can make appointments for every veterinarian, create, edit and delete clients and pets. They can also edit or delete appointments, clients or pets created by them;
- the users can keep track of the medical history of the pacients.

This project is not a social platform, nor is it an e-commerce site, therefore there are no intrinsic similarities to the projects submitted before.

The application utilizes Django (5 models) on the back-end and JavaScript on the front-end: User, Veterinarian, Appointment, Client and Pet.

Also, in order to ensure that the web application is mobile-responsive, the styles.css file uses mostly the rem and viewport's width and height units of measure. For the differences in the width of the device, the @media rule was used to include a block of CSS properties for the max-width of 550px and another for a min-width of 551px. 

The complexity of this project consists of the interrelations between the elements used for the functionality of the web application. The application uses html to create the structure of the application, which is later populated, made dynamic and interactive by using javascript. A database is created using models, which can be accessed through endpoints that connect the functions defined in the views file. 

Functionality:

When the application is accessed, the path is defined in the urls.py file that calls the index function from the views file, that renders the index.html file which extends the layout.html file. 
When the DOM content of the page has been loaded, the function loadCalendar is called with the argument of the current date and page number. The current date is determined by another function (getCurrentDate), defined separately as this function is called by more than one function. When called, the loadCalendar function uses the fetch method to receive the necessary information. Afterwards, the response is transformed into json and then another function is called, the getSchedule function, which creates a button for adding a new appointment and a new container and then populates it with a list of all the appointments set for the requested date. After this function runs, using the date parameter defined for the loadCalendar function, another function is called, createCalendar(year, month), that creates a table in the form of a calendar, and populates it with the days of the selected month in the selected year, and a navigation between months and year, that, when clicked, will display the calendar for that selected month and year. Subsequently, the style of the selected day element is manipulated in order to aid the user in easily identifying the selected date.
The new appointment button, when clicked, calls the newApp function, with the argument "current_date" received from the getSchedule function, which uses the fetch method to receive the necessary information  and then calls the createNewApp function, with the argument "date". The createNewApp function checks if there are any vets created. If not, it redirects the user, if the user is the admin, to the vet_registere page. If a vet already exists, the function creates a form with all the necessary information required to create a new appointment: a select element for the existing vets, a select element for existing clients, a new client button that, when clicked, calls for the  createNewClient function to create a new client, a select element for existing pets(where the options are created by the getPets function, called by the addPetOptions function that requires as an argument the client id), a new pet button that, when clicked, calls for the createNewPet function to create a new pet, an input of type date that allowed the user to select the date of the appointment, a select element for unused timeslots (related to the selected vet) whose options are created by the getTimeslots function with the arguments timeslot_choices and all_used_timeslots fetched by the newApp functions,a textarea for any important notes related to the appointment, a save and a cancel button. The save button will only be enabled, by the enableSave function, when all the required information is inputted in their respective fields. When clicking the save button, the saveAndLoad function, which uses the fetch method, will be called, with the following arguments: csrfToken, add_vet, add_client, add_pet, add_app_date, add_timeslot, add_notes. Any saved appointment will be added to the list of appointments on the Calendar page.
Each appointment, when viewed by the creating user or by the admin, will have a button for editing the appointment and a button for deleting the appointment. 
Regarding the navigation displayed on the top of the page, onclick events have been attached to the following navigation items: Calendar, Search, Login, Register new user, Register new vet. When the Calendar item is clicked, the loadCalendar function is called with the argument of the current date and page number function is called; when the Search item is clicked, the searchApp function is called; when the Login item is clicked, the fetchHtmlAsText("login") function is called; when the Register new user item is clicked, the fetchHtmlAsText("register") function is called; when the Register new vet item is clicked, the loadRegisterVet() function is called.The loadRegisterVet() function also uses the fetchHtmlAsText function with the argument "vet_register".The fetchHtmlAsText function retrives a html page by the url given as a parameter and then transforms it into text.
When the Search item is clicked, the searchApp function is called which fetches a list of vets, a list of clients and a list of pets and calls the selectFilters function that creates a filter for the search by vet, client or pet and a search input element that can be used to search the results by name. It also automaticly calls the showSearch function with the list of vets as an argument and when another filter is selected it calls the showSearch function with the apropriate argument (vets, clients or pets). The showSearch function will create a list of the search results and when a result is cliked, one of the following functions will be called:  getAppsForVet,  getAppsForClient,  getAppsForPet. Each of these functions will fetch the information from the respetive endpoint and then call first the getPetProfile function and then the getAppointments. Also, a back button is created in order to return to search.
The getProfile function will create a container that will include all the information of the selected result (for example, when clicking on a vet, the vet's profile will contain the name and notes associated with the vet`s id). It will also include an edit button and a delete button.
The getAppointments will create a list of all the appointments for the selected result (for example, when clicking on a vet, all the appointments made for that vet will be displayed bellow the vet's profile)

Files created:
In the static\paw folder:
 1. The images folder contains the image(logo) used within the app
 2. index.js file contains the javascript used to create the functionality of the application with the use of over 40 different functions.
 3. styles.css contains the CSS that styles all the elements used within the app

In the templates\paw folders:
1. index.html
2. layout.html
3. login.html
4. register.html
5. vet_register.html

In the admin.py file all the models were registered in order to be able to access them on the site administration page.

The models.py file contains the 5 models used in this project:
1. User - required in order to create users that would be able to manage most of the functions of the application: creating clients and pets, editing or deleting them and creating, editing or deleting appointments
2. Veterinarian - required in order to keep track of the veterinaries available and important notes (for example specialty of the vet)
3. Appointment - required in order to keep track of all the appointments with the following information: vet, client and pet scheduled, date of the appointment, available timeslots(intervals of 30 min between 09:00 and 18:00), time of creation for each appointment and the user that made the appointment. In order to ensure that a vet is not booked twice for a timeslot, the condition of unique_together was required for 'vet', 'appointment_date' and 'timeslot'.
4. Client - required in order to keep track of the clients and important notes
5. Pet - required in order to keep track of the pets, the owner (client) and important notes

The settings.py file contains the configuration of the web app. After creating this django project, the following configurations were made for the functionality of the app:
 - in INSTALLED_APPS, I added the name of this application('paw') to this list 
 - in TEMPLATES, the BASE_DIR from 'DIRS'I added 'paw/templates'
 - in AUTH_USER_MODEL, I added "paw.User"

The urls.py file connects the endpoints to the functions located in the views.py file.

The views.py file contains the following Python functions:
- index => which returns the index.html page;
- login_view => when receiving a POST request, this function attempts to sign user in and then check if the authentication was successful. When receiving a GET request the login.html page is returned;
- register => when receiving a POST request made by the superuser, this function attempts to create a new user and then returns the index.html page. When receiving a GET request the register.html page is returned;
- logout_view => when receiving a GET request, this function calls the logout function imported from django.contrib.auth and then returns the index.html page;
- vet_register =>  when receiving a POST request made by the superuser, this function attempts to create a new veterinary and then returns the index.html page. When receiving a GET request the vet_register.html page is returned;
- appointments_api => when receiving a GET request, this function returns a list of vets, a list of clients and a list of pets. This function is used by the javascript file show the results of the filter in the search page;
- app_api_vet =>  when receiving a GET request, this function returns a key called "info_set" with the value of "vet" (this will be used by the javascript file in order to differentiate between the vet, client and pet APIs), a list of all the appointments for a selected vet, ordered by appointment date and timeslot, split in page objects of 10 appointments, the current user, if the user is authenticated and if the user is the admin. This function is used by the javascript file to show the profile of a vet and the related appointments;
- app_api_client => when receiving a GET request, this function returns a key called "info_set" with the value of "client" (this will be used by the javascript file in order to differentiate between the vet, client and pet APIs), a list of all the appointments for a selected client, ordered by appointment date and timeslot, split in page objects of 10 appointments, a list of pets owned by the selected client, the current user, if the user is authenticated and if the user is the admin. This function is used by the javascript file to show the profile of a client and the related appointments; 
- def api_add_client => when receiving a GET request, this function returns a list of the clients. When receiving a POST request, this function creates and saves a new client in the database;
- api_add_pet => when receiving a POST request, this function creates a new instance of a pet and then saves it to the database;
- app_api_pet => when receiving a GET request, this function retrieves a list of the pets owned by a selected client(identified by the client id);
- app_api_pet_apps => when receiving a GET request, this function returns a key called "info_set" with the value of "pet" (this will be used by the javascript file in order to differentiate between the vet, client and pet APIs), a list of all the appointments for a selected pet, ordered by appointment date and timeslot, split in page objects of 10 appointments, the current user, if the user is authenticated and if the user is the admin. This function is used by the javascript file to show the profile of a pet and the related appointments;
- appointments_date_api =>  when receiving a GET request, using the Paginator class imported from django.core.paginator, this function returns a list of all the appointments made for a certain date, ordered by timeslot, split in page objects of 10 appointments, the current user, if the user is authenticated and if the user is the admin;
- new_app_save_api => when receiving a GET request, this function returns a list of all the vets, clients and pets, a list of all the timeslots, a list of all the used timeslots for each of the vets and if the current user is the admin. When receiving a POST request and the user is authenticated, this function creates a new appointment instance and then saves it to the database;
- app_api_pet_delete => When receiving a POST request and the user is authenticated, this function deletes from the database a pet identified by id;
- app_api_client_delete => When receiving a POST request and the user is authenticated, this function deletes from the database a client identified by id;
- app_api_vet_delete => When receiving a POST request and the user is authenticated, this function deletes from the database a vet identified by id; 
- delete_appointment_api_id => When receiving a POST request and the user is authenticated, this function deletes from the database an appointment identified by id; 
- edit_appointment_api_id => when receiving a GET request, this function returns a list of all the vets, a list of all the clients, a list of all the pets, the information related to a specific appointment identified by id, a list of all the timeslots and a list of all the used timeslots for each of the vets. When receiving a POST request and the user is authenticated, this function modifies the selected appointment;
- app_api_pet_edit => when receiving a GET request, this function returns a list of all the all the information related to a pet identified by id. When receiving a POST request and the user is authenticated, this function modifies the selected pet;
- app_api_client_edit => when receiving a GET request, this function returns a list of all the all the information related to a client identified by id. When receiving a POST request and the user is authenticated, this function modifies the selected client;
- app_api_vet_edit => when receiving a GET request, this function returns a list of all the all the information related to a vet identified by id. When receiving a POST request, the user is authenticated and the current user is the admin, this function modifies the selected vet.

How to run the application:
1. run `python manage.py runserver 0.0.0.0:8000` to start the application
2. access the application in a browser using the address `http://localhost:8000`

Application flow:
1. Create a superuser - this is required, as only the admin will be able to create new vets and manage the entire application and all the appointments created by all the users. The users later created will only be able to create clients, pets and appointments end edit those created by the same user. You can create a super user by running the command `python manage.py createsuperuser`.
2. Create a user - this is required in order to be able to manage the appointments, clients and pets created by said user. Users can only be created by the admin. Any appointment, client or pet created by a user will be able to be edited or deleted only the user that created them or by the admin. To create a user you should access the "Register new user" tab in the navigation bar.
3. When accessing the application the calendar will be automatically loaded. On this page the current date will be selected and all the appointments made for this day will be shown under the calendar. A button will be displayed that will allow the user to create a new appointment. If there is no veterinary created, and the current user is the superuser, the page will be redirected to the Register a new vet page. If the current user is not the superuser, an alert will be displayed guiding the user to contact the admin in order to create a vet.
4. Create a veterinary - in order to be able to create an appointment, first, a veterinary needs to be created. This can only be achieved by the admin by accessing the "Register new vet" item on the navigation bar.
5. Create a new client and a pet - when creating a new appointment, the user can create a new client and a new pet by clicking the "Add new client" and the "Add new pet" buttons. For each client the list of the related registered pets will be displayed as options in a <select> element.
6. Create a new appointment - After selecting the vet, client and pet, the user can either choose to set the appointment date to the automatically selected date (the date selected in the calendar before clicking the new appointment button), or they can choose a new date from the date picker. The next step is to choose the timeslot for the appointment. The options shown will be only the remaining available timeslots for the selected vet. The last step is to click the "Save" button and the created appointment will be displayed under the calendar in reverse order of the timeslot allocated, on pages of a maximum of 10 appointments/page.
7. Edit or delete appointments - a user can edit or delete the appointments made by them and the admin cand edit or delete all appointments. When clicking the edit button, a new form will be displayed with all the appointment`s information in the same fields necessary when creating a new appointment. This can all be edited and then saved. 
8. Searching for an appointment - when clicking the "Search" navigation item a page will be displayed where the user can choose to filter the results by vet, client or pet and then either choose from all the results or type the name in the search bar. Each result can be clicked, and a new page will be loaded with the profile of the result chosen (vet, client or pet) and a list of the appointments related to the search result. After reviewing the results, the user can click on the back button to return to the filtering stage and search for another entry. 
9. Editing and deleting vets - when accessing the profile of the vet, client or pet, from the search results, a user is able to edit or delete clients and pets created by them, while the admin is able to edit or delete all the vets, clients or pets.
