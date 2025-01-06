from http import HTTPStatus

from fastapi.testclient import TestClient

from coqueiral_fastapi.hello_world import app


def test_main():
    client = TestClient(app)
    response = client.get('/')
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'Hello World!'}
