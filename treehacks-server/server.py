# from flask import Flask
# from flask import request
import asyncio
import websockets

# app = Flask(__name__)

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

async def hello(websocket, path):
    # name = await websocket.recv()
    # print(f"< {name}")

    greeting = f"Hello bob!"

    await websocket.send(greeting)
    print(f"> {greeting}")

start_server = websockets.serve(hello, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()