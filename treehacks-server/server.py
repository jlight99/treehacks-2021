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


############################### Global Variables ############################### 
# Stores all parties in a dictionary keyed by `party_id`
users: Dict[str, Set[str]] = defaultdict(set)


################################ HTML Rendering ################################ 
# This method is only used to render the test webpage and can be diabled on your 
# own webserver
@app.route('/')
def root_page():
	return "hi"


############################### Utility Functions ############################## 


############################ SocketIO Event Handlers ###########################

# Always called when frontends or hosts initially connect
@socketio.on('connect')
def connected():
    print(f'client with sid {request.sid} connected')

# Registers client to doc
@socketio.on('connect_to_doc')
def handle_host_connect(msg):
    user_id = request.sid
    doc_url = msg["url"]
    users[doc_url].add(user_id)
	
	# Send party ID back to the host
    socketio.emit('connect_host', "connected to doc!", room = user_id)

############################## Starting The Server #############################

if __name__=='__main__':
	try:
		print('Server started')
		socketio.run(app, host='localhost', port=8080)
	except:
		pass