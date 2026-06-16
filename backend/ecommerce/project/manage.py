#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# CORS
CORS(app, 
     origins=["https://ecommerce-major-project-n2om.vercel.app", 
              "http://localhost:3000", 
              "http://127.0.0.1:3000"],
     supports_credentials=True)

# Your routes
@app.route('/api/products')
def get_products():
    # your code
    pass

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)




def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
