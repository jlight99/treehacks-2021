from collections import defaultdict
from flask import Flask, request
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
import json
import uuid

from typing import List, Dict, Set


########################### FLASK and SOCKETIO setup ###########################
app = Flask('web_server')
CORS(app)
cors = CORS(app, resources={
	r'/*': {
		'origin': '*'
	}
})

socketio = SocketIO(app, cors_allowed_origins='*')


class MessageThread:
    x: str
    y: str
    thread_id: str
    messages: List[str]


############################### Global Variables ###############################
# Stores all parties in a dictionary keyed by `party_id`
page_users: Dict[str, Set[str]] = defaultdict(set)
user_to_page: Dict[str, str] = {}
thread_messages: Dict[str, List[dict]] = defaultdict(list)
page_threads: Dict[str, List[str]] = defaultdict(list)


################################ HTML Rendering ################################
# This method is only used to render the test webpage and can be diabled on your
# own webserver
@app.route('/')
def root_page():
	return "hi"


############################### Utility Functions ##############################


############################ SocketIO Event Handlers ###########################

@socketio.on('connect')
def connected():
    """ Always called when frontends or hosts initially connect """
    print(f'client with sid {request.sid} connected')


@socketio.on('connect_to_doc')
def handle_host_connect(msg):
    """ Registers client to doc """
    user_id = request.sid
    page_url = msg
    page_users[page_url].add(user_id)
    user_to_page[user_id] = page_url

    # Send party ID back to the host
    socketio.emit('connect_to_doc',
                  f"connected to doc {page_url}!", room=user_id)


def _add_msg_content(msg):
    def add_thread():
        user_id = request.sid
        page_url = user_to_page[user_id]
        page_threads[page_url].append(msg["message_thread_id"])

    print(msg)
    thread_id = msg["message_thread_id"]
    if thread_id not in thread_messages:
        add_thread()
    thread_messages[msg["message_thread_id"]].append(
        {"user": msg["user"], "body": msg["body"], "timestamp": msg["timestamp"]})


@socketio.on('add_msg')
def add_msg(msg):
    """ Add message to page """
    user_id = request.sid
    page_url = user_to_page[user_id]
    _add_msg_content(msg)

    # Send party ID back to the all users connected to the doc
    for user in page_users[page_url]:
        socketio.emit('add_msg', msg, room=user)

# @socketio.on('move_cursor')
# def move_cursor(msg):
#     """ Move cursor page """
#     user_id = request.sid
#     page_url = user_to_page[user_id]
#     _add_msg_content(msg)

#     # Send party ID back to the all users connected to the doc
#     for user in page_users[page_url]:
#         socketio.emit('add_msg', msg, room=user)

############################## Starting The Server #############################


if __name__ == '__main__':
    print('Server started')
    socketio.run(app, host='localhost', port=8080)
