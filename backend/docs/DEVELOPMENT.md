# Development Guide

## Local Environment

The backend is developed using Python and FastAPI.

Run commands from the `backend/` directory unless otherwise specified.

## Activate the Virtual Environment

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Start the Development Server

```bash
uvicorn app.main:app --reload
```

The `--reload` option automatically restarts the server when application files change.

## Validate Python Syntax

```bash
python -m compileall -q app
```

Run this command from the backend directory.

## Update Dependencies

After installing a new dependency:

```bash
pip freeze > requirements.txt
```

Review the generated changes before committing.

## Testing

Automated tests will be maintained in the `tests/` directory.

Run tests with:

```bash
pytest
```

Pytest must be installed before running this command.

## Git Guidelines

- Use descriptive commit messages.
- Do not commit virtual environments.
- Do not commit `.env` files.
- Keep changes focused and review them before pushing.
- Test the application before committing.

## Development Workflow

1. Implement one feature or module.
2. Validate Python syntax.
3. Run relevant tests.
4. Start the development server.
5. Verify the API behavior.
6. Review Git changes.
7. Commit and push the completed work.
