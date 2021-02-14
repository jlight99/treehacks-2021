# Convo

## Inspiration
Emoji reactions. Disappearing snaps. 15 second Tik Toks. 140 word tweets. What do all of these have in common?
They share many traits with the vast majority of social media today: they encourage short-form, short-lived, linear conversations just for getting a quick reaction and nothing more. These platforms make it near-impossible to have a long-form, meaningful conversation with anyone since interesting ideas are quickly buried away in a fury of reactions and stickers and memes.

**Content-focused social media may be the answer.** We designed a new social network centred around what you actually want to talk about. Numerous studies have shown that technology has resulted in our attention snaps becoming shorter than ever. Being 3 college students, we're constantly surrounded by distractions ourselves too. We're hungry for the next notification, the next distraction, the next thing to put our attention on. Using this background, we designed Convo with two main principles:
1. Keep content in focus so conversations could be kept on track
2. Keep conversation non-linear so good ideas could be contributed to any part of the conversation—at any time.

## What it does
Find something interesting to talk about? Drop the link into Convo, it'll generate a convo link for you. Share this link with your friends (either on Convo or through another social platform). Now, the fun starts!

Convo allows you to see your content as the background and converse all over it. Write comments at different places. Reply to your friends comments. See what part of the content your friends are interacting with.

And when you're done, have a library of shared content you and your friends could scroll through and remember your conversations by.

## How we built it
We built a web app using React on the frontend, Python Flask on the backend, web sockets to communicate between the two, and Firestore for data storage.

## How to see it in action
![screenshot](/public/convo.png)<br />

### run client
```
npm install && npm start
```

### run server
```
pip install -r requirements.txt && python server.py
```
