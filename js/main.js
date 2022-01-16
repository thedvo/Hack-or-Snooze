"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body"); //refers to body tag  

const $storiesLoadingMsg = $("#stories-loading-msg"); //"Loading..." loader message as page awaits requests from API to complete before showing contents
const $allStoriesList = $("#all-stories-list");
// ordered list (ol) tag for list of all stories

const $loginForm = $("#login-form"); 
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login"); // anchor tag on navbar for user login
const $navUserProfile = $("#nav-user-profile"); // ancher tag on navbar which links to user profile
const $navLogOut = $("#nav-logout"); // anchor tag on navbar which is hidden but shows when user is logged in. 

const $navSubmit = $('#nav-submit');
const $submitForm = $('#submit-form');
/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $submitForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
