"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
// Basically makes it seem like the page refreshes when you click the "Hack or Snooze" logo on the navbar. 
        //hides the page items 

function navAllStories(evt) {
  console.debug("navAllStories", evt);

  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);
// #nav-all refers to the anchor tag which contains the "Hack or Snooze" logo on the nav bar. When it's clicked, it will run navAllStories. 

/** Show login/signup on click on "login" */
// shows login and signup forms when you click "Login" button on navbar 

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logs in, update the navbar to reflect that. */
// updates the nav bar after the user logs in to hide the "Log In" button and instead show a "Log Out" button. Also show's the user's username.

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows submit form for new story on click on "Submit"
function navSubmitClick(evt){
    console.debug("navSubmitClick", evt);
    hidePageComponents();
    $submitForm.show();
}
$navSubmit.on('click', navSubmitClick);

// When user clicks Favorites in navbar
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoriteStoriesOnPage();
}
$navFavorite.on('click', navFavoritesClick);


// User's own Stories List
function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);
