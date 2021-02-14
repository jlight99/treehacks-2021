# Content

```
// image
{
  position: {
    x: ,
    y: ,
    width: ,
    height: ,
  }
  content_url: '',      // Could just be a local url to the file
}
```

// message_thread - can contain [1 - n] messages

```
{
  x: ,
  y: ,
  message_thread_id: '',
  messages: [                     // List of messages on this thread
    {
      user: '',
      body: '',
      timestamp: '',
    },
    ...
  ]
}
```

# Actions

```
// add new message/new message to thread - created by right-clicking anywhere on the canvas
{
  user: '',
  body: '',
  message_thread_id: '',           // Generate a string of the current timestamp
  x: ,
  y: ,
  timestamp: '',
}
```

```
// add image/icon to canvas
{
  image_url:
  position: {
    x: ,
    y: ,
    width: ,
    height: ,
  },
}
```

```
// mouse position
{
  user: '',
  position: {
    x: ,
    y: ,
  }
}
```
