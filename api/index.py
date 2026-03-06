import sys
import os

# Add the root directory to the Python path so it can find the 'backend' module
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
# Add the backend directory so that backend.main can import engine directly
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from backend.main import app
