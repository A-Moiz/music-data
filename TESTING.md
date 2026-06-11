## The website must contain a drop-down which lists four users.

Tested by checking if drop-down list in site contains all users.

---

## Selecting a user must display answers relevant to that user (see table below).

Tested by checking if answers change depending on selected user.

---

## The code written to calculate the answers to the questions must seem like it could handle different data if it were supplied, including the following edge-cases:

- ### User 4 has no data, so no questions apply to the user. Some intelligible statement should be shown to the user (e.g. "This user didn't listen to any songs.").
  Tested by going to user 4 and seeing if a message is displayed instead of the table with questions and answers.

---

- ### If a question doesn't apply (e.g. if no songs were ever listened to on a Friday night), the interface should completely hide the question and answer. Displaying the question and an empty result, or any kind of error, is not acceptable.
  Tested by checking if those specific rows are hidden in the table if no answer is found.

---

- ### If fewer than three (but more than zero) genres were listened to the site should list the top genres listened to. It must not display text like "Top 3 genres", but may say "Top genres" or "Top 2 genres" or similar.
  Tested by checking the question text in the table doesn't display "top 3 genres" for users that have less than 3 genres as their top genres.

---

## Unit tests must be written for at least one non-trivial function.

Unit tests in `common.test.mjs`

---

## The website must score 100 for accessibility in Lighthouse

Tested by checking if the accessibility score in lighthouse is 100 and making changes to html/css if it's not.
