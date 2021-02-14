# Content
```
// image
{
  content_type: 'image',
  position: {
    x : ,
    y : ,
    width: ,
    height : ,
  }
  content_url: '',      // Could just be a local url to the file
}
```

// message_thread - can contain [1 - n] messages

```
{
  position: {
    x : ,
    y : ,
  },
  message_thread_id: '',
  [                     // List of messages on this thread
    {
      author: '',
      body: '',
    },
    ...
  ]
}
```

# Actions
```
// add new message - created by right-clicking anywhere on the canvas
{
  author: '',
  body: '',
  message_thread_id: '',           // Generate a string of the current timestamp
  position: {
    x : ,
    y : ,
  },
}
```

```
// add a message to to an existing message thread. Know which one this is through `parent_message_id`.
[
  {
    author: '',
    body: '',
    message_thread_id: '',              // id of the message at the top of the thread
  },
  ...
]
```

```
// add image/icon to canvas
{
  image_url:
  position: {
    x : ,
    y : ,
    width : ,
    height : ,
  },
}
```
