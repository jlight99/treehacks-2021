from collections import defaultdict
from flask import Flask, request
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
import json
import uuid
from database import db_init, add_message_thread, add_message, get_message_threads

from typing import List, Dict, Set, Tuple

########################### FLASK and SOCKETIO setup ###########################
app = Flask('web_server')
CORS(app)
cors = CORS(app, resources={
	r'/*': {
		'origin': '*'
	}
})

socketio = SocketIO(app, cors_allowed_origins='*')


########################### Database setup ###########################
db = db_init()


############################### Global Variables ###############################
# Stores all parties in a dictionary keyed by `party_id`
page_sids: Dict[str, Set[str]] = defaultdict(set)
user_to_page: Dict[str, str] = {}
thread_messages: Dict[str, List[dict]] = defaultdict(list)
page_threads: Dict[str, List[str]] = defaultdict(list)
mouse_pos: Dict[str, Tuple[int, int]] = {}

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
    sid = request.sid
    user_id = msg['user']
    page_url = msg['url']
    page_sids[page_url].add(sid)
    user_to_page[user_id] = page_url
    print(f'client {user_id} connected to page {page_url}')

    # Send party ID back to the host
    socketio.emit('connect_to_doc',
                  f"connected to doc {page_url}!", room=sid)


def _add_msg_content(msg):
    def add_thread():
        user_id = msg['user']
        page_url = user_to_page[user_id]
        page_threads[page_url].append(msg["message_thread_id"])
        add_message_thread(db, {"x": msg["x"], "y": msg["y"], "id": msg["message_thread_id"]})

    thread_id = msg["message_thread_id"]
    if thread_id not in thread_messages:
        add_thread()

    new_msg = {"user": msg["user"], "body": msg["body"], "timestamp": msg["timestamp"]}
    thread_messages[msg["message_thread_id"]].append(new_msg)
    add_message(db, new_msg, msg["message_thread_id"])


@socketio.on('add_msg')
def add_msg(msg):
    """ Add message to page """
    user_id = msg['user']
    page_url = user_to_page[user_id]
    print(f'{user_id} sent msg: {msg}')
    _add_msg_content(msg)

    # Send party ID back to the all users connected to the doc
    socketio.emit('add_msg', msg)

@socketio.on('move_cursor')
def move_cursor(msg):
    """ Move cursor page """
    user_id = msg['user']
    page_url = user_to_page[user_id]
    mouse_pos[user_id] = (msg["x"], msg["y"])

    # Send party ID back to the all users connected to the doc
    socketio.emit('move_cursor', msg)

############################## Starting The Server #############################


if __name__ == '__main__':
    print('Server started')
    socketio.run(app, host='localhost', port=8080)
