import requests
import os

# Create dummy files
with open("test1.txt", "w") as f:
    f.write("test content 1")
with open("test2.txt", "w") as f:
    f.write("test content 2")

url = "http://localhost:8000/api/v1/documents/upload"

files = [
    ('files', ('test1.txt', open('test1.txt', 'rb'), 'text/plain')),
    ('files', ('test2.txt', open('test2.txt', 'rb'), 'text/plain'))
]

try:
    response = requests.post(url, files=files)
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(f"Error: {e}")

# Clean up
os.remove("test1.txt")
os.remove("test2.txt")
