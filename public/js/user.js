// Clear the console (not related to the code's functionality but useful for debugging)
console.clear();

// Get references to the login and signup buttons from the HTML document.
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');

// Add a click event listener to the login button.
loginBtn.addEventListener('click', (e) => {
	// Get the parent element of the clicked button (likely a div or container).
	let parent = e.target.parentNode.parentNode;

	// Use Array.from() to convert the classList of the parent element to an array and find a specific class.
	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
		// Check if the found class is not "slide-up".
		if (element !== "slide-up") {
			// If it's not "slide-up", add the "slide-up" class to the parent element, triggering a slide-up animation.
			parent.classList.add('slide-up');
		} else {
			// If it is "slide-up," it means the form is currently in the signup state.
			// In that case, add the "slide-up" class to the signup button's parent and remove it from the parent element.
			signupBtn.parentNode.classList.add('slide-up');
			parent.classList.remove('slide-up');
		}
	});
});

// Add a click event listener to the signup button (similar logic but in reverse).
signupBtn.addEventListener('click', (e) => {
	// Get the parent element of the clicked button.
	let parent = e.target.parentNode;

	// Use Array.from() to convert the classList of the parent element to an array and find a specific class.
	Array.from(e.target.parentNode.classList).find((element) => {
		// Check if the found class is not "slide-up".
		if (element !== "slide-up") {
			// If it's not "slide-up", add the "slide-up" class to the parent element, triggering a slide-up animation.
			parent.classList.add('slide-up');
		} else {
			// If it is "slide-up," it means the form is currently in the login state.
			// In that case, add the "slide-up" class to the login button's parent and remove it from the parent element.
			loginBtn.parentNode.parentNode.classList.add('slide-up');
			parent.classList.remove('slide-up');
		}
	});
});
