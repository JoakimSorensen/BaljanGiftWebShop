# Baljangåvan ☕️🎉

Skapad av:
- Filip Nilsson
- Eirik Funnemark
- Felicia Dahlström
- Sophie Lindberg
- Herman Svensk
- Marcus Olsson
- Tomas Gudmundsson
- Joakim Sorensen

# Installation

The application has been developed using PyCharm from JetBrains, with the repository root being the project root. However, it is not necessary to use PyCharm to test the application.

## Requirements
- Python 3.5 or later (tested using `3.6.1`)
- `pip` and related tools
- All packages specified in `requirements.txt`

## Installation without using PyCharm
The follwoing steps create a working installation for the application without the use of PyCharm. *Tested on macOS High Sierra (10.13.3)*
1. Create a working folder
2. Clone the repository, e.g: `git clone git@gitlab.ida.liu.se:baljangavan/baljangavan-app.git`
3. Move into the repository root, e.g: `cd baljangavan-app`
4. Create a virtual environment, e.g: `virtualenv -p python3 venv`
5. Activate the created venv, e.g: `source venv/bin/activate`
6. Install required dependencies, e.g: `pip install -r requirements.txt`
7. Start the application by running `run.py`, e.g: `python run.py`
8. The `flask` application listens on `localhost:5000`

## Installation using PyCharm
The following steps create the project outline as used by the developing team. *Tested on macOS High Sierra (10.13.3)*
1. Create a working folder
2. Clone the repository, e.g: `git clone git@gitlab.ida.liu.se:baljangavan/baljangavan-app.git`
3. Create a PyCharm project from the repository root
4. Create a virtual environment from a Python 3 interpreter
5. Select a random file in the project to be prompted to install required dependencies
6. Create a execution target for `run.py` using the virtual env created
7. Run the created execution target by pressing the play button


