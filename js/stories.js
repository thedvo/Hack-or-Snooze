"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // If the user is logged in, show the star.
  const showStar = Boolean(currentUser); // constructor used to create boolean objects

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? addDeleteHTML() : ""}
        ${showStar ? addStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// Creates delete button for stories created by user
function addDeleteHTML(){
  return `<span class="trash-can">
            <i class="fas fa-trash-alt"></i>
          </span>`;
}

// Creates star button for adding/removing favorites
function addStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";

  return `<span class="star">
            <i class="${starType} fa-star"></i>
          </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}


// Delete Story on Page
async function deleteStory(evt){
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // Refreshes story list
  putUserStoriesOnPage();

}
$ownStories.on("click", ".trash-can", deleteStory);


// Add New Story to Page
async function addNewStoryOnPage(evt) {
    console.debug("addNewStoryOnPage");
    evt.preventDefault();

    // Extract values from the inputs of the Submit form
    const author = $('#submit-author').val();
    const title = $('#submit-title').val();
    const url = $('#submit-url').val();
    const username = currentUser.username;

    // Place data in object to run addStory() 
    const submitData = {title, author, url, username}; 

    // Runs addStory(), then with its return value, run generateStoryMarkup()
    const storyData = await storyList.addStory(currentUser, submitData);
    const newStory = generateStoryMarkup(storyData);

    // Prepends new story to story list with return value from generateStoryMarkup()
    $allStoriesList.prepend(newStory);
    $allStoriesList.show();

    // Resets the form and hides it from page after submit. 
    $submitForm.trigger('reset');
    $submitForm.hide();
}
// When user clicks Submit in New Story Form. 
$submitForm.on("submit", addNewStoryOnPage);

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<p>No stories added by user yet!</p>");
  } 
  else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}


function putFavoriteStoriesOnPage(){
  console.debug("putFavoriteStoriesOnPage");

  $favStoriesList.empty();

  if(currentUser.favorites.length === 0){
    $favStoriesList.append("<p>No favorites added!</p>");
  }
  else{
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favStoriesList.append($story);
    }
  }
  $favStoriesList.show();
}

async function toggleFavorites(evt){
  console.debug("toggleFavorites");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
  else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$body.on("click", ".star", toggleFavorites);



