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

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // If the user is logged in, show the star.
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
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

// When new story is submitted, add to page
async function addNewStoryOnPage(evt) {
    console.debug("addNewStoryOnPage");
    evt.preventDefault();

    // Extract values from the inputs of the Submit form
    const author = $('#submit-author').val();
    const title = $('#submit-title').val();
    const url = $('#submit-url').val();

    // Place data in object to run addStory() 
    const submitData = {title, author, url}; 

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

function putFavoriteStoriesOnPage(){
  console.debug("putFavoriteStoriesOnPage");

  $favStoriesList.empty();

  if(currentUser.favorites.length === 0){
    $favStoriesList.append("<h4>No favorites added!</h4>");
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
$allStoriesList.on("click", ".star", toggleFavorites);




